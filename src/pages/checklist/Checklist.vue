<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useChecklistStore } from '@/stores/checklist'
import userAPI from '@/api/user'

const router = useRouter()
const user = ref('')
const showScrollTop = ref(false)
const checklistStore = useChecklistStore()
const checklists = computed(() => checklistStore.checklists)

function handleScroll() {
  showScrollTop.value = window.scrollY > 100
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const getUserNickname = async () => {
  try {
    const response = await userAPI.fetchMyPageInfo()
    user.value = response.data.nickname
  } catch (error) {
    this.error = error
    console.log('닉네임을 가져오면서 에러가 발생했습니다.', error)
  }
}

onMounted(() => {
  // 유저 닉네임 가져오기
  getUserNickname()

  window.addEventListener('scroll', handleScroll)
  checklistStore.loadChecklists()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function goToDetail(id) {
  router.push(`/checklist/${id}`)
}

const getRandomImage = () => {
  const images = [
    new URL('@/assets/images/checklist-1.jpg', import.meta.url).href,
    new URL('@/assets/images/checklist-2.jpg', import.meta.url).href,
  ]
  return images[Math.floor(Math.random() * images.length)]
}
</script>

<template>
  <div
    class="Checklist pad"
    style="max-width: 40.125rem; min-width: 30.125rem; margin: 0 auto"
  >
    <!-- 닉네임 문구 -->
    <div class="nickname">
      <span class="check-icon"
        ><img
          src="@/assets/icons/checklist/badge-check.png"
          alt="check-icon"
          class="badge-check"
      /></span>
      <span class="nickname-highlight">{{ user }}</span
      >님의
    </div>
    <div class="title">체크리스트 목록이예요</div>

    <!-- 상단 메뉴 -->
    <!-- <div class="d-flex justify-content-between align-items-center mb-3 pt-1"> -->
    <div class="menu">
      <router-link
        to="/checklist/create"
        class="text-primary small d-flex align-items-center text-decoration-none"
      >
        체크리스트 만들기 <span class="ms-1 fs-5">＋</span>
      </router-link>
      <div class="text-muted small">전체 {{ checklists.length }}개</div>
    </div>
    <!-- </div> -->

    <!-- 리스트 -->
    <div class="list-group Checklist-list">
      <div v-if="checklists.length === 0" class="no-checklist-box">
        <p>현재 체크리스트가 없어요</p>
        <p>
          <span class="nickname-text">{{ user }}</span
          >님만의 체크리스트를 추가해보세요!
        </p>
      </div>
      <div
        v-for="(checklist, index) in checklists"
        :key="index"
        class="each-list d-flex align-items-center py-3"
        @click="goToDetail(checklist.checklistId)"
        style="cursor: pointer"
      >
        <img
          class="rounded me-3"
          :src="getRandomImage()"
          style="width: 8.75rem; height: 6.25rem; object-fit: cover"
        />
        <div class="flex-grow-1">
          <div class="title-bold">{{ checklist.title }}</div>
          <div class="text-muted small">{{ checklist.description }}</div>
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
  padding: rem(100px) rem(40px) 5rem rem(40px);
  background-color: var(--white);
}

.badge-check {
  width: 0.8rem;
  height: 0.8rem;
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
}

.nickname {
  font-size: 0.9rem;
  color: var(--black);

  .nickname-highlight {
    color: var(--primary-color);
    font-weight: var(--font-weight-semibold);
  }
}

.title {
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  margin-bottom: rem(30px);
}

.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-top: 1px solid var(--whitish);
  border-bottom: 1px solid var(--whitish);
}

.Checklist-list {
  border-radius: 0 !important;
}

.each-list {
  border-bottom: 1px solid var(--whitish);
  cursor: pointer;
}

.no-checklist-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 10rem;
  color: var(--grey);
}

.no-checklist-box > p {
  font-weight: var(--font-weight-regular);
}

.nickname-text {
  color: var(--grey);
  font-weight: var(--font-weight-bold);
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
