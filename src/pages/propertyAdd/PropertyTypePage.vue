<script setup>
import Buttons from '@/components/common/buttons/Buttons.vue'
import { useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/property'
import { ref } from 'vue'

const router = useRouter()

// 거래 유형 저장에 사용하려고 둔 스토어
const propertyStore = usePropertyStore()

// 전세, 월세 버튼 활성 상태 값을 결정하는 변수
const jeonseOptIsActive = ref(false)
const monthlyRentOptIsActive = ref(false)

// 전세 버튼 클릭 시 월세 버튼 비활성화 하는 함수
const onJeonseClick = () => {
  jeonseOptIsActive.value = true
  monthlyRentOptIsActive.value = false
}

// 월세 버튼 클릭 시 전세 버튼 비활성화 하는 함수
const onMonthlyRentClick = () => {
  jeonseOptIsActive.value = false
  monthlyRentOptIsActive.value = true
}

// 다음 페이지로 이동
const handleClick = () => {
  // 아무것도 선택하지 않고 넘어가려고 할 때, 유효성 검사 처리
  if (!jeonseOptIsActive.value && !monthlyRentOptIsActive.value) {
    alert('거래 유형을 선택해주세요')
  } else {
    // 부동산 고유번호가 비어있지 않을 때
    if (jeonseOptIsActive.value) {
      propertyStore.updateNewProperty('transactionType', 'JEONSE')
      router.push({ name: 'jeonsePage' })
    } else {
      propertyStore.updateNewProperty('transactionType', 'MONTHLY_RENT')
      router.push({ name: 'wolsePage' })
    }
  }

}
</script>

<template>
  <div class="PropertyTypePage">
    <Buttons type="option" label="전세" v-model:isActive="jeonseOptIsActive" class="type-button" @click="onJeonseClick" />
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
