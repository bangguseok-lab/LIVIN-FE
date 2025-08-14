<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import FilterBarFavorite from '@/components/filters/FilterBarFavorite.vue'
import Navbar from '@/components/layouts/Navbar.vue'
import { usePropertyStore } from '@/stores/property'
import api from '@/api/property'

// /search에서 쓰는 동일한 지역 데이터 소스 사용
import districtData from '@/assets/data/order-district.json'

const propertyStore = usePropertyStore()

// (닉네임 표기 안전장치: 없으면 경고나지 않게 기본값)
const userName = ref('')

// 필터 상태
const favOnlySecure = ref(false)
const favSelectedChecklist = ref('전체')
const favRegion = ref({ city: null, district: null, parish: null })

// 매물 리스트 상태
const propertyList = ref([])

// /search 페이지 방식의 지역 데이터 계산 (도시/군구/읍면동)
const regionData = computed(() => {
  const cities = [...new Set(districtData.map(d => d.sido))].map(name => ({
    code: name,
    name,
  }))

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
    ? districtData.filter(
        d => d.sido === currentCity && d.sigungu === currentDistrict,
      )
    : districtData.filter(d => d.sido === currentCity)

  const parishes = [
    ...new Set(parishRows.map(d => d.eupmyeondong).filter(Boolean)),
  ].map(name => ({ code: name, name }))

  return { cities, districts, parishes }
})

// 체크리스트 규칙
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
    } catch  {
      // intentionally ignored (eslint no-unused-vars 회피)
    }
  }
  return tags
}

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
    isFavorite: true, // 관심 목록 고정
    isSafe: src.isSafe ?? src.safe ?? false,
    region: {
      city: src.region?.city ?? src.sido ?? null,
      district: src.region?.district ?? src.sigungu ?? null,
      parish: src.region?.parish ?? src.eupmyeondong ?? null,
    },
    ...raw,
    checklistTags: deriveChecklistTags(raw),
  }
}

async function loadFavorites() {
  try {
    const params = {}

    if (favOnlySecure.value) params.onlySecure = true
    if (
      favSelectedChecklist.value !== '전체' &&
      !isNaN(Number(favSelectedChecklist.value))
    ) {
      params.checklistId = Number(favSelectedChecklist.value)
    }
    if (favRegion.value.city) params.sido = favRegion.value.city
    if (favRegion.value.district) params.sigungu = favRegion.value.district
    if (favRegion.value.parish) params.eupmyeondong = favRegion.value.parish

    const res = await api.getFavProperties(params)
    const arr = Array.isArray(res)
      ? res
      : Array.isArray(res?.content)
        ? res.content
        : []

    propertyList.value = arr.map(toCard)
  } catch (err) {
    console.error('관심 매물 조회 실패:', err)
    propertyList.value = []
  }
}

// 최초 로드 + 즐겨찾기 변경시 갱신
onMounted(loadFavorites)
watch(() => propertyStore.favoriteVersion, loadFavorites)

// 화면 표시용 필터링 리스트
const filteredList = computed(() =>
  propertyList.value.filter(item => {
    if (favOnlySecure.value && !item.isSafe) return false
    if (favSelectedChecklist.value && favSelectedChecklist.value !== '전체') {
      if (!item.checklistTags?.includes(favSelectedChecklist.value))
        return false
    }
    const sel = favRegion.value
    if (sel.city && item.region?.city !== sel.city) return false
    if (sel.district && item.region?.district !== sel.district) return false
    if (sel.parish && item.region?.parish !== sel.parish) return false
    return true
  }),
)
</script>

<template>
  <div class="PropertyFav">
    <div class="guide-text">
      <p class="nickname" v-if="userName">{{ userName }}님이</p>
      <h1 class="title">찜하신 관심매물이에요</h1>
    </div>

    <!-- 필터바 -->
    <FilterBarFavorite
      :checklist-items="['체크리스트A', '체크리스트B', '체크리스트C', '체크리스트D']"
      :selected="favSelectedChecklist"
      :onlySecure="favOnlySecure"
      :region="favRegion"
      :region-data="regionData"
      @update:selected="val => (favSelectedChecklist = val)"
      @update:onlySecure="val => (favOnlySecure = val)"
      @update:region="val => (favRegion = val)"
    />

    <!-- 필터링된 리스트 -->
    <div class="card-list" v-if="filteredList.length">
      <PropertyCard
        v-for="property in filteredList"
        :key="property.propertyId"
        v-bind="property"
      />
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

.nickname {
  font-size: 0.9rem;
  color: var(--black);
  margin-bottom: 0.4rem;
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
