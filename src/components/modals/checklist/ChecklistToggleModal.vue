<!-- ChecklistToggleModal.vue -->
<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import { useChecklistStore } from '@/stores/checklist'
import Buttons from '@/components/common/buttons/Buttons.vue'
import ChecklistEditSubmitModal from './ChecklistEditSubmitModal.vue'

const props = defineProps(['label', 'items', 'checklistId'])
const emit = defineEmits(['close'])
const store = useChecklistStore()

const localItems = ref([...props.items])

watch(
  () => props.items,
  newItems => {
    localItems.value = [...newItems]
  },
  { immediate: true },
)

// 항목 상태 토글
const toggle = async item => {
  item.is_active = !item.is_active
}

const saveChanges = async () => {
  for (const item of localItems.value) {
    await store.updateChecklistItem(props.checklistId, item.id, item)
  }
  emit('close')
}
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-content">
      <h3>{{ label }} 항목 설정</h3>
      <div class="btn-sm-box">
        <div
          class="btn-box"
          v-for="item in localItems"
          :key="item.checklistItem_id"
        >
          <Buttons
            class="sm"
            type="sm"
            :is-active="item.is_active"
            @click="toggle(item)"
          >
            <div class="option-text">{{ item.keyword }}</div>
          </Buttons>
        </div>
      </div>
      <button class="close-btn" @click="saveChanges">저장</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  width: 55%;
  max-width: rem(600px);
  min-width: rem(400px);
  border-radius: 1rem;
}

.btn-sm-box {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.btn-box {
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
}

.close-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #999;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style>
