<script setup>
import { useChecklistStore } from '@/stores/checklist'
import { defineProps, onMounted, ref } from 'vue'
import api from '../../api/checklist'
const props = defineProps({
  propertyId: {
    type: Number,
    required: true,
  },
})
// const applyChecklist = async checklistId => {
//   if ('해당 체크리스트를 적용하시겠습니까?') {
//     const payload = {
//       checklistId: checklistId,
//       propertyId: props.propertyId,
//     }
//     try {
//       const data = await api.propretiesApplyChecklist(payload)
//       alert(data)
//     } catch (error) {
//       console.error('체크리스트 적용에 실패했습니다.', error)
//     }
//   }
// }
const checklist = useChecklistStore()
const emit = defineEmits(['close'])
const close = () => {
  emit('close')
}
const modalState = ref('list')
const selectedChecklistId = ref(null)
const selectChecklist = id => {
  selectedChecklistId.value = id
  modalState.value = 'confirm'
}
const confirmApplyChecklist = async () => {
  const payload = {
    checklistId: selectedChecklistId.value,
    propertyId: props.propertyId,
  }
  try {
    const data = await api.propretiesApplyChecklist(payload)
    alert('체크리스트가 성공적으로 적용되었습니다.')
    close()
  } catch (error) {
    console.error('체크리스트 적용에 실패했습니다.', error)
    alert('체크리스트 적용에 실패했습니다.')
  }
}

const cancelApplyChecklist = () => {
  modalState.value = 'list'
}
onMounted(() => {
  checklist.checklists = [
    { id: 1, title: '체크리스트 1' },
    { id: 2, title: '체크리스트 2' },
    { id: 3, title: '체크리스트 3' },
  ]
})
</script>
<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div v-if="modalState === 'list'" class="modal-screen">
        <div class="modal-header">
          <h2 class="modal-title">확인하고 싶은 리스트를 선택하세요</h2>
          <p class="modal-subtitle">누르면 해당 체크리스트를 볼 수 있어요</p>
        </div>
        <div class="modal-body">
          <template v-if="checklist.checklists.length > 0">
            <button
              class="checklist-button"
              v-for="item in checklist.checklists"
              :key="item.id"
              @click="selectChecklist(item.id)"
            >
              {{ item.title }}
            </button>
          </template>
          <div v-else class="no-checklist">등록된 체크리스트가 없습니다.</div>
        </div>
      </div>

      <div v-else-if="modalState === 'confirm'" class="modal-screen">
        <div class="modal-confirm-header">
          <h2 class="modal-confirm-title">이 체크리스트를 적용하시겠어요?</h2>
          <p class="modal-confirm-subtitle">
            나중에 다시 체크리스트를 변경할 수 있어요
          </p>
        </div>
        <div class="modal-confirm-body">
          <button class="confirm-button yes" @click="confirmApplyChecklist">
            예
          </button>
          <button class="confirm-button no" @click="cancelApplyChecklist">
            아니오
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #f7f7f7;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  padding: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  position: relative;
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: rem(24px);
  text-align: center;
}
.modal-title {
  font-size: rem(20px);
  font-weight: bold;
  margin: 0 0 rem(8px) 0;
  color: #333;
}
.modal-subtitle {
  font-size: rem(14px);
  color: #999;
  margin: 0;
}
.modal-body {
  display: flex;
  flex-direction: column;
  gap: rem(12px);
}
.checklist-button {
  width: 100%;
  padding: rem(16px);
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: rem(8px);
  font-size: rem(16px);
  color: #555;
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s;
  &:hover {
    background-color: #f5f5f5;
    border-color: #ccc;
  }
}

// 확인 모달 화면 스타일
.modal-confirm-header {
  text-align: center;
  margin-bottom: rem(32px);
}
.modal-confirm-title {
  font-size: rem(20px);
  font-weight: bold;
  margin-bottom: rem(8px);
}
.modal-confirm-subtitle {
  font-size: rem(14px);
  color: #999;
}
.modal-confirm-body {
  display: flex;
  justify-content: space-between;
  gap: rem(12px);
}
.confirm-button {
  flex: 1;
  padding: rem(16px);
  border: none;
  border-radius: rem(8px);
  font-size: rem(16px);
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }
}
.confirm-button.yes {
  background-color: var(--primary-color, #1e90ff); // 파란색
  color: #fff;
}
.confirm-button.no {
  background-color: #e0e0e0; // 회색
  color: #555;
}
</style>
