<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

import PropertyManageCard from '@/components/cards/PropertyManageCard.vue'
import Navbar from '@/components/layouts/Navbar.vue'

const router = useRouter()
const userStore = useUserStore()

const myPropertyList = ref([])
const isModalVisible = ref(false)
const propertyToDeleteId = ref(null)

const nickname = computed(() => userStore.getNickname)

const totalCount = computed(() => myPropertyList.value.length)

const goToAppliedList = () => {
  router.push({ name: 'propertyAdd' })
}

const fetchMyProperties = async () => {
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

const handleDelete = propertyId => {
  propertyToDeleteId.value = propertyId
  isModalVisible.value = true
}

const confirmDelete = () => {
  myPropertyList.value = myPropertyList.value.filter(
    item => item.propertyId !== propertyToDeleteId.value,
  )
  console.log(`${propertyToDeleteId.value}번 매물이 삭제되었습니다.`)
  isModalVisible.value = false
  propertyToDeleteId.value = null
}

const cancelDelete = () => {
  isModalVisible.value = false
  propertyToDeleteId.value = null
}

const handleEdit = propertyId => {
  router.push({ name: 'editProperty', params: { id: propertyId } })
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
          @delete="handleDelete"
          @edit="handleEdit"
        />
      </div>
      <div v-else class="no-property-message">
        <p>등록하신 매물이 없어요.</p>
        <p>지금 바로 매물을 등록해 보세요!</p>
      </div>
    </div>
  </div>

  <Navbar />

  <div v-if="isModalVisible" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-body">
        <p class="modal-question">이 매물을 삭제하시겠어요?</p>
        <p class="modal-info">확인을 누르면 삭제되고, 다시 볼 수 없어요</p>
      </div>
      <div class="modal-actions">
        <button class="confirm-btn" @click="confirmDelete">삭제할래요</button>
        <button class="cancel-btn" @click="cancelDelete">안 할래요</button>
      </div>
    </div>
  </div>
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--white);
  border-radius: 20px;
  width: 90%;
  max-width: 420px;
  padding: 32px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-body {
  margin-bottom: 24px;
}

.modal-question {
  font-size: 1.1rem;
  font-weight: 800;
}

.modal-info {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--grey);
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.modal-actions button {
  padding: 14px 24px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
}

.confirm-btn {
  background: var(--primary-color);
  color: var(--white);
}

.cancel-btn {
  background: #e0e0e0;
  color: #333;
}
</style>
