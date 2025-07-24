<script setup>
import { ref, watch, computed } from 'vue'
import FilterBar from '@/components/filters/FilterBar.vue'

// 현재 선택된 모드 상태 ('search' | 'favorite' | 'checklist')
const selectedMode = ref('search') // 초기 모드는 'search'

// 가격 범위 상태 (보증금 / 월세)
const depositRange = ref({ min: null, max: null })
const monthlyRange = ref({ min: null, max: null })

// computed로 각 범위의 최소/최대값 접근
const depositMin = computed(() => depositRange.value.min)
const depositMax = computed(() => depositRange.value.max)
const monthlyMin = computed(() => monthlyRange.value.min)
const monthlyMax = computed(() => monthlyRange.value.max)

// 체크리스트 예시 데이터
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

//지역 더미데이터
const dummyDistricts = [
  // 서울시
  { sido: '서울특별시', sigungu: '강남구', eupmyeondong: '역삼동' },
  { sido: '서울특별시', sigungu: '강남구', eupmyeondong: '삼성동' },
  { sido: '서울특별시', sigungu: '마포구', eupmyeondong: '서교동' },
  { sido: '서울특별시', sigungu: '마포구', eupmyeondong: '합정동' },
  // 부산시
  { sido: '부산광역시', sigungu: '해운대구', eupmyeondong: '우동' },
  { sido: '부산광역시', sigungu: '해운대구', eupmyeondong: '중동' },
  { sido: '부산광역시', sigungu: '수영구', eupmyeondong: '광안동' },
  // 경기도
  { sido: '경기도', sigungu: '성남시 분당구', eupmyeondong: '정자동' },
  { sido: '경기도', sigungu: '성남시 분당구', eupmyeondong: '수내동' },
  { sido: '경기도', sigungu: '고양시 일산서구', eupmyeondong: '주엽동' },
]

// 지역 선택 상태
const searchRegion = ref({ city: null, district: null, parish: null })
const favRegion = ref({ city: null, district: null, parish: null })
const checklistRegion = ref({ city: null, district: null, parish: null })

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

// 각 모드에 따른 선택 값 상태
const searchOnlySecure = ref(true)
const favOnlySecure = ref(false)
const checklistOnlySecure = ref(false)

// 선택된 체크리스트 항목
const favSelectedChecklist = ref('전체') // Favorite 전용
const checklistSelectedChecklist = ref('전체') // Checklist 전용

// 거래유형 선택 상태 (공통)
const selectedDealTypes = ref([])
</script>

<template>
  <div class="filter-test-container">
    <h2>🔍 필터바 테스트</h2>

    <!-- 모드 선택 버튼 -->
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

    <!-- Search 모드 -->
    <div v-if="selectedMode === 'search'">
      <h3>Search 모드</h3>
      <FilterBar
        mode="search"
        v-model:onlySecure="searchOnlySecure"
        v-model:dealType="selectedDealTypes"
        v-model:deposit="depositRange"
        v-model:monthly="monthlyRange"
        :region-data="getRegionData"
        @update:region="handleRegionUpdate"
      />
      <p v-if="searchOnlySecure" class="secure-msg">안심 매물 필터링 중</p>
      <p>선택된 거래유형: {{ selectedDealTypes.join(', ') }}</p>
      <p>
        보증금 범위:
        {{ depositMin !== null ? depositMin + ' 만원' : '-' }}
        ~
        {{ depositMax !== null ? depositMax + ' 만원' : '-' }}
      </p>

      <p>
        월세 범위:
        {{ monthlyMin !== null ? monthlyMin + ' 만원' : '-' }}
        ~
        {{ monthlyMax !== null ? monthlyMax + ' 만원' : '-' }}
      </p>
      <p>
        지역 선택:
        {{
          searchRegion.city && searchRegion.district && searchRegion.parish
            ? `${searchRegion.city} ${searchRegion.district} ${searchRegion.parish}`
            : '미선택'
        }}
      </p>
    </div>

    <!-- Favorite 모드 -->
    <div v-else-if="selectedMode === 'favorite'">
      <h3>Favorite 모드</h3>
      <FilterBar
        mode="favorite"
        :checklist-items="checklistItems"
        v-model:selected="favSelectedChecklist"
        v-model:onlySecure="favOnlySecure"
        :region-data="getRegionData"
        @update:region="handleRegionUpdate"
      />
      <p>
        선택된 체크리스트: <strong>{{ favSelectedChecklist }}</strong>
      </p>
      <p v-if="favOnlySecure" class="secure-msg">안심 매물 필터링 중</p>
      <p>
        지역 선택:
        {{
          searchRegion.city && searchRegion.district && searchRegion.parish
            ? `${searchRegion.city} ${searchRegion.district} ${searchRegion.parish}`
            : '미선택'
        }}
      </p>
    </div>

    <!-- Checklist 모드 -->
    <div v-else-if="selectedMode === 'checklist'">
      <h3>Checklist 모드</h3>
      <FilterBar
        mode="checklist"
        :checklist-items="checklistItems"
        v-model:selected="checklistSelectedChecklist"
        v-model:onlySecure="checklistOnlySecure"
        v-model:dealType="selectedDealTypes"
        v-model:deposit="depositRange"
        v-model:monthly="monthlyRange"
        :region-data="getRegionData"
        @update:region="handleRegionUpdate"
      />
      <p>
        선택된 매물: <strong>{{ checklistSelectedChecklist }}</strong>
      </p>
      <p v-if="checklistOnlySecure" class="secure-msg">안심 매물 필터링 중</p>
      <p>선택된 거래유형: {{ selectedDealTypes.join(', ') }}</p>
      <p>
        보증금 범위:
        {{ depositMin !== null ? depositMin + ' 만원' : '-' }}
        ~
        {{ depositMax !== null ? depositMax + ' 만원' : '-' }}
      </p>

      <p>
        월세 범위:
        {{ monthlyMin !== null ? monthlyMin + ' 만원' : '-' }}
        ~
        {{ monthlyMax !== null ? monthlyMax + ' 만원' : '-' }}
      </p>
      <p>
        지역 선택:
        {{
          searchRegion.city && searchRegion.district && searchRegion.parish
            ? `${searchRegion.city} ${searchRegion.district} ${searchRegion.parish}`
            : '미선택'
        }}
      </p>
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
  padding: rem(24px);
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
