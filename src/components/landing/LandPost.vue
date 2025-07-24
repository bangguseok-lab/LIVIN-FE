<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()

import image1 from '@/assets/images/landing/TestImage.png'
import image2 from '@/assets/images/landing/HeroImage.png'

const cardData = [
  {
    title: '매물 등록, 더 간편하게',
    subtitle: '복잡함 없이, 주소 입력만으로\n공적 자료 기반 매물 정리',
    image: image1,
  },
  {
    title: "신뢰를 보여주는 가장 쉬운 방법\n'안심 매물' 뱃지",
    subtitle: '안심 뱃지와 함께하는 4가지 핵심 분석,\n신뢰를 높이는 매물 홍보',
    image: image2,
  },
]

const currentIndex = ref(0)

const goToRegister = () => {
  router.push('/auth/login') // 로그인 페이지로 경로 이동
}

const startX = ref(0)
const endX = ref(0)
const isDragging = ref(false)

const disableBodyScroll = () => {
  document.body.style.overflow = 'hidden'
}
const enableBodyScroll = () => {
  document.body.style.overflow = ''
}

const onTouchStart = e => {
  startX.value = e.touches[0].clientX
  disableBodyScroll()
}

const onTouchEnd = e => {
  endX.value = e.changedTouches[0].clientX
  enableBodyScroll()
  handleSwipe()
}

const onMouseDown = e => {
  isDragging.value = true
  startX.value = e.clientX
  disableBodyScroll()
}

const onMouseUp = e => {
  if (!isDragging.value) return
  endX.value = e.clientX
  isDragging.value = false
  enableBodyScroll()
  handleSwipe()
}

const handleSwipe = () => {
  const diff = endX.value - startX.value
  if (Math.abs(diff) < 30) return // threshold 이하 무시
  if (diff < 0) {
    // 오른쪽에서 왼쪽으로 → 다음 이미지
    nextSlide()
  } else {
    // 왼쪽에서 오른쪽으로 → 이전 이미지
    prevSlide()
  }
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % cardData.length
}

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + cardData.length) % cardData.length
}
</script>

<template>
  <section class="landpost-section">
    <!-- 상단 제목 -->
    <div class="landpost-heading">
      <h2>그렇다면, 임대인은요?</h2>
      <p>이제는 매물이 아니라, 신뢰를 등록하세요.</p>
    </div>

    <!-- 등록 카드 -->
    <transition name="slide-fade" mode="out-in">
      <div
        class="landpost-card"
        :key="currentIndex"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        @mouseleave="isDragging && onMouseUp($event)"
        @click="goToRegister"
      >
        <div class="landpost-text">
          <h3>{{ cardData[currentIndex].title }}</h3>
          <p v-html="cardData[currentIndex].subtitle" />
        </div>
        <div class="landpost-image">
          <img
            :src="cardData[currentIndex].image"
            alt="등록 카드"
            draggable="false"
          />
        </div>
      </div>
    </transition>
    <div class="dots">
      <span
        v-for="(_, i) in cardData"
        :key="i"
        :class="{ active: i === currentIndex }"
      ></span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.landpost-section {
  background-color: var(--whitish);
  max-width: rem(600px);
  margin: 0 auto;
  padding: 3rem 2rem;
  text-align: center;
  border-radius: 3rem;
}

.landpost-heading h2 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.landpost-heading p {
  font-size: 1rem;
}

.landpost-card {
  background-color: var(--primary-color);
  border-radius: 1rem;
  padding: 2rem 1rem;
  margin-top: 2rem;
  /* min-height: 300px; */
  touch-action: pan-y;
  aspect-ratio: 3 / 2;
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.landpost-card:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.landpost-text {
  color: white;
  max-width: 200px;
  text-align: left;
}

.landpost-text h3 {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.landpost-text p {
  font-size: 0.875rem;
  line-height: 1.4;
}

.landpost-image img {
  width: 220px;
  max-height: rem(300px);
  object-fit: cover;
  border-radius: 0.75rem;
  display: block;
  user-select: none;
  pointer-events: none;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

.dots {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}
.dots span {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin: 0 3px;
  background: #ccc;
  border-radius: 999px;
}
.dots span.active {
  background: var(--primary-color);
}
</style>
