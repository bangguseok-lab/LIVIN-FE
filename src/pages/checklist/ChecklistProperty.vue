<script setup>
// ✅ 체크리스트 & 일반 검색 겸용 / 위치 기반 제거 버전
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import Filtering from '@/components/filters/FilterBarSearch.vue'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import Buttons from '@/components/common/buttons/Buttons.vue'
import { usePriceStore } from '@/stores/priceStore'
import districtData from '@/assets/data/district.json'
import userAPI from '@/api/user'

const props = defineProps({
  checklistId: { type: [String, Number], required: false },
})

const getUserNickname = async () => {
  try {
    const response = await userAPI.fetchMyPageInfo()
    user.value = response.data.nickname
  } catch (error) {
    this.error = error
    console.log('닉네임을 가져오면서 에러가 발생했습니다.', error)
  }
}
const user = ref('')
const route = useRoute()
const resolvedChecklistId = computed(
  () => props.checklistId ?? route.params.id ?? null,
)

// 헤더 문구
const checklistTitle = ref('')

// 필터 상태
const dealType = ref([]) // ['전세'] | ['월세'] | []
const onlySecure = ref(false)
const region = ref({ city: null, district: null, parish: null }) // 초기값 비움(위치 기반 제거)
const propertyType = ref('general') // 'general' | 'favorite'
const isFavorite = ref(false) // 관심 매물 필터링

// 리스트/로딩 상태
const propertyList = ref([])
const isLoading = ref(false)
const hasMore = ref(true)
const errorMsg = ref('')

// 가격 스토어 연동
const priceStore = usePriceStore()
const jd = computed(
  () => priceStore.states.jeonseDeposit ?? { min: null, max: null },
)
const md = computed(
  () => priceStore.states.monthlyDeposit ?? { min: null, max: null },
)
const mr = computed(
  () => priceStore.states.monthlyRent ?? { min: null, max: null },
)

// 지역 데이터(선택 리스트)
const dummyDistricts = districtData
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

  return { cities, districts: uniqueDistricts, parishes: uniqueParishes }
})

// 유틸
const toWon = v =>
  v === null || v === undefined || v === '' ? undefined : Number(v) * 10000
const getMappedTransactionType = selected => {
  if (selected.length === 1)
    return selected[0] === '전세' ? 'JEONSE' : 'MONTHLY_RENT'
  return null
}

// 엔드포인트 & 파라미터 생성
function getEndpoint() {
  return resolvedChecklistId.value
    ? `/api/checklists/${resolvedChecklistId.value}/properties`
    : `/api/properties`
}
function buildParams(isLoadMore = false) {
  const lastItem = propertyList.value[propertyList.value.length - 1]
  const params = {
    transactionType: getMappedTransactionType(dealType.value),
    jeonseDepositMin: toWon(jd.value.min) ?? undefined,
    jeonseDepositMax: toWon(jd.value.max) ?? undefined,
    monthlyDepositMin: toWon(md.value.min) ?? undefined,
    monthlyDepositMax: toWon(md.value.max) ?? undefined,
    monthlyMin: mr.value.min ?? undefined,
    monthlyMax: mr.value.max ?? undefined,

    // 위치 기반은 빼지만, 사용자가 필터에서 선택하면 전달됨
    sido: region.value.city,
    sigungu: region.value.district,
    eupmyeondong: region.value.parish,

    onlySecure: onlySecure.value ? true : undefined,
    isFavorite: propertyType.value === 'favorite' ? true : undefined,
    limit: 20,
    lastId: isLoadMore ? lastItem?.propertyId : undefined,
  }
  // null/undefined 제거
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== null && v !== undefined),
  )
}

// 요청 취소 토큰(연타 방지)
let cancelCurrent

function fetchProperties(isLoadMore = false) {
  if (isLoading.value || (!hasMore.value && isLoadMore)) return
  if (cancelCurrent) cancelCurrent('cancel previous')

  isLoading.value = true
  errorMsg.value = ''

  const source = axios.CancelToken.source()
  cancelCurrent = source.cancel

  const endpoint = getEndpoint()
  const params = buildParams(isLoadMore)

  axios
    .get(endpoint, { params, cancelToken: source.token })
    .then(res => {
      const newData = Array.isArray(res.data?.data) ? res.data.data : res.data
      const list = Array.isArray(newData) ? newData : []
      if (isLoadMore) propertyList.value.push(...list)
      else propertyList.value = list
      if (list.length < 20) hasMore.value = false
    })
    .catch(err => {
      if (!axios.isCancel(err)) {
        console.error('매물 요청 실패:', err)
        errorMsg.value = '매물 조회 중 오류가 발생했어요.'
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}

// 디바운스 재조회
let debounceId
function refetchDebounced() {
  clearTimeout(debounceId)
  debounceId = setTimeout(() => {
    propertyList.value = []
    hasMore.value = true
    fetchProperties(false)
  }, 180)
}

// 필터 이벤트 핸들러
function handleRegionUpdate(updatedRegion) {
  region.value = updatedRegion
  refetchDebounced()
}
function updateDealType(val) {
  dealType.value = [...val]
  refetchDebounced()
}
function handleOnlySecureUpdate(val) {
  onlySecure.value = val
  refetchDebounced()
}
function handlePropertyTypeUpdate(val) {
  propertyType.value = val
  isFavorite.value = val === 'favorite'
  refetchDebounced()
}
function handleFilterCompleted() {
  refetchDebounced()
}

// 무한스크롤
function handleScroll() {
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.body.offsetHeight
  if (scrollTop + windowHeight >= documentHeight - 200) fetchProperties(true)
}

// 체크리스트 제목(헤더 문구)
async function loadChecklistTitle() {
  if (!resolvedChecklistId.value) return
  try {
    const { data } = await axios.get(
      `/api/checklists/${resolvedChecklistId.value}`,
    )
    const obj = data?.data ?? data
    checklistTitle.value = obj?.title || ''
  } catch {
    /* 무시 */
  }
}

// 마운트/언마운트
onMounted(async () => {
  getUserNickname()
  await loadChecklistTitle()
  propertyList.value = []
  hasMore.value = true
  fetchProperties()
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  clearTimeout(debounceId)
  if (cancelCurrent) cancelCurrent()
})
</script>

<template>
  <div class="PropertySearch">
    <!-- 상단 헤더: 위치 표시 제거 -->
    <div class="guide">
      <h1 class="title">
        <template v-if="resolvedChecklistId">
          <span class="nickname">{{ user }}</span
          >님의<br />
          <span class="applied">{{ checklistTitle || '체크리스트' }}</span
          >를 적용했어요
        </template>
        <template v-else> 원하는 매물을 검색해보세요 </template>
      </h1>
    </div>

    <!-- 필터 (일반 매물/관심 매물 조회) -->
    <div class="property-type-toggle">
      <Buttons
        type="property"
        label="일반 매물"
        :is-active="propertyType === 'general'"
        @update:is-active="() => handlePropertyTypeUpdate('general')"
      />
      <Buttons
        type="property"
        label="관심 매물"
        :is-active="propertyType === 'favorite'"
        @update:is-active="() => handlePropertyTypeUpdate('favorite')"
      />
    </div>

    <!-- 필터(지역/거래유형/안전매물만으로 조회) -->
    <div class="filtering">
      <Filtering
        :deal-type="dealType"
        :only-secure="onlySecure"
        :region="region"
        :region-data="regionData"
        @update:dealType="updateDealType"
        @update:onlySecure="handleOnlySecureUpdate"
        @update:region="handleRegionUpdate"
        @filterCompleted="handleFilterCompleted"
      />
    </div>

    <!-- 매물 리스트 -->
    <div class="property-list">
      <PropertyCard
        v-for="item in propertyList"
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

      <div
        v-if="!propertyList.length && !isLoading && !errorMsg"
        class="no-result"
      >
        조건에 맞는 매물이 없어요
      </div>
      <div v-if="errorMsg" class="no-result">{{ errorMsg }}</div>
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
  align-items: flex-start;
  text-align: left;
  margin-bottom: 30px;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.35;
}
.nickname {
  font-weight: 600;
  color: var(--black);
}
.applied {
  color: var(--primary-color);
  font-weight: 800;
}

.property-type-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
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
