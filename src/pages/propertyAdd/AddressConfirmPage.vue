<script setup>
import Buttons from '@/components/common/buttons/Buttons.vue';
import router from '@/router';
import { usePropertyStore } from '@/stores/property';
import { onMounted, ref } from 'vue';

const propertyStore = usePropertyStore()

const postcode = ref('')
const address = ref('')
const detailAddress = ref('')
const extraAddress = ref('')

// '다음' 버튼 클릭했을 때 실행되는 함수
const handleClick = () => {
  router.push({ name: 'propertyNum' })
}

// 주소가 잘못 되었을 때 돌아가는 함수
const handleBackToSearch = () => {
  router.push({ name: 'addressSearch' })
}

onMounted(() => {
  postcode.value = propertyStore.getNewProperty.postcode;
  address.value = propertyStore.getNewProperty.address;
  detailAddress.value = propertyStore.getNewProperty.detailAddress;
  extraAddress.value = propertyStore.getNewProperty.extraAddress.trim().replace(/^\(|\)$/g, '');   // 문자열 앞뒤 괄호 제거
})
</script>

<template>
  <div class="AddressConfirmPage">
    <div class="addressConfirm-container">
      <div class="addressConfirm-wrapper">
        <p class="addressConfirm-title-text">{{ extraAddress }}</p>
        <div class="address-text"><span class="addressTitle-text">우편번호</span>{{ postcode }}</div>
        <div class="address-text"><span class="addressTitle-text">도로명 주소</span>{{ address }}</div>
        <div class="address-text"><span class="addressTitle-text">상세주소</span>{{ detailAddress }}</div>
        <p class="noAddress-text"><span @click="handleBackToSearch">이 주소가 아니에요</span></p>
      </div>
    </div>

    <Buttons type="default" label="다음" @click="handleClick" class="nextBtn" />
  </div>
</template>

<style scoped lang="scss">
.AddressConfirmPage {
  position: relative;
  width: 100%;
  height: 90%;
}

.addressConfirm-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85%;
}

.addressConfirm-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2rem 0;
  border-top: rem(2.5px) solid var(--light-grey);
  border-bottom: rem(2.5px) solid var(--light-grey);
}

.addressConfirm-title-text {
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  color: var(--title-text);
}

.address-text {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: .5rem;
  font-weight: var(--font-weight-light);
  color: var(--sub-title-text);
}

.addressTitle-text {
  width: 5rem;
  margin-right: 2rem;
  font-weight: var(--font-weight-semibold);
}

.noAddress-text {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  font-size: 0.8rem;
  font-weight: var(--font-weigth-medium);
  color: var(--primary-color);
}

.noAddress-text>span {
  border-bottom: rem(1.5px) solid var(--primary-color);
  cursor: pointer;
}

.nextBtn {
  width: 100%;
  height: rem(50px);
  margin-bottom: 5rem;
}
</style>
