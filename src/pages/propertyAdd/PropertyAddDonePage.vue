<script setup>
import { useRouter } from 'vue-router';
import Buttons from '@/components/common/buttons/Buttons.vue';

const router = useRouter()

const handleNextClick = () => {
  router.push({ name: "propertiesSearch" })
}
</script>

<template>
  <div class="PropertyAddDonePage">
    <div class="done-container">
      <p class="done-title animate-up" style="animation-delay: 0s">LIVIN이 매력적인 매물을</p>
      <p class="done-title animate-up" style="animation-delay: 0s">게시했어요!</p>
    </div>
    <Buttons type="default" label="등록한 매물 보러가기" @click="handleNextClick" class="nextBtn" />
  </div>
</template>

<style scoped lang="scss">
.PropertyAddDonePage {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 6rem 2rem 0;
}

.done-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85%;
  padding-top: 1.5rem;
}

.done-title {
  font-size: 2rem;
  font-weight: var(--font-weight-semibold);
  color: var(--title-text);
}

.done-title:nth-of-type(2) {
  position: relative;
  top: -1rem;
}

.nextBtn {
  width: 100%;
  height: rem(60px);
  margin-bottom: 5rem;
}

@keyframes fadeUp {
  0% {
    /* 아래에서 시작 */
    opacity: 0;
    transform: translateY(50px);
  }

  100% {
    /* 제자리 */
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-up {
  animation: fadeUp 0.6s ease-out forwards;
}
</style>
