<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import Filtering from '@/components/filters/FilterBarSearch.vue'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import SearchSummary from '@/components/common/SearchSummary.vue'
import districtData from '@/assets/data/order-district.json'
import { usePropertySearchStore } from '@/stores/propertySearch'

defineOptions({ name: 'PropertySearch' })

const s = usePropertySearchStore()

// 지역 옵션은 s.region(임시) 기준
const regionData = computed(() => {
  const cities = [...new Set(districtData.map(d => d.sido))].map(name => ({
    code: name,
    name,
  }))
  const currentCity = s.region.city
  const currentDistrict = s.region.district

  const districts = [
    ...new Set(
      districtData.filter(d => d.sido === currentCity).map(d => d.sigungu),
    ),
  ].map(name => ({ code: name, name }))

  const parishes = [
    ...new Set(
      districtData
        .filter(d => d.sido === currentCity && d.sigungu === currentDistrict)
        .map(d => d.eupmyeondong),
    ),
  ].map(name => ({ code: name, name }))

  return { cities, districts, parishes }
})

// 사용자의 현재 위치(세션). 없으면 null로 처리
const safe = v => (v && v !== 'null' && v !== 'undefined' ? v : null)
const userAddress = {
  sido: safe(sessionStorage.getItem('sido')),
  sigungu: safe(sessionStorage.getItem('sigungu')),
  eupmyendong: safe(sessionStorage.getItem('eupmyendong')),
}

// 표시 여부
const hasUserAddress = computed(
  () => !!(userAddress.sido || userAddress.sigungu || userAddress.eupmyendong),
)

// 표시 문자열
const currentAddressText = computed(() =>
  [userAddress.sido, userAddress.sigungu, userAddress.eupmyendong]
    .filter(Boolean)
    .join(' '),
)

onMounted(async () => {
  const isRegionApplied = !!(
    s.appliedRegion.city ||
    s.appliedRegion.district ||
    s.appliedRegion.parish
  )
  const hasFilters = s.dealType.length > 0 || s.onlySecure || isRegionApplied
  if (!hasFilters && !s.list.length) {
    const safe = v => (v && v !== 'null' && v !== 'undefined' ? v : null)
    const sido = safe(sessionStorage.getItem('sido'))
    const sigungu = safe(sessionStorage.getItem('sigungu'))
    const eupmyendong = safe(sessionStorage.getItem('eupmyendong'))
    if (sido || sigungu || eupmyendong) {
      s.region = { city: sido, district: sigungu, parish: eupmyendong }
      s.appliedRegion = { ...s.region } // 칩/요청 기준값 동기화
    }
  }

  if (!s.list.length) {
    await s.fetchTotalCount()
    await s.fetchList(false)
  }

  attachScroll()
})

function handleScroll() {
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  if (scrollTop + windowHeight >= documentHeight - 200) s.fetchList(true)
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

onUnmounted(detachScroll)

// 패널 이벤트
function handleRegionUpdate(updated) {
  s.region = updated
}
function handleFilterCompleted() {
  s.applyRegion()
  s.resetAndReload()
}
function handleOnlySecureUpdate(v) {
  s.onlySecure = v
  s.resetAndReload()
}
function updateDealType(v) {
  s.dealType = [...v]
}

// 칩 해제
function onClearFilter(chip) {
  s.clearChip(chip)
  s.resetAndReload()
}
</script>

<template>
  <div class="PropertySearch">
    <!-- 현재 위치와 타이틀 -->
    <div class="guide">
      <div class="location" v-if="hasUserAddress">
        <!-- 현재 위치 -->
        <span class="marker"
          ><img
            src="@/assets/images/search/marker.svg"
            alt="위치 아이콘"
            class="marker-icon"
        /></span>
        <span>
          현재 <span class="highlight">{{ currentAddressText }}</span
          >에 있어요</span
        >
      </div>

      <h1 class="title">원하는 매물을 검색해보세요</h1>
    </div>

    <Filtering
      :deal-type="s.dealType"
      :only-secure="s.onlySecure"
      :region="s.region"
      :region-data="regionData"
      @update:dealType="updateDealType"
      @update:onlySecure="handleOnlySecureUpdate"
      @update:region="handleRegionUpdate"
      @filterCompleted="handleFilterCompleted"
    />

    <SearchSummary
      :deal-type="s.dealType"
      :region="s.appliedRegion"
      :only-secure="s.onlySecure"
      :total-count="s.totalCount"
      :loaded-count="s.list.length"
      :show-loaded="true"
      @clear="onClearFilter"
    />

    <div class="property-list">
      <PropertyCard
        v-for="item in s.list"
        :key="item.propertyId"
        :propertyId="item.propertyId"
        :transactionType="item.transactionType"
        :price="
          item.transactionType === 'JEONSE'
            ? item.jeonseDeposit
            : item.monthlyDeposit
        "
        :monthlyRent="
          item.transactionType === 'JEONSE' ? null : item.monthlyRent
        "
        :propertyType="item.propertyType"
        :title="item.name"
        :detailAddress="item.detailAddress"
        :exclusiveArea="item.exclusiveAreaM2"
        :supplyArea="item.supplyAreaM2"
        :floor="item.floor"
        :totalFloors="item.totalFloors"
        :direction="item.mainDirection"
        :address="item.roadAddress"
        :isFavorite="item.isFavorite"
        :isSafe="item.isSafe"
      />
      <div v-if="!s.list.length && !s.isLoading" class="no-result">
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
  cursor: pointer;
}

.no-result {
  padding: 7rem;
  text-align: center;
  color: var(--grey);
  font-size: 1rem;
  font-weight: var(--font-weight-sm);
}
</style>
