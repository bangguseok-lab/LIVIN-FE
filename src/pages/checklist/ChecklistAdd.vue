<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useChecklistStore } from '@/stores/checklist'
import checklist from '@/router/checklist'

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
    const id = created.checklistId
    router.push(`/checklist/${id}`)
  } catch (error) {
    console.error('체크리스트 생성 실패:', error)
  }
}
</script>

<template>
  <div class="ChecklistCreatePage">
    <h2>새 체크리스트</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <label for="title" class="title">이름</label>
      <input
        id="title"
        v-model="title"
        placeholder="체크리스트의 이름을 입력하세요"
        required
      />

      <label for="description" class="desc">설명</label>
      <textarea
        id="description"
        v-model="description"
        placeholder="체크리스트에 대한 설명을 입력하세요"
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
  margin-bottom: 2rem;
  margin-top: 1.5rem;
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  font-size: 1rem;
  color: #666;
  margin-top: 2rem;
}

.desc {
  font-size: 1rem;
  color: #666;
  margin-top: 2rem;
}

input,
textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.submit-btn {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem;
  margin-top: 4rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: var(--font-weight-regular);
  cursor: pointer;
}
</style>
