<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useRegisteredPropertyStore } from '@/stores/registeredProperty'

import PropertyManageCard from '@/components/cards/PropertyManageCard.vue'

const router = useRouter()
const userStore = useUserStore()
const registeredPropertyStore = useRegisteredPropertyStore()

const isModalVisible = ref(false)
const propertyToDeleteId = ref(null)

const nickname = computed(() => userStore.getNickname)
const myPropertyList = computed(() => registeredPropertyStore.getProperties)
const totalCount = computed(() => registeredPropertyStore.getPropertyCount)

const goToAppliedList = () => {
  router.push({ name: 'propertyAdd' })
}

const fetchMyProperties = async () => {
  await registeredPropertyStore.fetchMyProperties()
}

const handleDelete = propertyId => {
  propertyToDeleteId.value = propertyId
  isModalVisible.value = true
}

const confirmDelete = async () => {
  await registeredPropertyStore.deleteProperty(propertyToDeleteId.value)
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
      <p class="greeting-line">
        <span class="nickname">{{ nickname }}</span
        ><span class="suffix">님이</span>
      </p>
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
          v-bind="{
            ...item,
            price:
              item.transactionType === 'JEONSE'
                ? item.jeonseDeposit
                : item.monthlyDeposit,
            title: item.name,
            exclusiveArea: item.exclusiveAreaM2,
            supplyArea: item.supplyAreaM2,
            floor: item.floor,
            totalFloors: item.totalFloors,
            direction: item.mainDirection,
            address: item.roadAddress,
            imageUrls: item.imageUrls,
            isFavorite: item.isFavorite,
            isSafe: item.isSafe,
          }"
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

.greeting-line {
  font-size: 1.3rem;
}
.suffix {
  font-weight: 400;
}

.nickname {
  color: var(--primary-color);
  font-weight: 800;
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
  border-radius: 0.625rem;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.08);
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
  gap: 0.75rem;
  padding-bottom: 3.875rem;
}

.no-property-message {
  text-align: center;
  padding: 8rem 0;
  color: var(--grey);
  font-size: 1rem;
  line-height: 1.9;
}

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
  border-radius: 1.25rem;
  width: 90%;
  max-width: 26.25rem;
  padding: 2rem;
  box-shadow: 0 0.25rem 0.625rem rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-body {
  margin-bottom: 1.5rem;
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
  gap: 1rem;
}

.modal-actions button {
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
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
