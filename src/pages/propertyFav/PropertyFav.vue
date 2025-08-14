<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import FilterBarFavorite from '@/components/filters/FilterBarFavorite.vue'
import Navbar from '@/components/layouts/Navbar.vue'
import { usePropertyStore } from '@/stores/property'
import { useChecklistStore } from '@/stores/checklist'
import api from '@/api/property'
import districtData from '@/assets/data/order-district.json'

const propertyStore = usePropertyStore()
const checklistStore = useChecklistStore()

// (닉네임 표기용, 없어도 동작에는 영향 없음)
const userName = ref('')

// 필터 상태
const favOnlySecure = ref(false)
// ✅ 기본값을 null: “전체” 제거. 초기엔 첫 체크리스트로 자동 선택.
const favSelectedChecklist = ref(null)
const favRegion = ref({ city: null, district: null, parish: null })

// 매물 리스트
const propertyList = ref([])

/* ---------- 체크리스트 탭: 스토어 → 라벨/ID ---------- */
const myChecklists = computed(() => checklistStore.myChecklists ?? [])
const checklistTabs = computed(() =>
  myChecklists.value.map(c => ({
    id: c.checklistId ?? c.id,
    label: c.title ?? c.name,
  })),
)
// ✅ 슬라이더에 보여줄 라벨들(“전체” 없음)
const checklistLabels = computed(() => checklistTabs.value.map(c => c.label))

// 라벨 → ID 역매핑
const selectedChecklistId = computed(() => {
  if (!favSelectedChecklist.value) return null
  const hit = checklistTabs.value.find(c => c.label === favSelectedChecklist.value)
  return hit?.id ?? null
})

/* ---------- 지역 옵션 계산 (검색 페이지 로직 동일) ---------- */
const regionData = computed(() => {
  const cities = [...new Set(districtData.map(d => d.sido))].map(name => ({ code: name, name }))
  const currentCity = favRegion.value.city
  const currentDistrict = favRegion.value.district

  const districtNamesRaw = [
    ...new Set(
      districtData
        .filter(d => d.sido === currentCity)
        .map(d => (d.sigungu ?? '').trim()),
    ),
  ]
  const hasRealDistricts = districtNamesRaw.some(Boolean)

  const districts = hasRealDistricts
    ? districtNamesRaw.filter(Boolean).map(name => ({ code: name, name }))
    : [{ code: '__NONE__', name: '해당없음' }]

  const parishRows = hasRealDistricts
    ? districtData.filter(d => d.sido === currentCity && d.sigungu === currentDistrict)
    : districtData.filter(d => d.sido === currentCity)

  const parishes = [
    ...new Set(parishRows.map(d => d.eupmyeondong).filter(Boolean)),
  ].map(name => ({ code: name, name }))

  return { cities, districts, parishes }
})

/* ---------- (선택) 로컬 태깅 규칙 — 서버 필터면 미사용 ---------- */
const checklistRules = {
  체크리스트A: src => src.ownerMatch === true,
  체크리스트B: src => src.mortgage === true,
  체크리스트C: src => src.illegalBuilding === true,
  체크리스트D: src => typeof src.jeonseRate === 'number' && src.jeonseRate >= 80,
}
function deriveChecklistTags(src) {
  const tags = []
  for (const [tag, rule] of Object.entries(checklistRules)) {
    try {
      if (rule(src)) tags.push(tag)
    } catch { /* ignore */ }
  }
  return tags
}

/* ---------- 서버 응답 → 카드 ---------- */
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
    price: txn === 'JEONSE'
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

/* ---------- API 호출 ---------- */
async function loadFavorites() {
  try {
    const params = {}
    const cid = selectedChecklistId.value
    if (cid) params.checklistId = cid        // ✅ 체크리스트 기준 서버 필터
    if (favOnlySecure.value) params.onlySecure = true
    if (favRegion.value.city) params.sido = favRegion.value.city
    if (favRegion.value.district) params.sigungu = favRegion.value.district
    if (favRegion.value.parish) params.eupmyeondong = favRegion.value.parish

    const res = await api.getFavProperties(params)
    const arr = Array.isArray(res) ? res : (Array.isArray(res?.content) ? res.content : [])
    propertyList.value = arr.map(toCard)
  } catch (err) {
    console.error('관심 매물 조회 실패:', err)
    propertyList.value = []
  }
}

/* ---------- 최초 로드 ---------- */
onMounted(async () => {
  try {
    if (typeof checklistStore.loadMyChecklists === 'function') {
      await checklistStore.loadMyChecklists()
    }
  } catch (e) {
    console.warn('체크리스트 로드 실패:', e)
  }
  // ✅ 체크리스트가 있으면 첫 항목을 자동 선택 ( “전체” 없음 )
  if (!favSelectedChecklist.value && checklistLabels.value.length > 0) {
    favSelectedChecklist.value = checklistLabels.value[0]
  }
  await loadFavorites()
})

// 즐겨찾기 변경시 재조회
watch(() => propertyStore.favoriteVersion, loadFavorites)

// 변경시 즉시 재조회
watch([favOnlySecure, favRegion, selectedChecklistId], loadFavorites)

/* ---------- 화면표시용(지역/안심만) ---------- */
const filteredList = computed(() =>
  propertyList.value.filter(item => {
    if (favOnlySecure.value && !item.isSafe) return false
    const sel = favRegion.value
    if (sel.city && item.region?.city !== sel.city) return false
    if (sel.district && item.region?.district !== sel.district) return false
    if (sel.parish && item.region?.parish !== sel.parish) return false
    return true
  })
)

// 이벤트 핸들러 (슬라이더에서 올라온 값 즉시 재조회)
function onChangeSelected(label) {
  favSelectedChecklist.value = label
  loadFavorites()
}
function onChangeOnlySecure(v) {
  favOnlySecure.value = v
  loadFavorites()
}
function onChangeRegion(v) {
  favRegion.value = v
  loadFavorites()
}
</script>

<template>
  <div class="PropertyFav">
    <div class="guide-text">
      <p class="nickname" v-if="userName">{{ userName }}님이</p>
      <h1 class="title">찜하신 관심매물이에요</h1>
    </div>

    <!-- 체크리스트: “전체” 없음 -->
    <FilterBarFavorite
      :checklist-items="checklistLabels"
      :selected="favSelectedChecklist"
      :onlySecure="favOnlySecure"
      :region="favRegion"
      :region-data="regionData"
      @update:selected="onChangeSelected"
      @update:onlySecure="onChangeOnlySecure"
      @update:region="onChangeRegion"
    />

    <div class="card-list" v-if="filteredList.length">
      <PropertyCard v-for="property in filteredList" :key="property.propertyId" v-bind="property" />
    </div>
    <div v-else class="no-data">관심 매물이 없습니다.</div>

    <Navbar />
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
.nickname { font-size: 0.9rem; color: var(--black); margin-bottom: 0.4rem; }
.title { font-size: 1.5rem; font-weight: 700; }
.card-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
.no-data { text-align: center; color: #aaa; margin-top: 2rem; }
</style>
