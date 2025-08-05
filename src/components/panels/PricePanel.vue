<script setup>
import Buttons from '../common/buttons/Buttons.vue'
import RangeSelector from './RangeSelector.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Pagination } from 'swiper/modules'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import 'swiper/css'
import { defineProps } from 'vue'

const modules = [FreeMode, Pagination]

// 이벤트 emit 정의
const emit = defineEmits([
  'update:jeonseDeposit',
  'update:monthlyDeposit',
  'update:monthlyRent',
])

// 부모로부터 받은 props
const props = defineProps({
  isActive: Boolean,
  jeonseDeposit: Object, // 전세 보증금
  monthlyDeposit: Object, // 월세 보증금
  monthlyRent: Object, // 월세
})

// 가격대 리스팅
// 전세 보증금 (6천만 ~ 9억)
const jeonseList = [
  6000, 7000, 8000, 9000, 10000, 20000, 30000, 40000, 50000, 60000, 70000,
  80000, 90000,
]
const paddedJeonseList = ['-', ...jeonseList, '+']

// 월세 보증금 (6천만 ~ 9억) → 동일한 구조라면 재사용 가능
const monthlyDepositList = [
  500, 1000, 2000, 3000, 5000, 7000, 10000, 15000, 20000, 30000, 50000, 70000,
  100000,
]
const paddedMonthlyDepositList = ['-', ...monthlyDepositList, '+']

// 월세 (10만 ~ 60만)
const monthlyRentList = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400]
const paddedMonthlyRentList = ['-', ...monthlyRentList, '+']

/* 보증금 범위가 변경되었을 때 상위로 전달 @param {Object} range - { min, max }*/
const handleJeonseDeposit = range => {
  range.final = false
  emit('update:jeonseDeposit', range)
}

const handleMonthlyDeposit = range => {
  range.final = false
  emit('update:monthlyDeposit', range)
}
/*월세 범위가 변경되었을 때 상위로 전달 @param {Object} range - { min, max }*/
const handleMonthlyRent = range => {
  range.final = false
  emit('update:monthlyRent', range)
}

function complete_btn_handler() {
  if (props.jeonseDeposit) {
    emit('update:jeonseDeposit', { ...props.jeonseDeposit, final: true })
  }
  if (props.monthlyDeposit) {
    emit('update:monthlyDeposit', { ...props.monthlyDeposit, final: true })
  }
  if (props.monthlyRent) {
    emit('update:monthlyRent', { ...props.monthlyRent, final: true })
  }

  emit('filterCompleted')
}

function cancel_btn_handler() {
  emit('update:jeonseDeposit', { min: null, max: null, final: false })
  emit('update:monthlyDeposit', { min: null, max: null, final: false })
  emit('update:monthlyRent', { min: null, max: null, final: false })
}
</script>

<template>
  <div class="price-panel">
    <swiper
      :modules="modules"
      :pagination="{ clickable: true }"
      :slides-per-view="1"
      class="price-swiper"
    >
      <swiper-slide>
        <!-- 전세 보증금 범위 선택 패널 -->
        <RangeSelector
          :key="JSON.stringify(jeonseDeposit)"
          title="전세 보증금"
          description="최소 금액과 최대 금액을 순서대로 선택해주세요."
          class="element1"
          :numberList="paddedJeonseList"
          :initialMin="jeonseDeposit?.min ?? null"
          :initialMax="jeonseDeposit?.max ?? null"
          :visible="isActive"
          @updateRange="handleJeonseDeposit"
        />
      </swiper-slide>
      <swiper-slide>
        <!-- 월세 보증금 범위 선택 패널 -->
        <RangeSelector
          :key="JSON.stringify(monthlyDeposit)"
          title="월세 보증금"
          description="최소 금액과 최대 금액을 순서대로 선택해주세요."
          class="element1"
          :numberList="paddedMonthlyDepositList"
          :initialMin="monthlyDeposit?.min ?? null"
          :initialMax="monthlyDeposit?.max ?? null"
          :visible="isActive"
          @updateRange="handleMonthlyDeposit"
        />
      </swiper-slide>
      <!-- 월세 범위 선택 패널 -->
      <swiper-slide>
        <RangeSelector
          :key="JSON.stringify(monthlyRent)"
          title="월세"
          description="최소 금액과 최대 금액을 순서대로 선택해주세요."
          class="element2"
          :numberList="paddedMonthlyRentList"
          :initialMin="monthlyRent?.min ?? null"
          :initialMax="monthlyRent?.max ?? null"
          :visible="isActive"
          @updateRange="handleMonthlyRent"
        />
      </swiper-slide>
    </swiper>
    <!-- 필터 적용 버튼 -->
    <div class="region-btn-section">
      <Buttons
        label="완료"
        :is-active="true"
        type="md"
        @click="complete_btn_handler"
      />
      <Buttons
        label="초기화"
        :is-active="false"
        type="md"
        @click="cancel_btn_handler"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.price-panel {
  background-color: var(--white);
  border-radius: 1rem;
  padding: 2rem;
  width: rem(400px);
  max-width: rem(500px);
  border: solid var(--whitish) 1.5px;
  position: relative;
}
.element1 {
  padding-bottom: 1.5rem;
  // border-bottom: 2px solid var(--whitish);
}
.element2 {
  padding-bottom: 1.5rem;
}
.region-btn-section {
  display: flex; // 버튼들을 가로로 나열
  justify-content: space-between; // 또는 center, flex-end 등 필요에 맞게 조정
  gap: rem(10px); // 버튼 사이 간격
  margin: 1.5rem 1rem 0 1rem;
}
.price-swiper {
  width: 100%;
  height: auto;
  margin-bottom: 1.5rem;

  .swiper-pagination-bullet {
    background: var(--primary-color);
    opacity: 0.5;
  }
  .swiper-pagination-bullet-active {
    opacity: 1;
  }
}
</style>
