<!-- src/views/Forbidden.vue -->
<template>
  <main class="forbidden">
    <!-- 상단 서브타이틀 -->
    <p class="eyebrow">You're Not Allowed in Here</p>

    <!-- 메인 타이틀 -->
    <h1 class="headline">
      FORBIDDEN
      <span class="badge" aria-hidden="true">
        <!-- 작은 X 아이콘 -->
        <svg viewBox="0 0 24 24" class="xmark">
          <circle
            cx="12"
            cy="12"
            r="11"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M7 7 L17 17 M17 7 L7 17"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </span>
    </h1>

    <!-- 안내문 -->
    <p class="message">
      죄송해요, 접근 권한이 없어요<br />
      확인 후 다시 시도해주세요
    </p>

    <!-- 하단 액션 -->
    <button class="home-link" @click="goHome">
      <svg viewBox="0 0 24 24" class="home-icon" aria-hidden="true">
        <path
          d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5v-9Z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
        />
        <path
          d="M9 21v-6h6v6"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        />
      </svg>
      홈으로 돌아가기
    </button>

    <!-- 브랜드/푸터 -->
    <footer class="brand">LIVIN</footer>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => router.push({ name: 'home' }) // 홈 라우트 이름에 맞춰 변경
</script>

<style scoped>
/* 컬러 토큰(프로젝트 변수 없을 때도 예쁘게 보이도록 기본값 제공) */
:root {
  --forbidden-bg: #41b1c6; /* 스샷과 비슷한 청록 */
  --forbidden-text: #ffffff;
  --forbidden-dim: rgba(255, 255, 255, 0.85);
  --forbidden-muted: rgba(255, 255, 255, 0.7);
}

/* 레이아웃 */
.forbidden {
  min-height: 100vh;
  width: 100%;
  background: var(--forbidden-bg);
  color: var(--forbidden-text);
  display: grid;
  grid-template-rows: 1fr auto auto 1fr auto; /* 위 여백, 타이틀, 메시지, 빈공간, 버튼/브랜드 */
  justify-items: center;
  text-align: center;
  padding: 24px 20px 24px;
  box-sizing: border-box;
}

/* 상단 작은 라벨 */
.eyebrow {
  align-self: start;
  margin-top: 8px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 12px;
  color: var(--forbidden-muted);
}

/* 메인 헤드라인 */
.headline {
  margin: 12px 0 0;
  font-size: 42px;
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: 0.04em;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* 동그란 배지(X) */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-left: 6px;
  color: var(--forbidden-text);
  border: 2px solid var(--forbidden-text);
  transform: translateY(-2px);
}
.xmark {
  width: 18px;
  height: 18px;
}

/* 안내문 */
.message {
  margin-top: 18px;
  font-size: 16px;
  line-height: 1.6;
  color: var(--forbidden-dim);
}

/* 하단 버튼 */
.home-link {
  align-self: end;
  margin: 24px 0 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 999px;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  background: transparent;
  color: var(--forbidden-text);
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    transform 0.06s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}
.home-link:hover {
  transform: translateY(-1px);
  border-color: #fff;
  background: rgba(255, 255, 255, 0.08);
}
.home-icon {
  width: 18px;
  height: 18px;
}

/* 브랜드 푸터 */
.brand {
  align-self: end;
  font-size: 11px;
  letter-spacing: 0.35em;
  opacity: 0.85;
  margin-top: 6px;
}

/* 데스크톱에서 조금 키우기 */
@media (min-width: 768px) {
  .headline {
    font-size: 56px;
  }
  .badge {
    width: 36px;
    height: 36px;
  }
  .xmark {
    width: 20px;
    height: 20px;
  }
  .message {
    font-size: 18px;
  }
}
</style>
