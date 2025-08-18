<script setup>
import { useRouter } from 'vue-router'
import Buttons from '@/components/common/buttons/Buttons.vue'
import { computed, onMounted, ref } from 'vue'
import { usePropertyStore } from '@/stores/property'
import api from '@/api/property'

const router = useRouter()
const propertyStore = usePropertyStore()

const selectOptionItem = ref([])

// 응답에서 영문으로 온 옵션 라벨 -> 한글 라벨로 매핑
const KO_LABEL = {
  Washer: '세탁기',
  Refrigerator: '냉장고',
  AirConditioner: '에어컨',
  Dryer: '건조기',
  Microwave: '전자렌지',
  GasStove: '가스렌지',
  Induction: '인덕션',
  Bed: '침대',
}

// 선택된 옵션 아이템 중에서 아이템의 아이디만 가져오도록 계산
const selectOption = computed(() =>
  selectOptionItem.value.filter(i => i.isActive).map(i => i.id),
)

const handlePrevClick = () => {
  router.push({ name: 'otherInfoPage' })
}

const handleNextClick = () => {
  if (selectOption.value.length > 0) {
    propertyStore.updateNewProperty('optionIdList', selectOption.value)
    router.push({ name: 'moveDatePage' })
  } else {
    alert('옵션을 선택해주세요')
  }
}

onMounted(async () => {
  // 옵션 정보 가져오기
  const res = await api.getOptions()
  const resOptionList = res?.data?.data ?? res?.data ?? []

  // 페이지로 돌아왔을 때, 선택된 값 그대로 보일 수 있도록 함
  const saved = propertyStore.getNewProperty?.selectOptions || []
  // 저장된 옵션이 있을 때, 중복 제거하고 새로 생성되는 저장된 값에 대한 배열
  const savedSet = new Set(Array.isArray(saved) ? saved : [])

  // 서버 응답을 렌더용 구조로 변환 + isActive 값
  selectOptionItem.value = resOptionList.map(({ optionId, optionType }) => ({
    id: optionId,
    label: KO_LABEL[optionType] ?? optionType, // 매핑 없으면 영어로 표기
    isActive: savedSet.has(optionId),
  }))
})
</script>

<template>
  <div class="OptionPage">
    <div class="option-container">
      <Buttons
        v-for="item in selectOptionItem"
        :key="item.id"
        class="option"
        v-model:is-active="item.isActive"
        type="option"
        :label="item.label"
      />
    </div>
    <div class="button-wrapper">
      <Buttons
        type="default"
        label="이전"
        @click="handlePrevClick"
        class="prevBtn"
      />
      <Buttons
        type="default"
        label="다음"
        @click="handleNextClick"
        class="nextBtn"
      />
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
  border: 0.1rem solid var(--primary-color);
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
