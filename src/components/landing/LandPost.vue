<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()

import image1 from '@/assets/images/landing/PostHome.svg'
import image2 from '@/assets/images/landing/SecureBadge.svg'

const cardData = [
  {
    title: '매물 등록, 더 간편하게',
    subtitle: '복잡함 없이 주소 입력만으로! </br> 간편한 매물 등록',
    image: image1,
  },
  {
    title: "신뢰를 보여주는 가장 쉬운 방법, \n '안심 매물 뱃지'",
    subtitle: '리빈의 4가지 핵심 분석을 통한 </br> 신뢰를 높이는 매물 홍보',
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
      <h2>그렇다면, <span class="post-highlight">임대인</span>은요?</h2>
      <p>이제는 단순한 집이 아닌, 신뢰를 등록하세요</p>
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
        <!-- 항상 상단 중앙에 고정될 라벨 -->
        <div class="point-label">POINT 4</div>

        <!-- 텍스트와 이미지만 유연하게 정렬될 영역 -->
        <div class="landpost-content">
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
  background-color: var(--white);
  max-width: rem(600px);
  margin: 0 auto;
  padding: 3rem 2rem;
  text-align: center;
  font-weight: var(--font-weight-lg);
  color: var(--grey);
}
.post-highlight {
  color: var(--red);
  font-weight: var(--font-weight-lg);
}
.landpost-heading h2 {
  font-size: 1.2rem;
  font-weight: var(--font-weight-lg);
  color: var(--black);
  margin: 0.5rem 0 0.5rem 0;
}

.landpost-heading p {
  font-size: 0.9rem;
  font-weight: var(--font-weight-semibold);
}

.landpost-card {
  background-color: var(--white);
  border-radius: 1rem;
  padding: 2rem 1rem;
  margin-top: 4rem;
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

.point-label {
  display: inline-block;
  background-color: var(--primary-color);
  color: var(--white);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: var(--font-weight-semibold);
  margin-bottom: 1rem;
}

.landpost-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .landpost-content {
    flex-direction: column;
  }
}

@media (min-width: 481px) {
  .landpost-content {
    flex-direction: row;
  }
}
.landpost-text {
  color: var(--black);
  font-weight: var(--font-weight-lg);
  max-width: rem(200px);
  text-align: center;
}

.landpost-text h3 {
  font-size: 1rem;
  font-weight: var(--font-weight-lg);
  margin-bottom: 0.5rem;
}

.landpost-text p {
  font-size: 0.875rem;
  font-weight: var(--font-weight-semibold);
  color: var(--grey);
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
