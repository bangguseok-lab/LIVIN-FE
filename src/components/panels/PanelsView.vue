<script setup>
import { ref } from 'vue'

// CheckPanel
import CheckPanel from '@/components/panels/CheckPanel.vue'
const isCheckOpen = ref(false)
const toggleCheckPanel = () => {
  isCheckOpen.value = !isCheckOpen.value
}

// PricePanel
import PricePanel from '@/components/panels/BasePanel.vue'
const isPriceOpen = ref(false) // 가격 필터 열림 상태
const togglePricePanel = () => {
  isPriceOpen.value = !isPriceOpen.value
} // 버튼 클릭 시 열고 닫기 토글
</script>

<template>
  <!-- ✅ CheckPanel 드롭다운 -->
  <div class="dropdown-wrapper">
    <button @click="toggleCheckPanel" class="dropdown-toggle">
      {{ isCheckOpen ? '체크패널 닫기' : '체크패널 열기' }}
    </button>

    <transition name="dropdown">
      <div v-show="isCheckOpen">
        <CheckPanel :title="'체크 항목'" :onClose="() => (isCheckOpen = false)">
          여기에 컨텐츠 삽입
        </CheckPanel>
      </div>
    </transition>
  </div>

  <!-- PricePanel -->
  <div class="dropdown-wrapper">
    <!-- 버튼과 패널은 같은 컨테이너 안에 배치 -->
    <button @click="togglePricePanel" class="dropdown-toggle">
      {{ isPriceOpen ? '가격 필터 닫기' : '가격 필터 열기' }}
    </button>

    <!-- 여유 공간 확보로 위치 밀림 방지 -->
    <transition name="dropdown">
      <div v-show="isPriceOpen" class="dropdown-panel">
        <PricePanel />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.dropdown-wrapper {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.dropdown-toggle {
  background-color: var(--primary-color);
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  margin-bottom: 0.5rem; /* 버튼과 패널 사이 여백 */
  cursor: pointer;
}

/* 드롭다운 transition 효과 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.25s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.95); /* 수직 크기 축소 */
  transform-origin: top;
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: scaleY(1);
}
</style>
