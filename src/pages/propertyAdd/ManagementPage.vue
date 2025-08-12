<script setup>
import { useRouter } from 'vue-router';
import Buttons from '@/components/common/buttons/Buttons.vue';

const router = useRouter()

const handlePrevClick = () => {
  router.push({ name: "roomDetailPage" })
}

const handleNextClick = () => {
  router.push({ name: "otherInfoPage" })
}
</script>

<template>
  <div class="ManagementPage">
    <div class="management-container"></div>
    <div class="button-wrapper">
      <Buttons type="default" label="이전" @click="handlePrevClick" class="prevBtn" />
      <Buttons type="default" label="다음" @click="handleNextClick" class="nextBtn" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ManagementPage {
  position: relative;
  width: 100%;
  height: 90%;
}

.management-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70%;
}

.button-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 2rem;
  padding-top: 4rem;
}

.prevBtn,
.nextBtn {
  width: 100%;
  height: rem(50px);
  margin-bottom: 5rem;
}
</style>
