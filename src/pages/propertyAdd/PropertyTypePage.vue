<script setup>
import Buttons from '@/components/common/buttons/Buttons.vue';
import router from '@/router';
import { ref } from 'vue'

// 전세, 월세 버튼 활성 상태 값을 결정하는 변수
const junseOptIsActive = ref(false)
const monthlyRentOptIsActive = ref(false)

// 전세 버튼 클릭 시 월세 버튼 비활성화 하는 함수
const onJunseClick = () => {
  junseOptIsActive.value = true
  monthlyRentOptIsActive.value = false
}

// 월세 버튼 클릭 시 전세 버튼 비활성화 하는 함수
const onMonthlyRentClick = () => {
  junseOptIsActive.value = false
  monthlyRentOptIsActive.value = true
}


// 다음 페이지로 이동
const handleClick = () => {
  // 부동산 고유번호가 비어있지 않을 때
  if (junseOptIsActive.value) {
    router.push({ name: 'junsePage' })
  } else {
    router.push({ name: 'wolsePage' })
  }
}

</script>

<template>
  <div class="PropertyTypePage">
    <Buttons type="option" label="전세" v-model:isActive="junseOptIsActive" class="type-button" @click="onJunseClick" />
    <Buttons type="option" label="월세" v-model:isActive="monthlyRentOptIsActive" class="type-button"
      @click="onMonthlyRentClick" />
  </div>
  <Buttons type="default" label="다음" @click="handleClick" class="nextBtn" />
</template>

<style scoped lang="scss">
.PropertyTypePage {
  position: relative;
  width: 100%;
  height: 90%;
}

.type-button {
  width: 100%;
  margin-bottom: 1rem;
}

.nextBtn {
  width: 100%;
  height: rem(70px);
  margin-bottom: 5rem;
}
</style>
