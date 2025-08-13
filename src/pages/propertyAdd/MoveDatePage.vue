<script setup>
import { useRouter } from 'vue-router';
import { usePropertyStore } from '@/stores/property';
import { onMounted, ref, watch } from 'vue';
import Buttons from '@/components/common/buttons/Buttons.vue';
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

const router = useRouter()
const propertyStore = usePropertyStore()
const page = ref(null) // { month: 1~12, year: 4자리 }

// 스토어에 저장해둔 값이 있으면 그걸 기본값으로 사용
const moveDate = ref(propertyStore.newProperty?.moveDate ?? null)
const dateBtn = ref(moveDate.value?.false)  // 즉시 입주 가능 활성 상태 버튼


// 즉시 입주 선택 시, 날짜 선택 해제
watch(dateBtn, (isNowOn) => {
  if (isNowOn) {
    // 이미 선택된 날짜가 있으면 지움
    if (moveDate.value) {
      moveDate.value = null   // false 말고 null 로 비우기
      console.log('즉시 입주 ON → 날짜 해제')
    }
  }
})

// 날짜가 선택되면, 즉시 입주 버튼 끄기
watch(moveDate, (val) => {
  if (val) {
    if (dateBtn.value) {
      dateBtn.value = false
      console.log('날짜 선택 → 즉시 입주 OFF')
    }
  }
})

// 선택 값에 맞춰 캘린더에 표시할 달(page) 설정
const setPageFromDate = (selectDate) => {
  if (selectDate instanceof Date && !isNaN(selectDate)) {
    page.value = { month: selectDate.getMonth() + 1, year: selectDate.getFullYear() }
    // console.log('page: ', page.value.month)
  }
}

// 선택된 날짜를 'YYYY-MM-DD' 형식으로 변환
const selectDateFormatt = (val) => {

  if (!(val instanceof Date) || Number.isNaN(val.getTime())) return null

  const year = val.getFullYear()
  const month = String(val.getMonth() + 1).padStart(2, '0')
  const date = String(val.getDate()).padStart(2, '0')
  return `${year}-${month}-${date}`
}

const formattedRightNowDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const handlePrevClick = () => {
  router.push({ name: "optionPage" })
}

const handleNextClick = () => {
  const today = new Date()
  if (dateBtn.value) {
    propertyStore.updateNewProperty('moveDate', formattedRightNowDate(today))
  } else {
    propertyStore.updateNewProperty('moveDate', selectDateFormatt(moveDate.value))
  }
  router.push({ name: "lastPage" })
}

onMounted(() => {
  const today = new Date()
  const savedDate = propertyStore.getNewProperty?.moveDate || []
  if (savedDate === formattedRightNowDate(today)) {
    dateBtn.value = true
  } else {
    moveDate.value = savedDate
  }
  setPageFromDate(moveDate.value)
})
</script>

<template>
  <div class="MoveDatePage">
    <div class="moveDate-container">
      <VCalendar class="my-calendar" transparent borderless expanded />
      <!-- 캘린더 -->
      <VDatePicker v-model="moveDate" is-inline mode="date" :min-date="new Date()" title-position="left"
        locale="ko-KR" />

      <Buttons class="rightNow-btn" v-model:is-active="dateBtn" type="date" label="즉시 입주 가능합니다" />
    </div>
    <div class="button-wrapper">
      <Buttons type="default" label="이전" @click="handlePrevClick" class="prevBtn" />
      <Buttons type="default" label="다음" @click="handleNextClick" class="nextBtn" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.MoveDatePage {
  position: relative;
  width: 100%;
  height: 90%;
}

.moveDate-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70%;
}

// 즉시 입주 가능해요 버튼
.rightNow-btn:deep(.button) {
  width: 100%;
  margin-top: 2rem;
}

.rightNow-btn:deep(.button):hover {
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


// VCalendar 스타일
.moveDate-container:deep(.vc-container) {
  width: 100%;
  border: none;
}

.moveDate-container:deep(.vc-header) {
  margin-bottom: 1rem;
}

.moveDate-container:deep(.vc-title-wrapper .vc-title) {
  background-color: transparent;
}

.moveDate-container:deep(.vc-title-wrapper .vc-title span) {
  font-size: 1.2rem;
  font-weight: var(--font-weight-semibold);
  color: var(--title-text);
}

.moveDate-container:deep(.vc-container .vc-weekday-1) {
  color: var(--red);
}

.moveDate-container:deep(.vc-container .vc-weekday-7) {
  color: var(--primary-color);
}

.moveDate-container:deep(.vc-weekdays) {
  margin-bottom: 1rem;
}

.moveDate-container:deep(.vc-week) {
  margin-bottom: .5rem;
}

// DatePicker 스타일
.moveDate-container:deep(.vc-popover-content) {
  width: rem(200px);
  height: rem(200px);
}

.moveDate-container:deep(.vc-nav-items) {
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  justify-items: center;
  margin-top: .2rem;
}

.moveDate-container:deep(.vc-arrow) {
  color: var(--primary-color);
  background-color: transparent;
}

.moveDate-container:deep(.vc-nav-item) {
  font-weight: var(--font-weight-medium);
}
</style>
