<script setup>
import router from '@/router';
import { usePropertyStore } from '@/stores/property';
import { onMounted, ref } from 'vue';

// 부동산 고유번호 검사까지 끝난 주소
const propertyStore = usePropertyStore()

const inputAddress = ref('');

// 다음 페이지로 이동
const handleClick = () => {
  router.push({ name: 'propertyNumConfirm' })
}

onMounted(() => {
  inputAddress.value = propertyStore.getNewProperty.address + propertyStore.getNewProperty.detailAddress + propertyStore.getNewProperty.extraAddress;
  // console.log(inputAddress.value)
})
</script>

<template>
  <div class="PropertyNumConfirmPage">
    <div class="propertyNumberConfirm-container">
      <p class="inputAddress-text"></p>
      <div class="propertyNumberConfirm-info-wrapper"></div>
      <div class="propertyNumberConfirm-info-wrapper"></div>
    </div>
    <Buttons type="default" label="다음" @click="handleClick" class="nextBtn" />
  </div>
</template>

<style scoped>
.PropertyNumConfirmPage {}
</style>
