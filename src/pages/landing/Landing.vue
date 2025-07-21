<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import LandCheck from '@/components/landing/LandCheck.vue'
import LandRisk from '@/components/landing/LandRisk.vue'
import LandFav from '@/components/landing/LandFav.vue'
import LandPost from '@/components/landing/LandPost.vue'
import Footer from '@/components/layouts/Footer.vue'
</script>

<template>
  <div class="landing-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <p class="hero-title">나만의 공간을 위한 모든 준비</p>
      <div class="hero-logo-wrapper">
        <img
          src="@/assets/images/landing/LogoBlue.png"
          alt="Livin Logo"
          class="hero-logo"
        />
      </div>
      <p class="hero-description">
        매물 비교부터 위험 진단, 체크리스트까지<br />
        복잡한 부동산, 이제 한 번에 해결하세요.
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
        이런 적 있으시죠?
      </p>
      <div class="problem-badge-wrapper">
        <div class="top-badge">
          <p class="problem-badge1">직접 검색하고 정리하기 귀찮아</p>
        </div>
        <div class="bottom-badge">
          <p class="problem-badge2">내가 이 집을 왜 골랐었지?</p>
          <p class="problem-badge3">전세 사기, 남의 일 같지 않네</p>
        </div>
      </div>
      <div class="problem-image-wrapper">
        <img
          src="@/assets/images/landing/TestImage.png"
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
        >은 세가지로 해결합니다
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
        우리는 더 많은 정보보다, 더 나은 판단을 돕는 도구가 필요하다고
        믿습니다.<br />
        불안한 선택 대신, 내가 원하는 조건과 안심할 수 있는 기준으로 주거 결정을
        내릴 수 있게,<br />
        리빈은 믿을 수 있는 정보와 당신의 기준을 연결합니다.<br />
        당신의 주거 결정이 지금보다 더 단단해지도록.
      </p>
    </section>
  </div>

  <!-- Footer -->
  <Footer />
</template>

<style scoped lang="scss">
.landing-container {
  max-width: rem(600px);
  min-height: 100vh;
  margin: 0 auto;
  padding: 1.5rem 0rem;
  font-size: 1rem;
  background-color: var(--white);
  color: var(--black);
}

/* Hero */
.hero-section {
  text-align: center;
  margin-bottom: 3rem;
}
.hero-title {
  margin-top: 3rem;
  color: var(--primary-color);
  font-weight: var(--font-weight-lg); /* 조금더 굵은 게 있어야 할 듯*/
  font-size: 1.25rem;
}
.hero-logo {
  height: 20px;
  margin-top: -1rem;
}
.hero-description {
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: var(--font-weight-sm);
  line-height: 1.5;
}
.hero-image-wrapper {
  margin-top: 1rem;
}
.hero-image {
  width: 200px;
}

/* Problem Section */
.problem-section {
  background-color: var(--whitish);
  padding: 3rem 3rem 0rem 3rem;
  text-align: center;
  border-radius: 3.5rem 3.5rem 0 0;
}
.problem-title {
  font-weight: var(--font-weight-lg);
  text-align: left;
  font-size: 1.25rem;
  line-height: 1.5;
  padding-top: 0.5rem;
}
.problem-badge-wrapper {
  margin-top: 1.5rem;
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
  background-color: var(--primary-color);
  color: var(--white);
  font-size: 0.9rem;
  padding: 0.75rem 1.25rem;
  border-radius: 9999px;
  font-weight: var(--font-weight-sm);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
}
.problem-badge2,
.problem-badge3 {
  display: inline-block;
  background-color: var(--primary-color);
  color: var(--white);
  font-size: 0.9rem;
  padding: 0.75rem 1.25rem;
  border-radius: 9999px;
  font-weight: var(--font-weight-sm);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
}
.problem-image-wrapper {
  margin-top: 2rem;
}
.problem-image {
  width: 200px;
}

/* Solution Section */
.solution-section {
  text-align: center;
  padding: 4rem 1rem;
}
.solution-title {
  font-size: 1.25rem;
  font-weight: var(--font-weight-lg);
  line-height: 1.5;
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
  text-align: center;
  padding: 4rem 1rem;
  /* background-color: var(--whitish); */
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
  font-weight: var(--font-weight-sm);
  color: var(--grey);
}
.highlight-primary {
  color: var(--primary-color);
  font-weight: var(--font-weight-lg);
}
</style>
