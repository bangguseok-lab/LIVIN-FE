<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import Filtering from '@/components/filters/FilterBarSearch.vue'
import PropertyCard from '@/components/cards/PropertyCard.vue'

import { usePriceStore } from '@/stores/priceStore'

import districtData from '@/assets/data/district.json'

const dealType = ref([])
const onlySecure = ref(false)
const region = ref({ city: null, district: null, parish: null })
const propertyList = ref([]) // 백엔드에서 받아온 응답 결과(매물 데이터)를 저장할 상태

const address = ref({
  sido: sessionStorage.getItem('sido') || '서울특별시',
  sigungu: sessionStorage.getItem('sigungu') || '강남구',
  eupmyendong: sessionStorage.getItem('eupmyendong') || '논현동',
})

const priceStore = usePriceStore()
const isLoading = ref(false)
const hasMore = ref(true)

const jd = computed(
  () => priceStore.states.jeonseDeposit ?? { min: null, max: null },
)
const md = computed(
  () => priceStore.states.monthlyDeposit ?? { min: null, max: null },
)
const mr = computed(
  () => priceStore.states.monthlyRent ?? { min: null, max: null },
)

// 예시 더미 데이터
const dummyDistricts = districtData

onMounted(() => {
  const fallbackAddress = {
    sido: '서울특별시',
    sigungu: '강남구',
    eupmyendong: '대치동',
  }
  const currentAddress =
    address.value?.sido && address.value?.sigungu
      ? address.value
      : fallbackAddress

  // region 초기화

  region.value.city = currentAddress.sido
  region.value.district = currentAddress.sigungu
  region.value.parish = currentAddress.eupmyendong || null

  propertyList.value = []
  hasMore.value = true
  fetchProperties()

  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 지역 선택 옵션 계산
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

// 지역 변경 핸들러
function handleRegionUpdate(updatedRegion) {
  region.value = updatedRegion
}

function updateDealType(val) {
  dealType.value = [...val]
}

function getMappedTransactionType(selectedList) {
  if (selectedList.length === 1) {
    return selectedList[0] === '전세' ? 'JEONSE' : 'MONTHLY_RENT'
  }
  return null
}

function handleOnlySecureUpdate(val) {
  onlySecure.value = val
  fetchProperties()
}


const toWon = v =>
  v === null || v === undefined || v === '' ? undefined : Number(v) * 10000

// 백엔드 API 요청
function fetchProperties(isLoadMore = false) {
  if (isLoading.value || (!hasMore.value && isLoadMore)) return
  isLoading.value = true

  const lastItem = propertyList.value[propertyList.value.length - 1]

  const params = {
    transactionType: getMappedTransactionType(dealType.value),
    jeonseDepositMin: toWon(jd.value.min) ?? undefined,
    jeonseDepositMax: toWon(jd.value.max) ?? undefined,
    monthlyDepositMin: toWon(md.value.min) ?? undefined,
    monthlyDepositMax: toWon(md.value.max) ?? undefined,
    monthlyMin: mr.value.min ?? undefined,
    monthlyMax: mr.value.max ?? undefined,


    sido: region.value.city,
    sigungu: region.value.district,
    eupmyendong: region.value.parish,
    onlySecure: onlySecure.value ? true : undefined,
    limit: 20,
    lastId: isLoadMore ? lastItem?.propertyId : undefined,
  }

  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== null && v !== undefined),
  )

  console.log('[PropertySearch] API 요청 ↓', filteredParams)

  axios
    .get('/api/properties', { params: filteredParams })
    .then(res => {
      console.log('매물 결과:', res.data)
      const newData = res.data

      if (isLoadMore) {
        propertyList.value.push(...newData)
      } else {
        propertyList.value = newData
      }

      if (newData.length < 20) {
        hasMore.value = false
      }
    })
    .catch(err => console.error('매물 요청 실패:', err))
    .finally(() => {
      isLoading.value = false
    })
}

function handleScroll() {
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.body.offsetHeight

  if (scrollTop + windowHeight >= documentHeight - 200) {
    fetchProperties(true)
  }
}

function handleFilterCompleted() {
  propertyList.value = []
  hasMore.value = true
  fetchProperties()
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
          <span class="highlight">{{ address.sido }} {{ address.sigungu }}
            {{ address.eupmyendong || '' }}</span>에 있어요
        </span>
      </div>
      <!-- 타이틀 -->
      <h1 class="title">원하는 매물을 검색해보세요</h1>
    </div>

    <div class="filtering">
      <Filtering :deal-type="dealType" :only-secure="onlySecure" :region="region" :region-data="regionData"
        @update:dealType="updateDealType" @update:onlySecure="handleOnlySecureUpdate"
        @update:region="handleRegionUpdate" @filterCompleted="handleFilterCompleted" />
    </div>

    <!-- 매물 리스트 -->
    <div class="property-list">
      <!-- 매물 카드 컴포넌트 -->
      <!-- 부모에서 이렇게 바꿔줘야 함 -->
      <PropertyCard v-for="item in propertyList" :key="item.propertyId" :propertyId="item.propertyId"
        :transactionType="item.transactionType" :price="item.transactionType === 'JEONSE'
          ? item.jeonseDeposit
          : item.monthlyDeposit
          " :monthlyRent="item.transactionType === 'JEONSE' ? null : item.monthlyRent
            " :propertyType="item.propertyType" :title="item.name" :detailAddress="item.detailAddress"
        :exclusiveArea="item.exclusiveAreaM2" :supplyArea="item.supplyAreaM2" :floor="item.floor"
        :totalFloors="item.totalFloors" :direction="item.mainDirection" :address="item.roadAddress"
        :isFavorite="item.isFavorite" :isSafe="item.isSafe" />

      <!-- 매물이 없을 경우 -->
      <div v-if="!propertyList.length && !isLoading" class="no-result">
        조건에 맞는 매물이 없어요
      </div>
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
  padding-bottom: 62px;
}

.no-result {
  padding: 7rem;
  text-align: center;
  color: var(--grey);
  font-size: 1rem;
  font-weight: var(--font-weight-sm);
}
</style>
