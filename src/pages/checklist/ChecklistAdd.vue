<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useChecklistStore } from '@/stores/checklist'

const checklistStore = useChecklistStore()
const router = useRouter()

const title = ref('')
const description = ref('')

async function handleSubmit() {
  try {
    const newChecklist = {
      title: title.value,
      description: description.value,
      type: 'PHYSICAL',
    }
    const created = await checklistStore.addChecklist(newChecklist)
    console.log(created)

    router.push(`/checklist/${created.checklistId}`)
  } catch (error) {
    console.error('체크리스트 생성 실패:', error)
  }
}
</script>

<template>
  <div class="ChecklistCreatePage">
    <h2>새 체크리스트</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <label for="title">제목</label>
      <input
        id="title"
        v-model="title"
        placeholder="체크리스트 제목"
        required
      />

      <label for="description">설명</label>
      <textarea
        id="description"
        v-model="description"
        placeholder="체크리스트 설명"
        rows="3"
      ></textarea>

      <button type="submit" class="submit-btn">만들기</button>
    </form>
  </div>
</template>

<style scoped>
.ChecklistCreatePage {
  padding: 2rem;
  padding-top: 5rem;
  width: 100%;
  min-width: rem(600px);
  background-color: #fff;
}

h2 {
  margin-bottom: 1.5rem;
  color: #007bff;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input,
textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}
</style>
