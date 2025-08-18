<script setup>
import { ref, onMounted } from 'vue'
import { usePropertyStore } from '@/stores/property'
import TriSelect from '@/components/common/TriSelect.vue'
import Buttons from '@/components/common/buttons/Buttons.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const propertyStore = usePropertyStore()

// 각 항목 상태 (기본값 NEEDS_CHECK)
const loan = ref('NEEDS_CHECK')     // 대출 유무
const pet = ref('NEEDS_CHECK')      // 반려동물 가능 여부
const parking = ref('NEEDS_CHECK')  // 주차 가능 여부

// 재진입 시 스토어 → 화면 복원
onMounted(() => {
  loan.value = propertyStore.getNewProperty?.loan ?? 'NEEDS_CHECK'
  pet.value = propertyStore.getNewProperty?.pet ?? 'NEEDS_CHECK'
  parking.value = propertyStore.getNewProperty?.parking ?? 'NEEDS_CHECK'
})

const handlePrevClick = () => {
  router.push({ name: "managementPage" })
}

const handleNextClick = () => {
  // 한 번에 스토어 저장
  propertyStore.updateNewProperty('loan', loan.value)
  propertyStore.updateNewProperty('pet', pet.value)
  propertyStore.updateNewProperty('parking', parking.value)

  router.push({ name: "optionPage" })
}
</script>

<template>
  <div class="OtherInfoPage">
    <div class="otherInfo-container">
      <div class="other-info">
        <TriSelect label="대출" v-model="loan" />
        <hr class="divider" />
        <TriSelect label="반려동물" v-model="pet" />
        <hr class="divider" />
        <TriSelect label="주차" v-model="parking" />
      </div>
    </div>
    <div class="button-wrapper">
      <Buttons type="default" label="이전" @click="handlePrevClick" class="prevBtn" />
      <Buttons type="default" label="다음" @click="handleNextClick" class="nextBtn" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.OtherInfoPage {
  position: relative;
  width: 100%;
  height: 90%;
}

.otherInfo-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70%;
}

.other-info {
  padding: 0 1rem;
}

.divider {
  border: 0;
  height: 0.1rem;
  background: #eee;
  margin: 1.1rem 0;
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
