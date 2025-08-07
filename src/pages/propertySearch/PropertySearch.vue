<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Filtering from '@/components/filters/FilterBarSearch.vue'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import { usePropertyStore } from '@/stores/property'
// import { storeToRefs } from 'pinia'
import districtData from '@/assets/data/district.json'

const dealType = ref([])
const jeonseDeposit = ref({ min: null, max: null }) // 전세 보증금
const monthlyDeposit = ref({ min: null, max: null }) // 월세 보증금
const monthlyRent = ref({ min: null, max: null }) // 월세
const onlySecure = ref(false)
const region = ref({ city: null, district: null, parish: null })
const propertyList = ref([]) // 백엔드에서 받아온 응답 결과(매물 데이터)를 저장할 상태
// const propertyStore = usePropertyStore()
// const { address } = storeToRefs(propertyStore)
const sido = sessionStorage.getItem('sido')
const sigungu = sessionStorage.getItem('sigungu')
const eupmyendong = sessionStorage.getItem('eupmyendong')

// 예시 더미 데이터
const dummyDistricts = districtData

onMounted(() => {
  // fallback 안전처리
  const fallbackAddress = {
    sido: '서울특별시',
    sigungu: '강남구',
    eupmyendong: '논현동',
  }
  const currentAddress =
    sido && sigungu
      ? sido + sigungu
      : fallbackAddress
  // region 초기화
  region.value.city = currentAddress.sido
  region.value.district = currentAddress.sigungu
  region.value.parish = currentAddress.eupmyendong || null
  // 매물 불러오기
  fetchProperties()
})

const regionData = computed(() => {
  const cities = [...new Set(dummyDistricts.map(d => d.sido))].map(name => ({
    code: name,
    name,
  }))
  const currentCity = region.value.city
  const currentDistrict = region.value.district

  const districts = dummyDistricts
    .filter(d => d.sido === currentCity)
    .map(d => d.sigungu)
  const uniqueDistricts = [...new Set(districts)].map(name => ({
    code: name,
    name,
  }))

  const parishes = dummyDistricts
    .filter(d => d.sido === currentCity && d.sigungu === currentDistrict)
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

function handleRegionUpdate(updatedRegion) {
  region.value = updatedRegion
}

// 백엔드 API 요청
function fetchProperties() {
  const params = {
    dealType: dealType.value,
    jeonseDepositMin: jeonseDeposit.value.min,
    jeonseDepositMax: jeonseDeposit.value.max,
    monthlyDepositMin: monthlyDeposit.value.min,
    monthlyDepositMax: monthlyDeposit.value.max,
    monthlyRentMin: monthlyRent.value.min,
    monthlyRentMax: monthlyRent.value.max,
    sido: region.value.city,
    sigungu: region.value.district,
    eupmyendong: region.value.parish,
    onlySecure: onlySecure.value,
    limit: 20,
  }

  axios
    .get('/api/properties', { params })
    .then(res => {
      console.log('매물 결과:', res.data)
      propertyList.value = res.data
    })
    .catch(err => console.error('매물 요청 실패:', err))
}
</script>

<template>
  <div class="PropertySearch">
    <!-- 현재 위치와 타이틀 -->
    <div class="guide">
      <!-- 현재 위치 -->
      <div class="location">
        <span class="marker"><img src="@/assets/images/search/marker.svg" alt="위치 아이콘" class="marker-icon" /></span>
        <span>
          현재
          <span class="highlight">{{ sido }} {{ sigungu }}
            {{ eupmyendong || '' }}</span>에 있어요
        </span>
      </div>
      <!-- 타이틀 -->
      <h1 class="title">원하는 매물을 검색해보세요</h1>
    </div>

    <div class="filtering">
      <Filtering :deal-type="dealType" :jeonse-deposit="jeonseDeposit" :monthly-deposit="monthlyDeposit"
        :monthly-rent="monthlyRent" :only-secure="onlySecure" :region="region" :region-data="regionData"
        @update:dealType="val => (dealType.value = val)" @update:jeonseDeposit="val => (jeonseDeposit.value = val)"
        @update:monthlyDeposit="val => (monthlyDeposit.value = val)"
        @update:monthlyRent="val => (monthlyRent.value = val)" @update:onlySecure="val => (onlySecure.value = val)"
        @update:region="handleRegionUpdate" @filterCompleted="fetchProperties" />
    </div>

    <!-- 매물 리스트 -->
    <div class="property-list">
      <!-- 매물 카드 컴포넌트 -->
      <!-- 부모에서 이렇게 바꿔줘야 함 -->
      <PropertyCard v-for="item in propertyList" :key="item.propertyId" :price="item.transactionType === 'JEONSE'
        ? item.jeonseDeposit
        : item.monthlyDeposit
        " :title="item.name" :area="item.exclusiveAreaM2" :supplyArea="item.supplyAreaM2" :floor="item.floor"
        :totalFloors="item.totalFloors" :direction="item.mainDirection" :address="item.roadAddress"
        :isWished="item.isFavorite" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.PropertySearch {
  width: 100%;
  min-width: rem(375px);
  max-width: rem(600px);
  height: 100vh;
  padding: 100px 40px 0 40px;
}

.guide {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start; // 수평 왼쪽 정렬
  text-align: left;
  margin-bottom: 30px;
}

.marker-icon {
  height: rem(14px);
  margin-bottom: 0.2rem;
}

.location {
  font-size: 0.9rem;
  color: var(--black);
  margin-bottom: 0.4rem;
}

.highlight {
  color: var(--primary-color);
  font-weight: 600;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
}

.filter-bar {
  margin-bottom: 8px;
}

.safe-check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #777;
  margin-bottom: 16px;
}

.property-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
