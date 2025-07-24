<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentIndex = ref(0)

import image1 from '@/assets/images/landing/TestImage.png'
import image2 from '@/assets/images/landing/HeroImage.png'

const images = [image1, image2]

const goToSearch = () => {
  router.push('/auth/login') // 로그인 페이지로 경로 이동
}

const disableBodyScroll = () => {
  document.body.style.overflow = 'hidden'
}
const enableBodyScroll = () => {
  document.body.style.overflow = ''
}

const startX = ref(0)
const endX = ref(0)
const isDragging = ref(false)

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
  currentIndex.value = (currentIndex.value + 1) % images.length
}
const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
}
</script>

<template>
  <section class="landfav-section">
    <div class="point-label">POINT 3</div>

    <div
      class="landfav-card"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @mouseleave="isDragging && onMouseUp($event)"
      @click="goToSearch"
    >
      <!-- 이미지 영역 -->
      <div class="landfav-image-wrapper">
        <img
          :src="images[currentIndex]"
          alt="내 기준 매물 이미지"
          class="landfav-image"
          draggable="false"
        />
        <div class="dots">
          <span
            v-for="(_, i) in images"
            :key="i"
            :class="{ active: i === currentIndex }"
          ></span>
        </div>
      </div>
      <!-- 텍스트 영역 -->
      <div class="landfav-text">
        <p class="description-title">내가 정한 기준,<br />내가 고르는 매물</p>
        <p class="description-subtitle">
          조건 설정, 찜, 비교까지 한 번에 찾는 내 기준 매물
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.landfav-section {
  background-color: var(--white);
  max-width: rem(600px);
  margin: 0 auto;
  padding: 2rem;
  font-size: 1rem;
  text-align: center;
}

.point-label {
  display: inline-block;
  background-color: var(--primary-color);
  color: var(--white);
  padding: 0.25rem 0.75rem;
  margin-bottom: 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: var(--font-weight-lg);
}

/* ✅ 카드 컨테이너 */
.landfav-card {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: row;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
  }
}

/* ✅ 텍스트 */
.landfav-text {
  flex: 1;
  text-align: left;

  @media (max-width: 600px) {
    text-align: center;
  }
}

.description-title {
  font-weight: var(--font-weight-lg);
  font-size: 1rem;
  margin-bottom: 0.5rem;
  -webkit-text-stroke: 0.6px var(--black);
  color: var(--black);
}

.description-subtitle {
  font-size: 0.875rem;
  color: var(--grey);
}

/* ✅ 이미지 */
.landfav-image-wrapper {
  position: relative;
  cursor: pointer;
  user-select: none;
  touch-action: pan-y;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.landfav-image {
  width: 230px;
  margin: 1rem;
  border-radius: 1rem;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
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
