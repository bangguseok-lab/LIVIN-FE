<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goToChecklist = () => {
  router.push('/auth/login')
}
</script>
<template>
  <section class="checklist-section">
    <!-- POINT 1 라벨 -->
    <div class="point-label">POINT 1</div>

    <div class="checklist-container">
      <!-- 좌측: 이미지 -->
      <div class="checklist-image-wrapper" @click="goToChecklist">
        <img
          src="@/assets/images/landing/CheckList.svg"
          alt="체크리스트 이미지"
          class="checklist-image"
        />
      </div>

      <!-- 우측: 텍스트 -->
      <div class="checklist-description">
        <p class="description-title">나만의 맞춤형 체크리스트</p>
        <p class="description-subtitle">
          내 기준 그대로!
          <br />
          오직 나만을 위한 집 고르기 체크리스트
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.checklist-section {
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
  font-weight: var(--font-weight-semibold);
}

.checklist-container {
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

/* 이미지 영역 */
.checklist-image-wrapper {
  /* flex-shrink: 0; */
  cursor: pointer;
  transition: transform 0.2s;
  /* width: 45%; */
  margin: 1rem;
  display: flex;
  justify-content: center;
}
.checklist-image-wrapper:hover {
  transform: scale(1.02);
}
.checklist-image {
  width: 230px;
  border-radius: 1rem;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

/* 텍스트 영역 */
.checklist-description {
  width: 50%;
  flex: 1;
  text-align: left;
  margin: 0.5rem;
  @media (max-width: 600px) {
    text-align: center;
  }
}
.description-title {
  font-weight: var(--font-weight-lg);
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--black);
}
.description-subtitle {
  font-size: 0.875rem;
  font-weight: var(--font-weight-semibold);
  color: var(--grey);
}
</style>
