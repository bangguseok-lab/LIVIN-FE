<script setup>
import { ref, computed } from 'vue'
import { useChecklistStore } from '@/stores/checklist'
const props = defineProps(['checklistId'])
const store = useChecklistStore()

const keyword = ref('')
const emit = defineEmits(['close'])
const customItems = computed(() =>
  store.currentChecklistItems.filter(i => i.type === 'CUSTOM'),
)

const add = async () => {
  if (!keyword.value.trim()) return
  await store.addItemToChecklist(props.checklistId, {
    customItems: [
      {
        keyword: keyword.value,
        type: 'CUSTOM',
        isActive: true,
      },
    ],
  })
  await store.loadChecklist(props.checklistId)
  keyword.value = ''
}

const remove = async itemId => {
  await store.removeItemFromChecklist(props.checklistId, itemId)
  await store.loadChecklist(props.checklistId)
}

const handleComplete = () => {
  emit('close')
}
</script>
<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-content">
      <h3 class="title">나의 항목</h3>
      <p class="subtitle">원하는 항목을 생성해보세요</p>

      <!-- 항목 리스트 -->
      <div class="tag-group">
        <span
          class="tag"
          v-for="item in customItems"
          :key="item.checklistItemId"
        >
          {{ item.keyword }}
          <button class="remove-btn" @click="remove(item.checklistItemId)">
            ×
          </button>
        </span>
      </div>

      <!-- 입력창 + 추가 버튼 -->
      <div class="input-group">
        <input
          class="custom-input"
          v-model="keyword"
          placeholder="본인만의 항목을 작성해주세요"
        />
        <button class="add-btn" @click="add">추가</button>
      </div>

      <!-- 완료 버튼 -->
      <button class="complete-btn" @click="handleComplete">완료</button>
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
  width: 60%;
  max-width: rem(600px);
  min-width: rem(400px);
  border-radius: 1rem;
  text-align: center;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
}

.subtitle {
  color: #888;
  margin-bottom: 1rem;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.tag {
  background-color: #007bff;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
}

.remove-btn {
  all: unset;
  margin-left: 0.5rem;
  font-weight: bold;
  cursor: pointer;
}

.complete-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}
.input-group {
  display: flex;
  margin-bottom: 1rem;
  width: 100%;
}

.custom-input {
  flex: 1; // 나머지 공간 다 차지
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.75rem;
  font-size: 0.9rem;
}

.add-btn {
  padding: 0.75rem 1.25rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
}
</style>
