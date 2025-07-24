<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goToRiskInfo = () => {
  router.push('/auth/login') // 로그인 페이지로 경로 이동
}
</script>

<template>
  <section class="landrisk-section">
    <!-- POINT 2 라벨 -->
    <div class="point-label">POINT 2</div>

    <div class="landrisk-container">
      <!-- 좌측: 텍스트 -->
      <div class="landrisk-description">
        <p class="description-title">
          믿고 고르는 첫걸음,<br />
          안심 매물 뱃지
        </p>
        <p class="description-subtitle">
          전세가율부터 불법 건축물까지,<br />
          중요한 리스크를 한눈에 확인
        </p>
      </div>

      <!-- 우측: 이미지 (클릭 시 이동) -->
      <div class="landrisk-image-wrapper" @click="goToRiskInfo">
        <img
          src="@/assets/images/landing/TestImage.png"
          alt="안심 매물 이미지"
          class="landrisk-image"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.landrisk-section {
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
  margin: 1rem 2rem 2rem 2rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: var(--font-weight-lg);
}

.landrisk-container {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
  }
}

/* 텍스트 영역 */
.landrisk-description {
  /* width: 50%; */
  flex: 1;
  text-align: right;
  margin: 0.5rem;
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

/* 이미지 영역 */
.landrisk-image-wrapper {
  /* flex-shrink: 0; */
  cursor: pointer;
  transition: transform 0.2s;
  /* width: 45%; */
  margin: 1rem;
  display: flex;
  justify-content: center;
}
.landrisk-image-wrapper:hover {
  transform: scale(1.02);
}
.landrisk-image {
  width: 230px;
  border-radius: 1rem;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}
</style>
