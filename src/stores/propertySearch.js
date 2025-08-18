// stores/propertySearch.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import propertyApi from '@/api/property'
import { usePriceStore } from '@/stores/priceStore'

const toWon = v =>
  v === null || v === undefined || v === '' ? undefined : Number(v) * 10000
const clean = obj =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined),
  )

export const usePropertySearchStore = defineStore('propertySearch', () => {
  // 필터
  const dealType = ref([]) // ['전세'] | ['월세'] | ['전세','월세'] | []
  const onlySecure = ref(false)
  const region = ref({ city: null, district: null, parish: null }) // 패널(임시)
  const appliedRegion = ref({ city: null, district: null, parish: null }) // 확정(검색/칩)

  // 목록/상태
  const list = ref([])
  const totalCount = ref(0)
  const hasMore = ref(true)
  const isLoading = ref(false)
  const pageSize = 20

  // 동시성 가드
  let reqListId = 0
  let reqCountId = 0

  // 가격 스토어 재사용
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

  const getMappedTransactionType = sel =>
    sel?.length === 1 ? (sel[0] === '전세' ? 'JEONSE' : 'MONTHLY_RENT') : null

  function buildBaseParams() {
    return clean({
      transactionType: getMappedTransactionType(dealType.value),
      jeonseDepositMin: toWon(jd.value.min) ?? undefined,
      jeonseDepositMax: toWon(jd.value.max) ?? undefined,
      monthlyDepositMin: toWon(md.value.min) ?? undefined,
      monthlyDepositMax: toWon(md.value.max) ?? undefined,
      monthlyMin: mr.value.min ?? undefined,
      monthlyMax: mr.value.max ?? undefined,

      sido: appliedRegion.value.city,
      sigungu: appliedRegion.value.district,
      eupmyendong: appliedRegion.value.parish,
      onlySecure: onlySecure.value ? true : undefined,
    })
  }

  function buildListParams(lastItem) {
    return clean({
      ...buildBaseParams(),
      limit: pageSize,
      lastId: lastItem?.propertyId,
    })
  }

  async function fetchTotalCount() {
    const myId = ++reqCountId
    try {
      const params = buildBaseParams()
      const data = await propertyApi.countProperties(params)
      if (myId !== reqCountId) return
      totalCount.value = Number(data ?? 0)
      hasMore.value = list.value.length < totalCount.value
    } catch (e) {
      console.error('총 개수 요청 실패:', e)
      totalCount.value = 0
    }
  }

  async function fetchList(loadMore = false) {
    if (isLoading.value || (!hasMore.value && loadMore)) return
    isLoading.value = true
    const myId = ++reqListId

    try {
      const lastItem = loadMore ? list.value[list.value.length - 1] : null
      const params = buildListParams(lastItem)
      const data = await propertyApi.getProperties(params)
      const items = Array.isArray(data?.properties) ? data.properties : data

      if (myId !== reqListId) return
      if (loadMore) list.value.push(...items)
      else list.value = items

      hasMore.value = totalCount.value
        ? list.value.length < totalCount.value
        : (items?.length ?? 0) === pageSize
    } catch (e) {
      console.error('매물 목록 요청 실패:', e)
    } finally {
      if (myId === reqListId) isLoading.value = false
    }
  }

  function applyRegion() {
    appliedRegion.value = { ...region.value }
  }

  function clearChip(chip) {
    if (chip.type === 'dealType') {
      dealType.value = dealType.value.filter(t => t !== chip.payload.value)
    } else if (chip.type === 'onlySecure') {
      onlySecure.value = false
    } else if (chip.type === 'region') {
      if (chip.payload.level === 'city') {
        const next = { city: null, district: null, parish: null }
        appliedRegion.value = next
        region.value = { ...next }
      } else if (chip.payload.level === 'district') {
        const next = { ...appliedRegion.value, district: null, parish: null }
        appliedRegion.value = next
        region.value = { ...next }
      } else if (chip.payload.level === 'parish') {
        const next = { ...appliedRegion.value, parish: null }
        appliedRegion.value = next
        region.value = { ...next }
      }
    }
  }

  async function resetAndReload() {
    list.value = []
    hasMore.value = true
    totalCount.value = 0
    await fetchTotalCount()
    await fetchList(false)
  }

  return {
    // state
    dealType,
    onlySecure,
    region,
    appliedRegion,
    list,
    totalCount,
    hasMore,
    isLoading,
    pageSize,

    // 가격 getter (필요 시 외부에서 참조)
    jd,
    md,
    mr,

    // actions
    fetchTotalCount,
    fetchList,
    applyRegion,
    clearChip,
    resetAndReload,
    buildBaseParams,
  }
})
