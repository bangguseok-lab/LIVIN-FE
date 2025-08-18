<script setup>
import { useRouter } from 'vue-router';
import { usePropertyStore } from '@/stores/property';
import Buttons from '@/components/common/buttons/Buttons.vue';
import { ref } from 'vue';

const router = useRouter()
const propertyStore = usePropertyStore()
const choiceBtn = ref('')

// 버튼 활성 상태
const eastBtn = ref(false);
const westBtn = ref(false);
const southBtn = ref(false);
const northBtn = ref(false);
const southEastBtn = ref(false);
const southWestBtn = ref(false);
const northEastBtn = ref(false);
const northWestBtn = ref(false);


const resetButtons = () => {
  eastBtn.value = false
  westBtn.value = false
  southBtn.value = false
  northBtn.value = false
  southEastBtn.value = false
  southWestBtn.value = false
  northEastBtn.value = false
  northWestBtn.value = false
}

// 버튼 클릭 시 선택값 저장
const selectDirection = (choiceDirection) => {
  choiceBtn.value = choiceDirection
  // console.log('선택된 방향:', choiceBtn.value)
  propertyStore.updateNewProperty('direction', choiceBtn.value)

  resetButtons()

  switch (choiceDirection) {
    case '동향':
      eastBtn.value = true
      break
    case '서향':
      westBtn.value = true
      break
    case '남향':
      southBtn.value = true
      break
    case '북향':
      northBtn.value = true
      break
    case '남동향':
      southEastBtn.value = true
      break
    case '남서향':
      southWestBtn.value = true
      break
    case '북동향':
      northEastBtn.value = true
      break
    case '북서향':
      northWestBtn.value = true
      break
  }
}

const handlePrevClick = () => {
  router.push({ name: "photoPage" })
}

const handleNextClick = () => {
  if (propertyStore.getNewProperty.direction !== '') {
    router.push({ name: "roomDetailPage" })
  } else {
    alert('주실 방향을 선택해주세요')
  }
}

</script>

<template>
  <div class="RoomDirectionPage">
    <div class="roomDirection-container">
      <div class="room-wrapper">
        <Buttons class="directionBtn" v-model:is-active="eastBtn" type="direction" label="동향"
          @click="selectDirection('동향')" />
        <Buttons class="directionBtn" v-model:is-active="westBtn" type="direction" label="서향"
          @click="selectDirection('서향')" />
        <Buttons class="directionBtn" v-model:is-active="southBtn" type="direction" label="남향"
          @click="selectDirection('남향')" />
        <Buttons class="directionBtn" v-model:is-active="northBtn" type="direction" label="북향"
          @click="selectDirection('북향')" />
        <Buttons class="directionBtn" v-model:is-active="southEastBtn" type="direction" label="남동향"
          @click="selectDirection('남동향')" />
        <Buttons class="directionBtn" v-model:is-active="southWestBtn" type="direction" label="남서향"
          @click="selectDirection('남서향')" />
        <Buttons class="directionBtn" v-model:is-active="northEastBtn" type="direction" label="북동향"
          @click="selectDirection('북동향')" />
        <Buttons class="directionBtn" v-model:is-active="northWestBtn" type="direction" label="북서향"
          @click="selectDirection('북서향')" />
      </div>
    </div>
    <div class="button-wrapper">
      <Buttons type="default" label="이전" @click="handlePrevClick" class="prevBtn" />
      <Buttons type="default" label="다음" @click="handleNextClick" class="nextBtn" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.RoomDirectionPage {
  position: relative;
  width: 100%;
  height: 90%;
}

.roomDirection-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70%;
}

.room-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: .8rem;
  column-gap: .8rem;
}

.directionBtn:deep(.button) {
  width: 100%;
  font-weight: var(--font-weight-semibold);
}

.directionBtn:deep(.button):hover {
  cursor: pointer;
  color: var(--primary-color);
  border-color: var(--primary-color);
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
