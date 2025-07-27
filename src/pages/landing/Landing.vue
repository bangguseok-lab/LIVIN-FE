<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import LandCheck from '@/components/landing/LandCheck.vue'
import LandRisk from '@/components/landing/LandRisk.vue'
import LandFav from '@/components/landing/LandFav.vue'
import LandPost from '@/components/landing/LandPost.vue'
import Footer from '@/components/layouts/Footer.vue'

import { useRouter } from 'vue-router'
const router = useRouter()

const goToLogin = () => {
  router.push('/auth/login')
}
</script>

<template>
  <div class="landing-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <p class="hero-title">
        나만의 공간을 위한 <span class="hero-highlight">모든 준비</span>
      </p>
      <div class="hero-logo-wrapper">
        <img
          src="@/assets/images/landing/LogoWhite.png"
          alt="Livin Logo"
          class="hero-logo"
        />
      </div>
      <p class="hero-description">
        매물 비교부터 위험 진단과 체크리스트까지<br />
        복잡한 부동산, 이제 한 번에 해결하세요
      </p>
      <div class="hero-image-wrapper">
        <img
          src="@/assets/images/landing/HeroImage.png"
          alt="Hero Image"
          class="hero-image"
        />
      </div>
    </section>

    <!-- 문제 제기 Section -->
    <section class="problem-section">
      <p class="problem-title">
        집을 구할 때,<br />
        <span class="problem-highlight">이런 적</span> 있으시죠?
      </p>
      <div class="problem-badge-wrapper">
        <div class="top-badge">
          <p class="problem-badge1">직접 검색하고 정리하기 귀찮아</p>
        </div>
        <div class="bottom-badge">
          <p class="problem-badge2">내가 이 집을 왜 골랐지?</p>
          <p class="problem-badge3">전세 사기, 남 일 같지 않네</p>
        </div>
      </div>
      <div class="problem-image-wrapper">
        <img
          src="@/assets/images/landing/ProblemImage.png"
          alt="생각하는 캐릭터"
          class="problem-image"
        />
      </div>
    </section>

    <!-- 해결 방법 안내 -->
    <section class="solution-section">
      <p class="solution-title">
        복잡했던 집 구하기,<br />
        <span class="solution-logo-wrapper"
          ><img
            src="@/assets/images/landing/LogoBlue.png"
            alt="Livin Logo"
            class="solution-logo" /></span
        >은 <span class="solution-highlight">세 가지</span>로 해결합니다
      </p>
    </section>

    <!-- Components -->
    <LandCheck />
    <LandRisk />
    <LandFav />
    <LandPost />

    <!-- CTA -->
    <section class="cta-section">
      <p class="cta-title">
        집을 구하는 모든 순간,<br />
        <span class="cta-logo-wrapper"
          ><img
            src="@/assets/images/landing/LogoBlue.png"
            alt="Livin Logo"
            class="cta-logo" /></span
        >은 당신의 <span class="highlight-primary">기준과 안전</span>을 지킵니다
      </p>
      <p class="cta-description">
        우리는 더 많은 정보보다는 더 나은 판단을 돕는 도구가 필요하다고
        믿습니다.<br />
        리빈은 믿을 수 있는 정보와 당신의 기준을 연결합니다.<br />
        불안한 선택 대신, 적절한 기준으로 안심할 수 있는 주거 결정을 내릴 수
        있게,<br />
        당신의 주거 결정이 지금보다 더 단단해지도록.
      </p>
    </section>
    <!-- Floating Button -->
    <div class="floating-start-btn">
      <button class="start-btn" @click="goToLogin">
        <img
          src="@/assets/images/landing/LogoWhite.png"
          class="floating-logo"
        />
        &nbsp; 시작하기
      </button>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style scoped lang="scss">
.landing-container {
  max-width: rem(600px);
  min-width: rem(375px);
  width: 100%;
  min-height: 100vh;
  font-size: 1rem;
  background-color: var(--primary-color);
  color: var(--black);
  position: relative;
  margin: 0 auto;
}

/* Hero section */
.hero-section {
  text-align: center;
  margin-bottom: 3rem;
}
.hero-title {
  margin-top: 3rem;
  color: var(--white);
  font-weight: var(--font-weight-bold);
  font-size: 1.25rem;
  // -webkit-text-stroke: 0.4px var(--white);
}
.hero-highlight {
  color: var(--pink);
  font-weight: var(--font-weight-bold);
}
.hero-logo {
  height: 20px;
}
.hero-description {
  color: var(--white);
  font-size: 1rem;
  margin-top: 3rem;
  font-weight: var(--font-weight-light);
  line-height: 1.5;
}
.hero-image-wrapper {
  margin-top: 3.5rem;
  margin-bottom: 4rem;
}
.hero-image {
  width: 200px;
}

/* Problem Section */
.problem-section {
  background-color: var(--white);
  padding: 3rem 3rem 0rem 3rem;
  text-align: center;
  border-radius: 2rem 2rem 0 0;
}
.problem-title {
  font-weight: var(--font-weight-lg);
  text-align: left;
  font-size: 1.25rem;
  line-height: 1.5;
  padding-top: 0.5rem;
}
.problem-highlight {
  color: var(--primary-color);
  font-weight: var(--font-weight-lg);
}
.problem-badge-wrapper {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
}
.bottom-badge {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}
.problem-badge1 {
  display: inline-block;
  background-color: var(--green);
  color: var(--white);
  font-size: 0.9rem;
  padding: 0.75rem 1.25rem;
  border-radius: 9999px;
  font-weight: var(--font-weight-semibold);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
}
.problem-badge2,
.problem-badge3 {
  display: inline-block;
  background-color: var(--green);
  color: var(--white);
  font-size: 0.9rem;
  padding: 0.75rem 1.25rem;
  border-radius: 9999px;
  font-weight: var(--font-weight-semibold);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
}
.problem-image-wrapper {
  position: relative;
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    bottom: 0px; /* 이미지보다 약간 아래 */
    width: 300px;
    height: 180px;
    background-color: var(--whitish);
    border-top-left-radius: 250px;
    border-top-right-radius: 250px;
    z-index: 0;
  }

  .problem-image {
    position: relative;
    z-index: 1;
    width: 200px;
  }
}

/* Solution Section */
.solution-section {
  background-color: var(--white);
  text-align: center;
  padding: 8rem 0rem 1rem 0;
}
.solution-title {
  font-size: 1.25rem;
  font-weight: var(--font-weight-lg);
  line-height: 1.5;
}
.solution-highlight {
  color: var(--purple);
  font-weight: var(--font-weight-lg);
}
.solution-logo-wrapper {
  display: inline-block;
  vertical-align: middle;
}
.solution-logo {
  height: rem(16px);
  margin-bottom: 0.35rem;
}

/* CTA Section */
.cta-section {
  background-color: var(--white);
  text-align: center;
  padding: 4rem 1rem;
}
.cta-title {
  font-size: 1.25rem;
  font-weight: var(--font-weight-lg);
  line-height: 1.6rem;
}
.cta-logo-wrapper {
  display: inline-block;
  vertical-align: middle;
}
.cta-logo {
  height: rem(16px);
  margin-bottom: 0.35rem;
}
.cta-description {
  font-size: 0.75rem;
  margin-top: 4rem;
  line-height: 1.5;
  font-weight: var(--font-weight-semibold);
  color: var(--grey);
}
.highlight-primary {
  color: var(--skyblue);
  font-weight: var(--font-weight-lg);
}

.floating-logo {
  width: rem(42px);
}

.floating-start-btn {
  position: fixed;
  bottom: rem(20px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  pointer-events: none;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: rem(600px);
  padding: 0;
  box-sizing: border-box;
}

.floating-start-btn .start-btn {
  pointer-events: auto;
  background-color: var(--primary-color);
  color: white;
  font-size: rem(14px);
  height: rem(50px);
  width: 80%;
  min-width: rem(200px);
  border: none;
  border-radius: rem(50px);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 rem(16px);
}
</style>
