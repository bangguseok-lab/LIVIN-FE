<script setup>
import { defineProps, onMounted, ref, nextTick } from 'vue'
import { useChecklistStore } from '@/stores/checklist'
import checklistAPI from '@/api/checklist'
import { useRouter, useRoute } from 'vue-router'
import ItemToggleModal from '@/components/modals/checklist/ChecklistToggleModal.vue'
import CustomChecklistModal from '@/components/modals/checklist/ChecklistCustomModal.vue'
import ChecklistDeleteSubmitModal from '@/components/modals/checklist/ChecklistDeleteSubmitModal.vue'
import ChecklistEditSubmitModal from '@/components/modals/checklist/ChecklistEditSubmitModal.vue'

const checklistStore = useChecklistStore()
const checklist = ref(null)

//필터 관련
const roomItems = ref([])
const buildingItems = ref([])
const customItems = ref([])
const infraItems = ref([])
const circumstanceItems = ref([])
const optionItems = ref([])

//모달 관련
const showModal = ref(false)
const modalLabel = ref('')
const modalItems = ref([])
const showCustomModal = ref(false)
const showDeleteConfirm = ref(false)
const router = useRouter()
const route = useRoute()
const checklistId = route.params.id
const showEditModal = ref(false)

async function openModal(label, type) {
  modalLabel.value = label
  if (Array.isArray(checklistStore.currentChecklistItems)) {
    modalItems.value = checklistStore.currentChecklistItems
      .filter(item => item.type === type)
      .map(item => ({
        checklistItem_id: item.checklistItemId,
        keyword: item.keyword,
        is_active: item.isActive,
        type: item.type,
      }))
  } else {
    modalItems.value = []
  }
  showModal.value = true
}

async function onModalClose() {
  showModal.value = false

  // 💡 store 데이터 갱신
  await checklistStore.loadChecklist(checklistId)

  // ✅ API에서 items를 다시 불러와야 타입별 구조 보장됨
  const res = await checklistAPI.fetchChecklistById(checklistId)
  const items = res.items

  roomItems.value = (items.ROOM || []).filter(item => item.isActive)
  buildingItems.value = (items.BUILDING || []).filter(item => item.isActive)
  customItems.value = (items.CUSTOM || []).filter(item => item.isActive)
  infraItems.value = (items.INFRA || []).filter(item => item.isActive)
  circumstanceItems.value = (items.CIRCUMSTANCE || []).filter(
    item => item.isActive,
  )
  optionItems.value = (items.OPTION || []).filter(item => item.isActive)
}

async function handleCustomModalClose() {
  showCustomModal.value = false
  await checklistStore.loadChecklist(checklistId)
  const items = checklistStore.currentChecklistItems
  customItems.value = items.filter(
    item => item.type === 'CUSTOM' && item.isActive,
  )
}

onMounted(async () => {
  console.log(checklistId)

  await checklistStore.loadChecklist(checklistId)
  checklist.value = checklistStore.currentChecklist
  const res = await checklistAPI.fetchChecklistById(checklistId)
  console.log(res.items)

  const items = res.items

  // 타입별 배열 접근 후 is_active 필터
  roomItems.value = (items.ROOM || []).filter(item => item.isActive)
  buildingItems.value = (items.BUILDING || []).filter(item => item.isActive)
  customItems.value = (items.CUSTOM || []).filter(item => item.isActive)
  infraItems.value = (items.INFRA || []).filter(item => item.isActive)
  circumstanceItems.value = (items.CIRCUMSTANCE || []).filter(
    item => item.isActive,
  )
  optionItems.value = (items.OPTION || []).filter(item => item.isActive)
})

async function confirmDeleteChecklist() {
  try {
    await checklistStore.removeChecklist(checklistId)
    router.push('/checklist')
  } catch (err) {
    console.error('삭제 실패:', err)
  }
}

const updateChecklistInfo = async ({ title, description }) => {
  await checklistStore.updateChecklist(checklistId, {
    title,
    description,
    type: 'PHYSICAL',
  })
  showEditModal.value = false
  await nextTick() // 렌더링 완료 후
  location.reload()
}

async function gotoChecklist() {
  alert('적용되었습니다')
  router.push('/checklist')
}

function goToAppliedList() {
  router.push({ name: 'checklistProperty', params: { id: checklistId } })
}

const PRESETS = {
  // 20대 청년층 선호: 채광, 옵션, 안전
  YOUTH_20S: [
    '채광',
    '벌레',
    '전자렌지',
    '세탁기',
    '치안',
    '골목길 가로등 유무',
    '냉장고',
    '에어컨',
    '강한 수압',
    '방의 기울기',
  ],

  // 기본 안전형: 방·건물 상태, 방범
  BASIC_SAFE: [
    '누수',
    '결로 흔적',
    '곰팡이',
    '전기 컨디션',
    'CCTV',
    '창문 컨디션',
    '현관문 잠금장치',
    '방음',
    '난방 컨디션',
  ],

  // 교통 편의형
  TRANSPORT_INFRA: [
    '지하철역',
    '버스정류장',
    '편의점',
    '대로변 근처',
    '문화생활',
    '공원',
  ],

  // 가전·가구 옵션형
  FULL_OPTION: [
    '세탁기',
    '냉장고',
    '에어컨',
    '건조기',
    '전자렌지',
    '가스렌지',
    '인덕션',
    '침대',
  ],

  // 반려동물·주거 환경
  PET_FRIENDLY: [
    '반려동물 가능 유무',
    '방음',
    '주위 소음 시설 유무',
    '골목길 가로등 유무',
    '치안',
  ],
}

/**
 * 프리셋 적용
 * @param {string} presetKey - PRESETS의 키
 * @param {object} opts - 옵션 { deactivateOthers?: boolean }
 *  - deactivateOthers: 프리셋에 없는 항목은 비활성화(false)할지 여부 (기본 false)
 */
async function applyPreset(presetKey, opts = {}) {
  const { deactivateOthers = false } = opts
  const keywords = PRESETS[presetKey] || []
  if (!keywords.length) return

  // 현재 체크리스트 아이템(스토어에 이미 로드돼 있다고 가정)
  const all = checklistStore.currentChecklistItems || []

  // 프리셋에 포함된 키워드 → true로 만들 대상
  const toActivate = all
    .filter(item => keywords.includes(item.keyword))
    .map(item => ({
      checklistItemId: item.checklistItemId,
      isActive: true,
    }))

  // 프리셋에 없는 항목을 끌지 여부
  const toDeactivate = deactivateOthers
    ? all
        .filter(item => item.isActive && !keywords.includes(item.keyword))
        .map(item => ({
          checklistItemId: item.checklistItemId,
          isActive: false,
        }))
    : []

  const payloadItems = [...toActivate, ...toDeactivate]

  if (!payloadItems.length) {
    alert('적용할 항목을 찾지 못했어요.')
    return
  }

  try {
    // ✅ 한 번의 요청으로 일괄 반영 (백엔드 DTO에 맞춤)
    await checklistStore.updateChecklistItem(checklistId, payloadItems)

    // 필요 시 재조회(새로고침 대신)
    await checklistStore.loadChecklist(checklistId)

    alert('프리셋이 적용되었습니다.')
    location.reload()
  } catch (e) {
    console.error('프리셋 적용 실패:', e?.response?.data || e)
    alert('프리셋 적용 중 오류가 발생했어요.')
  }
}
const presetLabels = {
  YOUTH_20S: '20대 추천 항목',
  BASIC_SAFE: '안심 기본 항목',
  TRANSPORT_INFRA: '교통 편의형',
  FULL_OPTION: '가전·가구 옵션형',
  PET_FRIENDLY: '반려동물·주거 환경',
}

async function resetChecklist() {
  if (!confirm('정말 모든 항목을 비활성화하시겠습니까?')) return

  const all = checklistStore.currentChecklistItems || []
  const payloadItems = all.map(item => ({
    checklistItemId: item.checklistItemId,
    isActive: false,
  }))

  try {
    await checklistStore.updateChecklistItem(checklistId, payloadItems)
    await checklistStore.loadChecklist(checklistId)
    alert('모든 항목이 초기화되었습니다.')
    location.reload()
  } catch (e) {
    console.error('초기화 실패:', e?.response?.data || e)
    alert('초기화 중 오류가 발생했습니다.')
  }
}
</script>

<template>
  <div class="ChecklistDetail">
    <div class="actions">
      <div class="icon-wrapper" @click="resetChecklist">
        <img src="@/assets/refresh.svg" />
        <!-- 초기화 아이콘 -->
        <span class="icon-label">초기화</span>
      </div>
      <div class="icon-wrapper" @click="showEditModal = true">
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
          <div class="cta-wrap">
            <!-- router-link 써도 되고, 클릭이벤트로 이동해도 됨 -->
            <button class="cta-btn" @click="goToAppliedList">
              적용된 목록 보러가기
              <span class="chev">›</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 항목 리스트 -->
    <section class="section" v-if="checklist">
      <div class="preset-container">
        <button
          v-for="(label, key) in presetLabels"
          :key="key"
          class="preset-btn"
          @click="applyPreset(key, true)"
        >
          {{ label }}
        </button>
      </div>
      <h5 class="fw-bold pt-3">
        방 컨디션
        <button @click="() => openModal('방 컨디션', 'ROOM')" class="add-img">
          <img src="@/assets/add-btn.svg" />
        </button>
      </h5>

      <div class="tag-group pb-5">
        <span v-for="item in roomItems" :key="item.checklistItemId" class="tag">
          {{ item.keyword }}
        </span>
      </div>

      <h5 class="fw-bold">
        건물 컨디션
        <button
          @click="() => openModal('건물 컨디션', 'BUILDING')"
          class="add-img"
        >
          <img src="@/assets/add-btn.svg" />
        </button>
      </h5>
      <div class="tag-group pb-5">
        <span
          v-for="item in buildingItems"
          :key="item.checklistItemId"
          class="tag"
        >
          {{ item.keyword }}
        </span>
      </div>

      <h5 class="fw-bold">
        주변 인프라
        <button
          @click="() => openModal('주변 인프라', 'INFRA')"
          class="add-img"
        >
          <img src="@/assets/add-btn.svg" />
        </button>
      </h5>
      <div class="tag-group pb-5">
        <span
          v-for="item in infraItems"
          :key="item.checklistItemId"
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
          :key="item.checklistItemId"
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
          :key="item.checklistItemId"
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
          :key="item.checklistItemId"
          class="tag"
        >
          {{ item.keyword }}
        </span>
      </div>
      <div class="footer-btn">
        <button class="edit-btn" @click="gotoChecklist">적용하기</button>
      </div>
    </section>
  </div>
  <ItemToggleModal
    v-if="showModal"
    :label="modalLabel"
    :items="modalItems"
    :checklist-id="checklistId"
    @close="onModalClose"
  />
  <CustomChecklistModal
    v-if="showCustomModal"
    :checklist-id="checklistId"
    @close="handleCustomModalClose"
  />
  <ChecklistDeleteSubmitModal
    v-if="showDeleteConfirm"
    @confirm="confirmDeleteChecklist"
    @close="showDeleteConfirm = false"
  />
  <ChecklistEditSubmitModal
    v-if="showEditModal"
    :initTitle="checklist.title"
    :initDescription="checklist.description"
    @save="updateChecklistInfo"
    @close="showEditModal = false"
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
  /* min-height: 100%; */
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
  margin-bottom: 2rem;
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

.cta-btn {
  border: none;
  outline: none;
  background: #fff;
  color: #1b73ff; /* 파란 텍스트 */
  padding: 0.5rem 0.9rem;
  border-radius: 10px; /* 알약 모양 */
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  white-space: nowrap;
}
.preset-container {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.preset-container::-webkit-scrollbar {
  height: 6px;
}
.preset-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.preset-btn {
  flex-shrink: 0;
  background-color: #f1f5ff;
  color: #1b73ff;
  border: 1px solid #1b73ff;
  border-radius: 1.5rem;
  padding: 0.4rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-btn:hover {
  background-color: #1b73ff;
  color: white;
}
</style>
