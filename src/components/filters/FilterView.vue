<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import FilterBarSearch from './FilterBarSearch.vue'
import FilterBarFavorite from './FilterBarFavorite.vue'
import FilterBarChecklist from './FilterBarChecklist.vue'

// 모드 상태
const selectedMode = ref('search')

// 상태들
const depositRange = ref({ min: null, max: null })
const monthlyRange = ref({ min: null, max: null })

const checklistItems = [
  '체크리스트A',
  '체크리스트B',
  '체크리스트C',
  '체크리스트D',
  '체크리스트E',
  '체크리스트F',
  '체크리스트G',
  '체크리스트H',
]

// 지역 더미 데이터 - 패널 길이 테스트용으로 많이 넣음. dev에 넣을때 좀 뺴서 넣어야됨.
const dummyDistricts = [
  { sido: '서울특별시', sigungu: '강남구', eupmyeondong: '역삼동' },
  { sido: '서울특별시', sigungu: '강남구', eupmyeondong: '삼성동' },
  { sido: '서울특별시', sigungu: '마포구', eupmyeondong: '서교동' },
  { sido: '서울특별시', sigungu: '마포구', eupmyeondong: '합정동' },
  { sido: '부산광역시', sigungu: '해운대구', eupmyeondong: '우동' },
  { sido: '부산광역시', sigungu: '해운대구', eupmyeondong: '중동' },
  { sido: '부산광역시', sigungu: '수영구', eupmyeondong: '광안동' },
  { sido: '경기도', sigungu: '성남시 분당구', eupmyeondong: '정자동' },
  { sido: '경기도', sigungu: '성남시 분당구', eupmyeondong: '수내동' },
  { sido: '경기도', sigungu: '고양시 일산서구', eupmyeondong: '주엽동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '고등동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '교동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '매산동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '매향동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '남수동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '남창동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '북수동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '중동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '지동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '우만동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '인계동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '화서동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '행궁동' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '팔달로1가' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '팔달로2가' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '팔달로3가' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '팔달로4가' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '팔달로5가' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '팔달로6가' },
  { sido: '경기도', sigungu: '수원시 팔달구', eupmyeondong: '팔달로7가' },
]

// 지역 상태
const searchRegion = ref({ city: null, district: null, parish: null })
const favRegion = ref({ city: null, district: null, parish: null })
const checklistRegion = ref({ city: null, district: null, parish: null })

const currentRegion = computed(() => {
  if (selectedMode.value === 'search') return searchRegion.value
  if (selectedMode.value === 'favorite') return favRegion.value
  return checklistRegion.value
})

function handleRegionUpdate(region) {
  if (selectedMode.value === 'search') searchRegion.value = region
  else if (selectedMode.value === 'favorite') favRegion.value = region
  else checklistRegion.value = region
}

// 지역 옵션 목록 계산
const getRegionData = computed(() => {
  const cities = [...new Set(dummyDistricts.map(d => d.sido))].map(name => ({
    code: name,
    name,
  }))
  const currentCity = currentRegion.value?.city
  const currentDistrict = currentRegion.value?.district

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
watchEffect(() => {
  console.log('[Check getRegionData.value]', getRegionData.value)
})

// 상태들
const selectedDealTypes = ref([])
const searchOnlySecure = ref(true)
const favOnlySecure = ref(false)
const checklistOnlySecure = ref(false)

const favSelectedChecklist = ref('전체')
const checklistSelectedChecklist = ref('전체')

watch(
  () => getRegionData,
  val => {
    console.log('[FilterView] getRegionData changed:', val)
  },
  { immediate: true },
)
</script>

<template>
  <div class="filter-test-container">
    <h2>🔍 필터바 테스트</h2>

    <!-- 모드 버튼 -->
    <div class="mode-buttons">
      <button
        :class="{ active: selectedMode === 'search' }"
        @click="selectedMode = 'search'"
      >
        Search
      </button>
      <button
        :class="{ active: selectedMode === 'favorite' }"
        @click="selectedMode = 'favorite'"
      >
        Favorite
      </button>
      <button
        :class="{ active: selectedMode === 'checklist' }"
        @click="selectedMode = 'checklist'"
      >
        Checklist
      </button>
    </div>

    <!-- 모드별 렌더링 -->
    <!-- search -->
    <div v-if="selectedMode === 'search'" class="debug-box">
      <FilterBarSearch
        :dealType="selectedDealTypes"
        :deposit="depositRange"
        :monthly="monthlyRange"
        :onlySecure="searchOnlySecure"
        :region="searchRegion"
        :region-data="getRegionData"
        @update:dealType="val => (selectedDealTypes = val)"
        @update:deposit="val => (depositRange = val)"
        @update:monthly="val => (monthlyRange = val)"
        @update:onlySecure="val => (searchOnlySecure = val)"
        @update:region="handleRegionUpdate"
      />

      <h3>🔍 Search 모드 상태</h3>
      <p>
        <strong>거래유형:</strong>
        {{ JSON.stringify(selectedDealTypes, null, 2) }}
      </p>
      <p>
        <strong>보증금 범위:</strong>
        {{ JSON.stringify(depositRange, null, 2) }}
      </p>
      <p>
        <strong>월세 범위:</strong> {{ JSON.stringify(monthlyRange, null, 2) }}
      </p>
      <p><strong>Only Secure:</strong> {{ searchOnlySecure }}</p>
      <p>
        <strong>선택된 지역:</strong>
        {{ JSON.stringify(searchRegion, null, 2) }}
      </p>
    </div>

    <div v-else-if="selectedMode === 'favorite'">
      <FilterBarFavorite
        :checklist-items="checklistItems"
        :selected="favSelectedChecklist"
        :onlySecure="favOnlySecure"
        :region="favRegion"
        :region-data="getRegionData"
        @update:selected="val => (favSelectedChecklist = val)"
        @update:onlySecure="val => (favOnlySecure = val)"
        @update:region="handleRegionUpdate"
      />
    </div>

    <div v-else-if="selectedMode === 'checklist'">
      <FilterBarChecklist
        :checklist-items="checklistItems"
        :selected="checklistSelectedChecklist"
        :onlySecure="checklistOnlySecure"
        :dealType="selectedDealTypes"
        :deposit="depositRange"
        :monthly="monthlyRange"
        :region="checklistRegion"
        :region-data="getRegionData"
        @update:selected="val => (checklistSelectedChecklist = val)"
        @update:onlySecure="val => (checklistOnlySecure = val)"
        @update:dealType="val => (selectedDealTypes = val)"
        @update:deposit="val => (depositRange = val)"
        @update:monthly="val => (monthlyRange = val)"
        @update:region="handleRegionUpdate"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.filter-test-container {
  width: 100%;
  min-width: rem(450px);
  margin: 0 auto;
  background-color: var(--white);
  border: rem(1px) solid #ccc;
  padding: rem(50px) rem(24px);
  box-sizing: border-box;
}

.mode-buttons {
  display: flex;
  gap: rem(8px);
  margin-bottom: rem(16px);

  button {
    padding: rem(6px) rem(12px);
    border: 1px solid #ccc;
    border-radius: rem(8px);
    background-color: #f9f9f9;
    cursor: pointer;

    &.active {
      background-color: var(--primary-color);
      color: #fff;
      border-color: var(--primary-color);
    }
  }
}
</style>
