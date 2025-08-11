<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

import PropertyManageCard from '@/components/cards/PropertyManageCard.vue'
import Navbar from '@/components/layouts/Navbar.vue'

const router = useRouter()

const userStore = useUserStore()

const myPropertyList = ref([])

const nickname = computed(() => userStore.getNickname)

const totalCount = computed(() => myPropertyList.value.length)

const goToAppliedList = () => {
  router.push({ name: 'propertyAdd' })
}

const fetchMyProperties = async () => {
  // 실제 API 호출 로직을 여기에 구현합니다.
  // 예시: const response = await fetch('/api/my-properties');
  //       myPropertyList.value = await response.json();

  // 임시 데이터 (API가 준비되기 전까지 사용)
  myPropertyList.value = [
    {
      propertyId: 1,
      transactionType: 'JEONSE',
      price: 740000000,
      monthlyRent: null,
      title: '은마 5동 301호',
      imageUrls: [
        { imageUrl: 'https://placehold.co/90x90/E9ECEF/868E96?text=Image' },
      ],
      propertyType: '아파트',
      exclusiveArea: '76.79',
      supplyArea: '101.52',
      floor: '3',
      totalFloors: '14',
      direction: '남향',
      address: '서울시 강남구 삼성로 212',
      isFavorite: false,
      isSafe: true,
    },
    {
      propertyId: 2,
      transactionType: 'MONTHLY_RENT',
      price: 100000000,
      monthlyRent: 1200000,
      title: '잠실 파크리오 101동',
      imageUrls: [
        { imageUrl: 'https://placehold.co/90x90/E9ECEF/868E96?text=Image' },
      ],
      propertyType: '아파트',
      exclusiveArea: '59.98',
      supplyArea: '84.92',
      floor: '12',
      totalFloors: '20',
      direction: '남향',
      address: '서울시 송파구 올림픽로 347',
      isFavorite: true,
      isSafe: false,
    },
    {
      propertyId: 3,
      transactionType: 'JEONSE',
      price: 1250000000,
      monthlyRent: null,
      title: '반포자이 110동',
      imageUrls: [
        { imageUrl: 'https://placehold.co/90x90/E9ECEF/868E96?text=Image' },
      ],
      propertyType: '아파트',
      exclusiveArea: '134.82',
      supplyArea: '165.72',
      floor: '7',
      totalFloors: '30',
      direction: '동향',
      address: '서울시 서초구 신반포로 270',
      isFavorite: false,
      isSafe: true,
    },
    {
      propertyId: 4,
      transactionType: 'JEONSE',
      price: 1250000000,
      monthlyRent: null,
      title: '반포자이 110동',
      imageUrls: [
        { imageUrl: 'https://placehold.co/90x90/E9ECEF/868E96?text=Image' },
      ],
      propertyType: '아파트',
      exclusiveArea: '134.82',
      supplyArea: '165.72',
      floor: '7',
      totalFloors: '30',
      direction: '동향',
      address: '서울시 서초구 신반포로 270',
      isFavorite: false,
      isSafe: true,
    },
    {
      propertyId: 5,
      transactionType: 'JEONSE',
      price: 1250000000,
      monthlyRent: null,
      title: '반포자이 110동',
      imageUrls: [
        { imageUrl: 'https://placehold.co/90x90/E9ECEF/868E96?text=Image' },
      ],
      propertyType: '아파트',
      exclusiveArea: '134.82',
      supplyArea: '165.72',
      floor: '7',
      totalFloors: '30',
      direction: '동향',
      address: '서울시 서초구 신반포로 270',
      isFavorite: false,
      isSafe: true,
    },
  ]
}

onMounted(() => {
  fetchMyProperties()
  userStore.fetchNickname()
})
</script>

<template>
  <div class="PropertyManage">
    <div class="propertyManage-title">
      <p>{{ nickname }}님이</p>
      <p>등록하신 매물 정보예요</p>
    </div>

    <div class="propertyManage-list-header">
      <button class="cta-btn" @click="goToAppliedList">
        매물 등록하러 가기
        <span class="chev">›</span>
      </button>
      <p class="propertyManage-list-count">총 {{ totalCount }}건</p>
    </div>

    <div class="propertyManage-list-container">
      <div v-if="myPropertyList.length > 0">
        <PropertyManageCard
          v-for="item in myPropertyList"
          :key="item.propertyId"
          v-bind="item"
        />
      </div>
      <div v-else class="no-property-message">
        <p>등록하신 매물이 없어요.</p>
        <p>지금 바로 매물을 등록해 보세요!</p>
      </div>
    </div>
  </div>

  <Navbar />
</template>

<style scoped lang="scss">
.PropertyManage {
  width: 100%;
  padding-top: 5rem;
  padding-bottom: 5rem;
  background-color: var(--white);
  padding: 6rem 2rem 0;
}
.propertyManage-title {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

p {
  margin: 0;
  font-weight: 800;
}

.propertyManage-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.4rem;
}

.cta-btn {
  border: none;
  outline: none;
  background: var(--primary-color);
  color: var(--white);
  padding: 0.5rem 0.9rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  white-space: nowrap;
}

.propertyManage-list-count {
  font-size: 0.8rem;
  color: var(--grey);
  font-weight: 400;
}

.propertyManage-list-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 62px;
}

.no-property-message {
  text-align: center;
  padding: 8rem 0;
  color: var(--grey);
  font-size: 1rem;
  line-height: 1.9;
}
</style>
