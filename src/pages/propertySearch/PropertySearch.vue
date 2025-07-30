<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import Filtering from '@/components/filters/FilterBarSearch.vue'

const dealType = ref([])
const deposit = ref({ min: null, max: null })
const monthly = ref({ min: null, max: null })
const onlySecure = ref(false)
const region = ref({ city: null, district: null, parish: null })

// 예시 더미 데이터)
const dummyDistricts = [
  { sido: '서울특별시', sigungu: '강남구', eupmyeondong: '역삼동' },
  { sido: '서울특별시', sigungu: '강남구', eupmyeondong: '삼성동' },
  { sido: '서울특별시', sigungu: '마포구', eupmyeondong: '서교동' },
  { sido: '서울특별시', sigungu: '마포구', eupmyeondong: '합정동' },
  { sido: '부산광역시', sigungu: '해운대구', eupmyeondong: '우동' },
  { sido: '부산광역시', sigungu: '해운대구', eupmyeondong: '중동' },
  { sido: '부산광역시', sigungu: '수영구', eupmyeondong: '광안동' },
]
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
    depositMin: deposit.value.min,
    depositMax: deposit.value.max,
    monthlyMin: monthly.value.min,
    monthlyMax: monthly.value.max,
    city: region.value.city,
    district: region.value.district,
    parish: region.value.parish,
    onlySecure: onlySecure.value,
  }

  axios
    .get('/api/properties', { params })
    .then(res => {
      console.log('매물 결과:', res.data)
      // TODO: 결과값 저장 처리
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
        <span class="marker"
          ><img
            src="@/assets/images/search/marker.svg"
            alt="위치 아이콘"
            class="marker-icon"
        /></span>
        <span>
          현재 <span class="highlight">서울시 강남구 논현1동</span>에 있어요
        </span>
      </div>
      <!-- 타이틀 -->
      <h1 class="title">원하는 매물을 검색해보세요</h1>
    </div>

    <div class="filtering">
      <Filtering
        :deal-type="dealType"
        :deposit="deposit"
        :monthly="monthly"
        :only-secure="onlySecure"
        :region="region"
        :region-data="regionData"
        @update:dealType="val => (dealType.value = val)"
        @update:deposit="val => (deposit.value = val)"
        @update:monthly="val => (monthly.value = val)"
        @update:onlySecure="val => (onlySecure.value = val)"
        @update:region="handleRegionUpdate"
        @filterCompleted="fetchProperties"
      />
    </div>

    <!-- 매물 리스트 -->
    <div class="property-list">
      <!-- 매물 카드 컴포넌트 -->
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
