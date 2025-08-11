<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import FilterBarFavorite from '@/components/filters/FilterBarFavorite.vue'
import Navbar from '@/components/layouts/Navbar.vue'
import { usePropertyStore } from '@/stores/property'
import api from '@/api/property'

const propertyStore = usePropertyStore()

// 필터 상태
const favOnlySecure = ref(false)
const favSelectedChecklist = ref('전체')
const favRegion = ref({ city: null, district: null, parish: null })

// 리스트 상태
const propertyList = ref([])

// (임시) 지역 옵션
const dummyDistricts = [
  { sido: '서울특별시', sigungu: '서초구', eupmyeondong: '반포동' },
  { sido: '서울특별시', sigungu: '강남구', eupmyeондong: '논현1동' },
  { sido: '서울특별시', sigungu: '마포구', eupmyeondong: '서교동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '매산동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '인계동' },
]

// 지역 옵션 계산
const getRegionData = computed(() => {
  const cities = [...new Set(dummyDistricts.map(d => d.sido))].map(name => ({ code: name, name }))
  const districts = dummyDistricts
    .filter(d => d.sido === favRegion.value.city)
    .map(d => d.sigungu)
  const uniqueDistricts = [...new Set(districts)].map(name => ({ code: name, name }))
  const parishes = dummyDistricts
    .filter(d => d.sido === favRegion.value.city && d.sigungu === favRegion.value.district)
    .map(d => d.eupmyeondong)
  const uniqueParishes = [...new Set(parishes)].map(name => ({ code: name, name }))
  return { cities, districts: uniqueDistricts, parishes: uniqueParishes }
})

function toCard(item) {
  const src = item.property ?? item
  return {
    propertyId: src.propertyId ?? src.id,
    transactionType: src.transactionType ?? src.dealType ?? 'JEONSE',
    price: src.transactionType === 'JEONSE'
      ? (src.jeonseDeposit ?? src.deposit ?? src.price ?? 0)
      : (src.monthlyDeposit ?? src.deposit ?? 0),
    monthlyRent: src.transactionType === 'JEONSE' ? null : (src.monthlyRent ?? src.rent ?? 0),
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
    isFavorite: true,             // 관심 목록이므로 true로 고정
    isSafe: src.isSafe ?? false,
  }
}

// 관심 매물 불러오기
async function loadFavorites() {
  try {
    const params = {}
    if (favOnlySecure.value) params.onlySecure = true

    const res = await api.getFavProperties()
    const raw = res?.data?.data ?? res?.data?.content ?? res?.data ?? res ?? []
    const arr = Array.isArray(raw) ? raw : []
    propertyList.value = arr.map(toCard)
  } catch (err) {
    console.error('관심 매물 조회 실패:', err)
    propertyList.value = []
  }
}

// 최초 로딩 + 찜 변경 시 재로딩 + 안심 매물 토글 시 재조회
onMounted(loadFavorites)
watch(() => propertyStore.favoriteVersion, loadFavorites)
watch(favOnlySecure, loadFavorites)
</script>

<template>
  <div class="PropertyFav">
    <h2 class="title">찜하신 관심매물이에요</h2>

    <!-- 필터바 -->
    <FilterBarFavorite
      :checklist-items="['체크리스트A','체크리스트B','체크리스트C','체크리스트D']"
      :selected="favSelectedChecklist"
      :onlySecure="favOnlySecure"
      :region="favRegion"
      :region-data="getRegionData"
      @update:selected="val => (favSelectedChecklist = val)"
      @update:onlySecure="val => (favOnlySecure = val)"
      @update:region="val => (favRegion = val)"
    />

    <!-- 관심 매물 카드 리스트 -->
    <div class="card-list" v-if="propertyList.length">
      <PropertyCard
        v-for="property in propertyList"
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
  padding: 2rem;
  padding-top: 6rem;
  background-color: #fff;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
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
