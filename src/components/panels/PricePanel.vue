<script setup>
import Buttons from '../common/buttons/Buttons.vue'
import RangeSelector from './RangeSelector.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css'

import { usePriceStore } from '@/stores/priceStore'

const modules = [FreeMode, Pagination, Navigation]
const priceStore = usePriceStore()

const emit = defineEmits(['filterCompleted'])

function complete_btn_handler() {
  emit('filterCompleted')
}

function cancel_btn_handler() {
  priceStore.resetAll()
}
</script>

<template>
  <div class="price-panel">
    <swiper
      :modules="modules"
      :pagination="{ clickable: true }"
      :slides-per-view="1"
      :navigation="{ clickable: true }"
      class="price-swiper"
    >
      <!-- 전세 보증금 범위 선택 패널 -->
      <swiper-slide>
        <RangeSelector
          title="전세 보증금"
          description="최소 금액과 최대 금액을 순서대로 선택해주세요."
          class="element1"
          :numberList="[
            '-',
            6000,
            7000,
            8000,
            9000,
            10000,
            20000,
            30000,
            40000,
            50000,
            60000,
            70000,
            80000,
            90000,
            '+',
          ]"
          type="jeonseDeposit"
        />
      </swiper-slide>

      <!-- 월세 보증금 범위 선택 패널 -->
      <swiper-slide>
        <RangeSelector
          title="월세 보증금"
          description="최소 금액과 최대 금액을 순서대로 선택해주세요"
          class="element1"
          :numberList="[
            '-',
            500,
            1000,
            2000,
            3000,
            4000,
            5000,
            6000,
            7000,
            8000,
            9000,
            10000,
            15000,
            20000,
            '+',
          ]"
          type="monthlyDeposit"
        />
      </swiper-slide>

      <!-- 월세 범위 선택 패널 -->
      <swiper-slide>
        <RangeSelector
          title="월세"
          description="최소 금액과 최대 금액을 순서대로 선택해주세요"
          class="element2"
          :numberList="[
            '-',
            10,
            20,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
            100,
            200,
            300,
            400,
            '+',
          ]"
          type="monthlyRent"
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
        class="complete-btn"
      />
      <Buttons
        label="초기화"
        :is-active="false"
        type="md"
        @click="cancel_btn_handler"
        class="cancel-btn"
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
}
.element2 {
  padding-bottom: 1.5rem;
}

.region-btn-section {
  display: flex;
  justify-content: space-between;
}

/* Swiper */
.price-swiper {
  width: 100%;
  height: auto;
  margin-bottom: 1.5rem;

  /* 페이지네이션 위치/색 */
  :deep(.swiper-pagination) {
    bottom: rem(-6.5px) !important;
  }
  :deep(.swiper-pagination-bullet) {
    background: var(--grey);
    opacity: 1;
  }
  :deep(.swiper-pagination-bullet-active) {
    background: var(--primary-color);
    opacity: 1;
  }

  /* 화살표(내비게이션) */
  :deep(.swiper-button-prev),
  :deep(.swiper-button-next) {
    top: 16%;
    transform: translateY(-50%);
    width: rem(36px);
    height: rem(36px);
    border-radius: 50%;
    color: var(--primary-color);
    z-index: 5;
    pointer-events: auto;
  }

  /* 아이콘 크기 */
  :deep(.swiper-button-prev)::after,
  :deep(.swiper-button-next)::after {
    font-size: rem(15px);
    font-weight: var(--font-weight-lg);
  }

  /* 비활성 상태 */
  :deep(.swiper-button-disabled) {
    color: var(--grey) !important;
    cursor: default;
    pointer-events: none;
  }

  /* 좌우 여백 */
  :deep(.swiper-button-prev) {
    left: rem(-5px);
  }
  :deep(.swiper-button-next) {
    right: rem(-5px);
  }
}

/* 공용 버튼 컴포넌트 오버라이드 */
.complete-btn :deep(button) {
  background-color: var(--primary-color);
  color: var(--white);
  font-weight: var(--font-weight-medium);
  border-radius: 9px;
  width: rem(150px);
  height: rem(33px);
  font-size: 0.9rem;
}
.cancel-btn :deep(button) {
  background-color: var(--grey);
  color: var(--white);
  font-weight: var(--font-weight-medium);
  border-radius: 9px;
  width: rem(150px);
  height: rem(33px);
  font-size: 0.9rem;
}
</style>
