<script setup>
import Buttons from '../common/buttons/Buttons.vue'
import RangeSelector from './RangeSelector.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Pagination } from 'swiper/modules'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import 'swiper/css'

import { usePriceStore } from '@/stores/priceStore'

const modules = [FreeMode, Pagination]
const priceStore = usePriceStore()

const emit = defineEmits(['filterCompleted'])

function complete_btn_handler() {
  console.log('[PricePanel] 완료 클릭 - 현재 선택값 ↓')
  console.log('전세 보증금:', priceStore.states.jeonseDeposit)
  console.log('월세 보증금:', priceStore.states.monthlyDeposit)
  console.log('월세:', priceStore.states.monthlyRent)
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
          description="최소 금액과 최대 금액을 순서대로 선택해주세요."
          class="element1"
          :numberList="[
            '-',
            500,
            1000,
            2000,
            3000,
            5000,
            7000,
            10000,
            15000,
            20000,
            30000,
            50000,
            70000,
            100000,
            '+',
          ]"
          type="monthlyDeposit"
        />
      </swiper-slide>

      <!-- 월세 범위 선택 패널 -->
      <swiper-slide>
        <RangeSelector
          title="월세"
          description="최소 금액과 최대 금액을 순서대로 선택해주세요."
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
