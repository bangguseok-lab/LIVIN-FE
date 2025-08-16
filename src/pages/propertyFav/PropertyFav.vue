<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import FilterBarFavorite from '@/components/filters/FilterBarFavorite.vue'
import { usePropertyStore } from '@/stores/property'
import { useChecklistStore } from '@/stores/checklist'
import { useFavFiltersStore } from '@/stores/favFilters'
import { storeToRefs } from 'pinia'
import api from '@/api/property'
import userAPI from '@/api/user'
import districtData from '@/assets/data/order-district.json'

const propertyStore = usePropertyStore()
const checklistStore = useChecklistStore()

// (닉네임 표기용, 없어도 동작에는 영향 없음)
const userName = ref('')

// 필터 상태
const favOnlySecure = ref(false)
// ✅ 기본값을 null: “전체” 제거. 초기엔 첫 체크리스트로 자동 선택.
const favFilters = useFavFiltersStore()
const { selectedLabels } = storeToRefs(favFilters) // ['체크1','체크2',...]

const favSelectedChecklist = selectedLabels
const favRegionDraft = ref({ city: null, district: null, parish: null })
const favRegionApplied = ref({ city: null, district: null, parish: null })

// 매물 리스트
const propertyList = ref([])

// 페이징 상태
const PAGE_SIZE = 20
const isLoading = ref(false)
const hasMore = ref(true)
const lastId = ref(null) // 서버로 넘길 커서

const favSelectedLabel = computed({
  get: () => selectedLabels.value[0] ?? '',
  set: label => {
    favFilters.setSelected(label ? [label] : []) // 항상 1개만 유지
  },
})

// 세션 저장/복원
const STORAGE = {
  onlySecure: 'fav.onlySecure',
  regionDraft: 'fav.regionDraft',
  regionApplied: 'fav.regionApplied',
}

function saveFilters() {
  try {
    sessionStorage.setItem('fav.onlySecure', String(!!favOnlySecure.value))
    sessionStorage.setItem(
      'fav.regionDraft',
      JSON.stringify(
        favRegionDraft.value ?? { city: null, district: null, parish: null },
      ),
    )
    sessionStorage.setItem(
      'fav.regionApplied',
      JSON.stringify(
        favRegionApplied.value ?? { city: null, district: null, parish: null },
      ),
    )
  } catch (e) {
    console.warn('fav filters save failed:', e)
  }
}

function restoreFilters() {
  try {
    const onlySecure = sessionStorage.getItem('fav.onlySecure')
    if (onlySecure !== null)
      favOnlySecure.value = onlySecure === 'true' || onlySecure === '1'

    const rd = sessionStorage.getItem('fav.regionDraft')
    if (rd)
      favRegionDraft.value = {
        city: null,
        district: null,
        parish: null,
        ...JSON.parse(rd),
      }

    const ra = sessionStorage.getItem('fav.regionApplied')
    if (ra)
      favRegionApplied.value = {
        city: null,
        district: null,
        parish: null,
        ...JSON.parse(ra),
      }
  } catch (e) {
    console.warn('fav filters restore failed:', e)
  }
}

// 체크리스트 탭
const myChecklists = computed(() => checklistStore.checklistFilters ?? [])
// 슬라이더용
const checklistItemsForSlider = computed(() => {
  const seen = new Set()
  return [...myChecklists.value]
    .reverse()
    .filter(c => {
      const id = c.checklistId
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })
    .map(c => ({ id: c.checklistId, label: (c.title || '').trim() }))
})
const checklistLabels = computed(() =>
  checklistItemsForSlider.value.map(x => x.label),
)

// 지역 옵션 계산
const regionData = computed(() => {
  const cities = [...new Set(districtData.map(d => d.sido))].map(name => ({
    code: name,
    name,
  }))
  const currentCity = favRegionDraft.value.city
  const currentDistrict = favRegionDraft.value.district

  const districtNamesRaw = [
    ...new Set(
      districtData
        .filter(d => d.sido === currentCity)
        .map(d => (d.sigungu ?? '').trim()),
    ),
  ]
  const hasRealDistricts = districtNamesRaw.some(Boolean)

  // 시군구가 하나도 없으면 "해당없음" 더미 항목 노출
  const districts = hasRealDistricts
    ? districtNamesRaw.filter(Boolean).map(name => ({ code: name, name }))
    : [{ code: '__NONE__', name: '해당없음' }]

  // 읍/면/동: 시군구가 있으면 (시도+시군구)로, 없으면 (시도만)으로 필터
  const parishRows = hasRealDistricts
    ? districtData.filter(
        d => d.sido === currentCity && d.sigungu === currentDistrict,
      )
    : districtData.filter(d => d.sido === currentCity)

  const parishes = [
    ...new Set(parishRows.map(d => d.eupmyeondong).filter(Boolean)),
  ].map(name => ({ code: name, name }))

  return { cities, districts, parishes }
})

// 로컬 태깅 규칙
const checklistRules = {
  체크리스트A: src => src.ownerMatch === true,
  체크리스트B: src => src.mortgage === true,
  체크리스트C: src => src.illegalBuilding === true,
  체크리스트D: src =>
    typeof src.jeonseRate === 'number' && src.jeonseRate >= 80,
}
function deriveChecklistTags(src) {
  const tags = []
  for (const [tag, rule] of Object.entries(checklistRules)) {
    try {
      if (rule(src)) tags.push(tag)
    } catch {
      /* ignore */
    }
  }
  return tags
}

// 서버 응답 → 카드
function toCard(item) {
  const src = item.property ?? item
  const txn = src.transactionType ?? src.dealType ?? 'JEONSE'
  const raw = {
    mortgage: src.mortgage ?? src.hasMortgage ?? false,
    ownerMatch: src.ownerMatch ?? src.residentMatch ?? false,
    illegalBuilding: src.illegalBuilding ?? false,
    jeonseRate: src.jeonseRate ?? null,
  }
  return {
    propertyId: src.propertyId ?? src.id,
    transactionType: txn,
    price:
      txn === 'JEONSE'
        ? (src.jeonseDeposit ?? src.deposit ?? src.price ?? 0)
        : (src.monthlyDeposit ?? src.deposit ?? 0),
    monthlyRent: txn === 'JEONSE' ? null : (src.monthlyRent ?? src.rent ?? 0),
    title: src.name ?? src.title ?? src.detailAddress ?? '',
    imageUrls: src.imageUrls ?? src.images ?? [],
    propertyType: src.propertyType ?? '',
    detailAddress: src.detailAddress ?? '',
    exclusiveArea: src.exclusiveAreaM2 ?? src.exclusiveArea ?? '',
    supplyArea: src.supplyAreaM2 ?? src.supplyArea ?? '',
    floor: src.floor ?? '',
    totalFloors: src.totalFloors ?? '',
    direction: src.mainDirection ?? src.direction ?? '',
    address: src.roadAddress ?? src.address ?? '',
    isFavorite: true,
    isSafe: src.isSafe ?? src.safe ?? false,
    region: {
      city: src.region?.city ?? src.sido ?? null,
      district: src.region?.district ?? src.sigungu ?? null,
      parish: src.region?.parish ?? src.eupmyeondong ?? null,
    },
    checklistId: src.checklistId ?? item.checklistId ?? null,
    ...raw,
    checklistTags: deriveChecklistTags(raw),
  }
}

// API 호출
async function loadFavorites(append = false) {
  if (isLoading.value) return
  if (append && !hasMore.value) return

  isLoading.value = true
  try {
    if (!append) {
      propertyList.value = []
      lastId.value = null
      hasMore.value = true
    }

    // ✅ 여기부터: URLSearchParams로 직접 구성
    const params = new URLSearchParams()

    // 체크리스트 다중 전송 (?checklistId=73&checklistId=74)
    selectedChecklistIds.value.forEach(id =>
      params.append('checklistId', String(id)),
    )

    if (favOnlySecure.value) params.append('onlySecure', 'true')
    if (favRegionApplied.value.city)
      params.append('sido', favRegionApplied.value.city)
    if (favRegionApplied.value.district)
      params.append('sigungu', favRegionApplied.value.district)
    if (favRegionApplied.value.parish)
      params.append('eupmyeondong', favRegionApplied.value.parish)

    params.append('limit', String(PAGE_SIZE))
    if (append && lastId.value != null)
      params.append('lastId', String(lastId.value))

    // axios/fetch 어느 쪽이든 URLSearchParams는 그대로 직렬화됩니다.
    const res = await api.getFavProperties(params)

    const arr = Array.isArray(res)
      ? res
      : Array.isArray(res?.content)
        ? res.content
        : []
    const newCards = arr.map(toCard)

    if (append) {
      const seen = new Set(propertyList.value.map(v => v.propertyId))
      for (const c of newCards)
        if (!seen.has(c.propertyId)) propertyList.value.push(c)
    } else {
      propertyList.value = newCards
    }

    if (newCards.length) lastId.value = newCards[newCards.length - 1].propertyId
    if (newCards.length < PAGE_SIZE) hasMore.value = false
  } catch (err) {
    console.error('관심 매물 조회 실패:', err)
    if (!append) propertyList.value = []
    hasMore.value = false
  } finally {
    isLoading.value = false
  }
}

const selectedChecklistIds = computed(() => {
  const label = favSelectedLabel.value
  if (!label) return []
  const found = checklistItemsForSlider.value.find(x => x.label === label)
  return found ? [found.id] : []
})

// 스크롤 핸들러
function handleScroll() {
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  if (scrollTop + windowHeight >= documentHeight - 200) {
    loadFavorites(true) // append 모드
  }
}
let scrollAttached = false
function attachScroll() {
  if (!scrollAttached) {
    window.addEventListener('scroll', handleScroll, { passive: true })
    scrollAttached = true
  }
}
function detachScroll() {
  if (scrollAttached) {
    window.removeEventListener('scroll', handleScroll)
    scrollAttached = false
  }
}

// 최초 로드
onMounted(async () => {
  userAPI
    .fetchNickname()
    .then(nick => (userName.value = nick || ''))
    .catch(e => console.warn('닉네임 로드 실패:', e))

  restoreFilters()
  try {
    if (typeof checklistStore.loadChecklistFilters === 'function') {
      await checklistStore.loadChecklistFilters()
    }
  } catch (e) {
    console.warn('체크리스트 로드 실패:', e)
  }

  await loadFavorites(false)
  attachScroll()
})

onUnmounted(detachScroll)

watch(
  () => propertyStore.favoriteVersion,
  () => loadFavorites(false),
)
watch([favOnlySecure, favRegionApplied, favSelectedLabel], () => {
  loadFavorites(false)
})

// 화면표시용(지역/안심만)
const filteredList = computed(() =>
  propertyList.value.filter(item => {
    if (favOnlySecure.value && !item.isSafe) return false
    const sel = favRegionApplied.value
    if (sel.city && item.region?.city !== sel.city) return false
    if (sel.district && item.region?.district !== sel.district) return false
    if (sel.parish && item.region?.parish !== sel.parish) return false
    return true
  }),
)

// 이벤트 핸들러 (슬라이더에서 올라온 값 즉시 재조회)
function onChangeSelected(label) {
  favSelectedLabel.value = label
  saveFilters()
  loadFavorites(false)
}
function onChangeOnlySecure(v) {
  favOnlySecure.value = v
  saveFilters()
  loadFavorites(false)
}

function onChangeRegion(v) {
  if (!v) return
  const city = v.city ?? v.sido ?? null
  const district = v.district ?? v.sigungu ?? null
  const parish = v.parish ?? v.eupmyeondong ?? null

  favRegionDraft.value = { city, district, parish }
  saveFilters()
}

// “완료” 버튼에서만 호출되어야 함
function onFilterCompleted() {
  favRegionApplied.value = { ...favRegionDraft.value }
  saveFilters()
  loadFavorites(false)
}
</script>

<template>
  <div class="PropertyFav">
    <div class="guide-text">
      <p class="nickname" v-if="userName">
        <span class="nickname__name">{{ userName }}</span
        >님이
      </p>
      <h1 class="title">찜하신 관심매물이에요</h1>
    </div>

    <!-- 체크리스트: “전체” 없음 -->
    <FilterBarFavorite
      :checklist-items="checklistLabels"
      :selected="favSelectedLabel"
      :onlySecure="favOnlySecure"
      :region="favRegionDraft"
      :region-applied="favRegionApplied"
      :region-data="regionData"
      @update:selected="onChangeSelected"
      @update:onlySecure="onChangeOnlySecure"
      @update:region="onChangeRegion"
      @filterCompleted="onFilterCompleted"
    />

    <div class="card-list" v-if="filteredList.length">
      <PropertyCard
        v-for="property in filteredList"
        :key="property.propertyId"
        v-bind="property"
      />
      <div v-if="isLoading" class="loading">불러오는 중…</div>
    </div>
    <div v-else class="no-data">관심 매물이 없습니다.</div>
  </div>
</template>

<style scoped lang="scss">
.PropertyFav {
  width: 100%;
  padding-left: rem(40px);
  padding-right: rem(40px);
  padding-top: rem(100px);
  padding-bottom: rem(62px);
  background-color: #fff;
}
.guide-text {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  margin-bottom: 30px;
}
.nickname {
  color: var(--black);
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
}
.nickname__name {
  color: var(--primary-color);
  font-weight: 700;
  margin-right: 2px;
}
.title {
  font-size: 1.5rem;
  font-weight: 700;
}
.card-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}
.no-data {
  text-align: center;
  color: #aaa;
  margin-top: 2rem;
}
</style>
