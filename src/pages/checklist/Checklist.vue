<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChecklistStore } from '@/stores/checklist'

const router = useRouter()
const user = ref({ nickname: '영태는 핑크가 제일 싫어' })
const showScrollTop = ref(false)
const checklists = ref([])
const checklistStore = useChecklistStore()
// const checklists = computed(() => checklistStore.checklists)

function handleScroll() {
  showScrollTop.value = window.scrollY > 100
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // checklistStore.loadChecklists()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function goToDetail(id) {
  router.push(`/checklist/${id}`)
}

onMounted(() => {
  checklists.value = [
    {
      id: 1,
      title: '기본 체크리스트',
      description1: '체크리스트 설명',
      description2: '체크리스트 설명',
    },
    {
      id: 2,
      title: '체크리스트 2',
      description1: '이사 전에 확인할 항목',
      description2: '주소 이전, 청소 예약 등',
    },
  ]
})
</script>

<template>
  <div
    class="Checklist px-3 pad"
    style="max-width: 40.125rem; min-width: 30.125rem; margin: 0 auto"
  >
    <!-- 닉네임 문구 -->
    <div class="text-secondary small">
      <span class="text-primary fw-semibold">{{ user.nickname }}</span> 님의
    </div>
    <div class="fs-4 fw-bold mt-1 mb-4">체크리스트 목록이에요</div>

    <!-- 상단 메뉴 -->
    <div class="d-flex justify-content-between align-items-center mb-3 pt-1">
      <router-link
        to="/checklist/create"
        class="text-primary small d-flex align-items-center text-decoration-none"
      >
        체크리스트 만들기 <span class="ms-1 fs-5">＋</span>
      </router-link>
      <div class="text-muted small">전체 {{ checklists.length }}개</div>
    </div>

    <!-- 리스트 -->
    <div class="list-group border-top Checklist-list">
      <div
        v-for="(checklist, index) in checklists"
        :key="index"
        class="d-flex align-items-center py-3 border-bottom"
        @click="goToDetail(checklist.id)"
        style="cursor: pointer"
      >
        <div
          class="bg-light rounded me-3"
          style="width: 8.75rem; height: 6.25rem"
        ></div>
        <div class="flex-grow-1">
          <div class="title-bold">{{ checklist.title }}</div>
          <div class="text-muted small">{{ checklist.description1 }}</div>
          <div class="text-muted small">{{ checklist.description2 }}</div>
        </div>
      </div>
      <button
        v-show="showScrollTop"
        class="scroll-top-btn"
        @click="scrollToTop"
      >
        ↑
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.Checklist {
  width: 100%;
  padding-top: 5rem;
  padding-bottom: 5rem;
  background-color: var(--white);
}
.Checklist-list {
  border-radius: 0 !important;
}
.title-bold {
  font-weight: 800;
}

.scroll-top-btn {
  position: fixed;
  bottom: 5rem;
  right: 1.5rem;
  width: 2.75rem;
  height: 2.75rem;
  border: none;
  border-radius: 50%;
  background-color: #1976d2;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 200;
  transition: opacity 0.3s ease;
}
</style>
