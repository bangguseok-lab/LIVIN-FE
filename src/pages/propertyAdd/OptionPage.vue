<script setup>
import { useRouter } from 'vue-router';
import Buttons from '@/components/common/buttons/Buttons.vue';
import { computed, onMounted, ref } from 'vue';
import { usePropertyStore } from '@/stores/property';

const router = useRouter()
const propertyStore = usePropertyStore()

// 옵션 라벨들
const OPTION_LABELS = [
  '세탁기', '건조기', '에어컨', '냉장고',
  '전자렌지', '가스렌지', '인덕션', '침대'
]

// 각 옵션의 on/off 상태
const selectOptionItem = ref(
  OPTION_LABELS.map(label => ({ label, isActive: false }))
)

// 선택된 옵션 리스트 (on(true)상태면 자동 포함, off(false)상태면 선택된 리스트에서 자동 제외)
const selectOption = computed(() =>
  selectOptionItem.value.filter(i => i.isActive).map(i => i.label)
)

const handlePrevClick = () => {
  router.push({ name: "otherInfoPage" })
}

const handleNextClick = () => {
  propertyStore.updateNewProperty('selectOptions', selectOption.value)
  router.push({ name: "moveDatePage" })
}

// 페이지로 돌아왔을 때, 선택된 값 그대로 보일 수 있도록 함
onMounted(() => {
  const saved = propertyStore.getNewProperty?.selectOptions || []

  // 저장된 옵션이 있을 때만 실행
  if (Array.isArray(saved) && saved.length) {
    // 저장된 라벨들에 맞춰 isActive 복원
    const set = new Set(saved)
    selectOptionItem.value.forEach(i => { i.isActive = set.has(i.label) })
  }
})
</script>

<template>
  <div class="OptionPage">
    <div class="option-container">
      <Buttons v-for="(item, idx) in selectOptionItem" :key="item.label.concat(idx)" class="option"
        v-model:is-active="item.isActive" type="option" :label="item.label" />
    </div>
    <div class="button-wrapper">
      <Buttons type="default" label="이전" @click="handlePrevClick" class="prevBtn" />
      <Buttons type="default" label="다음" @click="handleNextClick" class="nextBtn" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.OptionPage {
  position: relative;
  width: 100%;
  height: 90%;
}

.option-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 2rem;
  width: 100%;
  height: 70%;
}

.option {
  margin-bottom: 1rem;
}

.option:deep(.button):hover {
  cursor: pointer;
  border: .1rem solid var(--primary-color);
  color: var(--primary-color);
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
