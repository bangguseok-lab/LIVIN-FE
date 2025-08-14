<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import FilterBarFavorite from '@/components/filters/FilterBarFavorite.vue'
import Navbar from '@/components/layouts/Navbar.vue'
import { usePropertyStore } from '@/stores/property'
import api from '@/api/property'

const propertyStore = usePropertyStore()

const favOnlySecure = ref(false)
const favSelectedChecklist = ref('전체')
const favRegion = ref({ city: null, district: null, parish: null })

const propertyList = ref([])

// (임시) 지역 옵션
const dummyDistricts = [
  { sido: '서울특별시', sigungu: '서초구', eupmyeondong: '반포동' },
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
        d.sido === favRegion.value.city &&
        d.sigungu === favRegion.value.district,
    )
    .map(d => d.eupmyeondong)
  const uniqueParishes = [...new Set(parishes)].map(name => ({
    code: name,
    name,
  }))
  return { cities, districts: uniqueDistricts, parishes: uniqueParishes }
})

const checklistRules = {
  체크리스트A: src => src.ownerMatch === true,
  체크리스트B: src => src.mortgage === true,
  체크리스트C: src => src.illegalBuilding === true,
  체크리스트D: src =>
    typeof src.jeonseRate === 'number' && src.jeonseRate >= 80,
}
function deriveChecklistTags(src) {
  const tags = []
  for (const [tag, rule] of Object.entries(checklistRules)) {
    try {
      if (rule(src)) tags.push(tag)
    } catch {
      // 규칙 평가 중 오류는 무시
    }
  }
  return tags
}

function toCard(item) {
  const src = item.property ?? item
  const txn = src.transactionType ?? src.dealType ?? 'JEONSE'

  const raw = {
    mortgage: src.mortgage ?? src.hasMortgage ?? false,
    ownerMatch: src.ownerMatch ?? src.residentMatch ?? false,
    illegalBuilding: src.illegalBuilding ?? false,
    jeonseRate: src.jeonseRate ?? null,
  }

  return {
    propertyId: src.propertyId ?? src.id,
    transactionType: txn,
    price:
      txn === 'JEONSE'
        ? (src.jeonseDeposit ?? src.deposit ?? src.price ?? 0)
        : (src.monthlyDeposit ?? src.deposit ?? 0),
    monthlyRent: txn === 'JEONSE' ? null : (src.monthlyRent ?? src.rent ?? 0),
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
    isFavorite: true, // 관심 목록이므로 true로 고정
    isSafe: src.isSafe ?? src.safe ?? false,

    // 필터 재료
    region: {
      city: src.region?.city ?? src.sido ?? null,
      district: src.region?.district ?? src.sigungu ?? null,
      parish: src.region?.parish ?? src.eupmyeondong ?? null,
    },
    ...raw,
    checklistTags: deriveChecklistTags(raw),
  }
}

async function loadFavorites() {
  try {
    const params = {}

    if (favOnlySecure.value) params.onlySecure = true
    if (
      favSelectedChecklist.value !== '전체' &&
      !isNaN(Number(favSelectedChecklist.value))
    ) {
      params.checklistId = Number(favSelectedChecklist.value)
    }

    if (favRegion.value.city) params.sido = favRegion.value.city
    if (favRegion.value.district) params.sigungu = favRegion.value.district
    if (favRegion.value.parish) params.eupmyeondong = favRegion.value.parish

    const res = await api.getFavProperties(params)
    const arr = Array.isArray(res)
      ? res
      : Array.isArray(res?.content)
        ? res.content
        : []

    propertyList.value = arr.map(toCard)
  } catch (err) {
    console.error('관심 매물 조회 실패:', err)
    propertyList.value = []
  }
}

// 최초 로딩 + 찜 변경 시 재로딩
onMounted(loadFavorites)
watch(() => propertyStore.favoriteVersion, loadFavorites)

const filteredList = computed(() =>
  propertyList.value.filter(item => {
    if (favOnlySecure.value && !item.isSafe) return false
    if (favSelectedChecklist.value && favSelectedChecklist.value !== '전체') {
      if (!item.checklistTags?.includes(favSelectedChecklist.value))
        return false
    }
    const sel = favRegion.value
    if (sel.city && item.region?.city !== sel.city) return false
    if (sel.district && item.region?.district !== sel.district) return false
    if (sel.parish && item.region?.parish !== sel.parish) return false
    return true
  }),
)
</script>

<template>
  <div class="PropertyFav">
    <div class="guide-text">
      <p class="nickname">{{ user }}님이</p>
      <h1 class="title">찜하신 관심매물이에요</h1>
    </div>

    <!-- 필터바 -->
    <FilterBarFavorite
      :checklist-items="[
        '체크리스트A',
        '체크리스트B',
        '체크리스트C',
        '체크리스트D',
      ]"
      :selected="favSelectedChecklist"
      :onlySecure="favOnlySecure"
      :region="favRegion"
      :region-data="getRegionData"
      @update:selected="val => (favSelectedChecklist = val)"
      @update:onlySecure="val => (favOnlySecure = val)"
      @update:region="val => (favRegion = val)"
    />

    <!-- 필터링된 리스트 -->
    <div class="card-list" v-if="filteredList.length">
      <PropertyCard
        v-for="property in filteredList"
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
  padding-left: rem(40px);
  padding-right: rem(40px);
  padding-top: rem(100px);
  padding-bottom: rem(62px);
  background-color: #fff;
}

.guide-text {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start; // 수평 왼쪽 정렬
  text-align: left;
  margin-bottom: 30px;
}

.nickname {
  font-size: 0.9rem;
  color: var(--black);
  margin-bottom: 0.4rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
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
