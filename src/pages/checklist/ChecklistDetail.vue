<script setup>
import { defineProps, onMounted, ref } from 'vue'
import { useChecklistStore } from '@/stores/checklist'
import checklistAPI from '@/api/checklist'
import { useRouter } from 'vue-router'
import ItemToggleModal from '@/components/modals/checklist/ChecklistToggleModal.vue'
import CustomChecklistModal from '@/components/modals/checklist/ChecklistCustomModal.vue'
import ChecklistDeleteSubmitModal from '@/components/modals/checklist/ChecklistDeleteSubmitModal.vue'

const props = defineProps(['id'])
const checklistStore = useChecklistStore()
const checklist = ref(null)
const roomItems = ref([])
const buildingItems = ref([])
const customItems = ref([])
const infraItems = ref([])
const circumstanceItems = ref([])
const optionItems = ref([])

const showModal = ref(false)
const modalLabel = ref('')
const modalItems = ref([])
const showCustomModal = ref(false)
const showDeleteConfirm = ref(false)

const router = useRouter()

async function openModal(label, type) {
  modalLabel.value = label
  modalItems.value = checklistStore.currentChecklistItems.filter(
    item => item.type === type,
  )
  showModal.value = true
}

async function onModalClose() {
  showModal.value = false
  await checklistStore.loadChecklist(props.id)
  const items = checklistStore.currentChecklistItems

  roomItems.value = items.filter(item => item.type === 'ROOM' && item.is_active)
  buildingItems.value = items.filter(
    item => item.type === 'BUILDING' && item.is_active,
  )
  customItems.value = items.filter(
    item => item.type === 'CUSTOM' && item.is_active,
  )
  infraItems.value = items.filter(
    item => item.type === 'INFRA' && item.is_active,
  )
  circumstanceItems.value = items.filter(
    item => item.type === 'CIRCUMSTANCE' && item.is_active,
  )
  optionItems.value = items.filter(
    item => item.type === 'OPTION' && item.is_active,
  )
}

async function handleCustomModalClose() {
  showCustomModal.value = false
  await checklistStore.loadChecklist(props.id)
  const items = checklistStore.currentChecklistItems
  customItems.value = items.filter(
    item => item.type === 'CUSTOM' && item.is_active,
  )
}

onMounted(async () => {
  await checklistStore.loadChecklist(props.id)
  checklist.value = checklistStore.currentChecklist
  const items = await checklistAPI.fetchChecklistItems(props.id)

  // 필터 시 아래와 같이 조건 추가
  roomItems.value = items.filter(item => item.type === 'ROOM' && item.is_active)
  buildingItems.value = items.filter(
    item => item.type === 'BUILDING' && item.is_active,
  )
  customItems.value = items.filter(
    item => item.type === 'CUSTOM' && item.is_active,
  )
  infraItems.value = items.filter(
    item => item.type === 'INFRA' && item.is_active,
  )
  circumstanceItems.value = items.filter(
    item => item.type === 'CIRCUMSTANCE' && item.is_active,
  )
  optionItems.value = items.filter(
    item => item.type === 'OPTION' && item.is_active,
  )
})

// 🖊️ 상단 버튼 클릭 시: 체크리스트 이름/설명 수정
function goToEditChecklistInfo() {
  router.push(`/checklist/${props.id}/edit-info`)
}

// 📝 하단 버튼 클릭 시: 항목 수정
function goToEditItems() {
  router.push(`/checklist/${props.id}/edit-items`)
}

async function confirmDeleteChecklist() {
  try {
    await checklistStore.removeChecklist(props.id)
    router.push('/checklist')
  } catch (err) {
    console.error('삭제 실패:', err)
  }
}
</script>

<template>
  <div class="ChecklistDetail">
    <div class="actions">
      <div class="icon-wrapper" @click="goToEditChecklistInfo">
        <img src="@/assets/edit-icon.svg" />
        <span class="icon-label">수정하기</span>
      </div>
      <div class="icon-wrapper" @click="showDeleteConfirm = true">
        <img src="@/assets/delete-icon.svg" />
        <span class="icon-label">삭제하기</span>
      </div>
    </div>
    <!-- 상단 카드 -->
    <section class="card-2">
      <div class="card-content">
        <div class="image-box"></div>
        <div class="text-box">
          <h2 class="title">{{ checklist?.title }}</h2>
          <p class="desc">{{ checklist?.description }}</p>
        </div>
      </div>
    </section>

    <!-- 항목 리스트 -->
    <section class="section" v-if="checklist">
      <h5 class="fw-bold pt-3">
        방 컨디션
        <button @click="() => openModal('방 컨디션', 'ROOM')" class="add-img">
          <img src="@/assets/add-btn.svg" />
        </button>
      </h5>

      <div class="tag-group pb-5">
        <span
          v-for="item in roomItems"
          :key="item.checklistItem_id"
          class="tag"
        >
          {{ item.keyword }}
        </span>
      </div>

      <h5 class="fw-bold">
        건물 컨디션
        <button
          @click="() => openModal('방 컨디션', 'BUILDING')"
          class="add-img"
        >
          <img src="@/assets/add-btn.svg" />
        </button>
      </h5>
      <div class="tag-group pb-5">
        <span
          v-for="item in buildingItems"
          :key="item.checklistItem_id"
          class="tag"
        >
          {{ item.keyword }}
        </span>
      </div>

      <h5 class="fw-bold">
        주변 인프라
        <button @click="() => openModal('방 컨디션', 'INFRA')" class="add-img">
          <img src="@/assets/add-btn.svg" />
        </button>
      </h5>
      <div class="tag-group pb-5">
        <span
          v-for="item in infraItems"
          :key="item.checklistItem_id"
          class="tag"
        >
          {{ item.keyword }}
        </span>
      </div>

      <h5 class="fw-bold">
        방 옵션
        <button @click="() => openModal('방 옵션', 'OPTION')" class="add-img">
          <img src="@/assets/add-btn.svg" />
        </button>
      </h5>
      <div class="tag-group pb-5">
        <span
          v-for="item in optionItems"
          :key="item.checklistItem_id"
          class="tag"
        >
          {{ item.keyword }}
        </span>
      </div>

      <h5 class="fw-bold">
        주변 환경
        <button
          @click="() => openModal('주변 환경', 'CIRCUMSTANCE')"
          class="add-img"
        >
          <img src="@/assets/add-btn.svg" />
        </button>
      </h5>
      <div class="tag-group pb-5">
        <span
          v-for="item in circumstanceItems"
          :key="item.checklistItem_id"
          class="tag"
        >
          {{ item.keyword }}
        </span>
      </div>

      <h5 class="fw-bold">
        나만의 항목
        <button @click="() => (showCustomModal = true)" class="add-img">
          <img src="@/assets/add-btn.svg" />
        </button>
      </h5>
      <div class="tag-group pb-5">
        <span
          v-for="item in customItems"
          :key="item.checklistItem_id"
          class="tag"
        >
          {{ item.keyword }}
        </span>
      </div>
      <div class="footer-btn">
        <button class="edit-btn" @click="goToEditItems">수정하기</button>
      </div>
    </section>
  </div>
  <ItemToggleModal
    v-if="showModal"
    :label="modalLabel"
    :items="modalItems"
    :checklist-id="checklist?.id"
    @close="onModalClose"
  />
  <CustomChecklistModal
    v-if="showCustomModal"
    :checklist-id="checklist?.id"
    @close="handleCustomModalClose"
  />
  <ChecklistDeleteSubmitModal
    v-if="showDeleteConfirm"
    @confirm="confirmDeleteChecklist"
    @close="showDeleteConfirm = false"
  />
</template>

<style scoped>
.ChecklistDetail {
  padding-top: 6rem;
  width: 100%;
  background-color: #007bff;
}
.card-2 {
  display: flex;
  justify-content: space-between;
  align-items: left;
  padding: 1.5rem;
  background-color: #007bff;
  color: white;
  position: relative;
}
.image-box {
  width: 5.125rem;
  height: 4rem;
  background-color: #dddddd;
  border-radius: 0.5rem;
  margin-right: 1rem;
}
.title {
  font-size: 1.2rem;
  font-weight: bold;
}
.desc {
  font-size: 0.9rem;
  opacity: 0.9;
}
.actions {
  position: absolute;
  margin-bottom: 1rem;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}
.section {
  min-height: 100%;
  border-radius: 2rem 0 0 0;
  padding: 1.5rem;
  background-color: white;
}
.section h3 {
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.tag {
  /* background-color: #e5f0ff;
  color: #007bff; */
  background-color: #007bff;
  color: white;
  padding: 0.5rem 0.8rem;
  border-radius: 0.625rem;
  font-size: 0.9rem;
}
.footer-btn {
  width: 100%;
  padding: 1rem;
  padding-bottom: 2rem;
  background-color: white;
}
.edit-btn {
  width: 100%;
  background-color: #007bff;
  color: white;
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
}
.card-content {
  display: flex;
  align-items: center;
  position: relative;
  padding-top: 2rem;
}

.actions {
  position: relative;
  justify-content: right;
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: white;
}

.edit-icon,
.delete-icon {
  cursor: pointer;
}

.edit-icon img,
.delete-icon img {
  width: 16px;
  height: 16px;
}

.icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.icon-wrapper img {
  width: 16px;
  height: 16px;
}

.icon-label {
  font-size: 0.7rem;
  color: black;
  margin-top: 2px;
}

.text-box {
  display: flex;
  flex-direction: column;
}

.add-img {
  all: unset;
}
</style>
