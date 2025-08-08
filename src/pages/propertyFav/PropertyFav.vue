<script setup>
import { ref, computed, onMounted } from 'vue'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import FilterBarFavorite from '@/components/filters/FilterBarFavorite.vue'
// import { getFavProperties } from '@/api/property'
import apiClient from '@/api/apiClient'
import Navbar from '@/components/layouts/Navbar.vue'

// 필터 상태 정의
const favOnlySecure = ref(false)
const favSelectedChecklist = ref('전체')
const favRegion = ref({ city: null, district: null, parish: null })

// 매물 리스트 상태
const propertyList = ref([])

const dummyDistricts = [
  { sido: '서울특별시', sigungu: '강남구', eupmyeondong: '논현1동' },
  { sido: '서울특별시', sigungu: '마포구', eupmyeondong: '서교동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '매산동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '인계동' },
]

// 지역 옵션 계산
const getRegionData = computed(() => {
  const cities = [...new Set(dummyDistricts.map(d => d.sido))].map(name => ({
    code: name,
    name,
  }))
  const districts = dummyDistricts
    .filter(d => d.sido === favRegion.value.city)
    .map(d => d.sigungu)
  const uniqueDistricts = [...new Set(districts)].map(name => ({
    code: name,
    name,
  }))
  const parishes = dummyDistricts
    .filter(
      d =>
        d.sido === favRegion.value.city && d.sigungu === favRegion.value.district,
    )
    .map(d => d.eupmyeondong)
  const uniqueParishes = [...new Set(parishes)].map(name => ({
    code: name,
    name,
  }))
  return {
    cities,
    districts: uniqueDistricts,
    parishes: uniqueParishes,
  }
})

// 관심 매물 리스트 불러오기
onMounted(async () => {
  try {
    const res = await apiClient.getFavProperties()
    propertyList.value = res.data
  } catch (err) {
    console.error('관심 매물 조회 실패:', err)
  }
})
</script>

<template>
  <div class="PropertyFav">
    <h2 class="title">찜하신 괌심매물이에요</h2>

    <!-- 필터바 컴포넌트 -->
    <FilterBarFavorite
      :checklist-items="[
        '체크리스트A',
        '체크리스트B',
        '체크리스트C',
        '체크리스트D'
      ]"
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
        :key="property.id"
        v-bind="property"
      />
    </div>
    <div v-else class="no-data">
      관심 매물이 없습니다.
    </div>
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
