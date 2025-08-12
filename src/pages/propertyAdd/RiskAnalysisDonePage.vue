<script setup>
import Buttons from '@/components/common/buttons/Buttons.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const handleClick = () => {
  router.push({ name: "photoPage" })
}
</script>

<template>
  <div class="RiskAnalysisDonePage">
    <div class="risk-container"></div>
    <Buttons type="default" label="다음" @click="handleClick" class="nextBtn" />
  </div>
</template>

<style scoped lang="scss">
.RiskAnalysisDonePage {
  position: relative;
  width: 100%;
  height: 90%;
}

.risk-container {
  width: 100%;
  height: 70%;
}

.nextBtn {
  width: 100%;
  height: rem(60px);
  margin-top: 5rem;
}
</style>
