<script setup>
import { ref } from 'vue'
import RangeSelector from './RangeSelector.vue'

// 이벤트 emit 정의
const emit = defineEmits(['update:deposit', 'update:monthly'])

// 부모로부터 받은 props
const props = defineProps({
  isActive: Boolean, // 패널이 열려 있는지 여부
  deposit: Object, // 보증금 범위 { min, max }
  monthly: Object, // 월세 범위 { min, max }
})

/* 보증금 범위가 변경되었을 때 상위로 전달 @param {Object} range - { min, max }*/
function handleDeposit(range) {
  emit('update:deposit', range)
}
/*월세 범위가 변경되었을 때 상위로 전달 @param {Object} range - { min, max }*/
function handleMonthly(range) {
  emit('update:monthly', range)
}
</script>

<template>
  <div class="price-panel">
    <!-- 보증금 범위 선택 패널 -->
    <RangeSelector
      key="JSON.stringify(deposit)"
      title="보증금"
      description="최소 금액과 최대 금액을 순서대로 선택해주세요."
      class="element1"
      :numberList="[
        5000, 6000, 7000, 8000, 9000, 10000, 20000, 30000, 40000, 50000, 60000,
        70000, 80000, 90000, 100000,
      ]"
      :initialMin="deposit?.min ?? null"
      :initialMax="deposit?.max ?? null"
      :visible="isActive"
      @updateRange="handleDeposit"
    />
    <!-- 월세 범위 선택 패널 -->
    <RangeSelector
      key="JSON.stringify(monthly)"
      title="월세"
      description="최소 금액과 최대 금액을 순서대로 선택해주세요."
      class="element2"
      :numberList="[
        10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600,
      ]"
      :initialMin="monthly?.min ?? null"
      :initialMax="monthly?.max ?? null"
      :visible="isActive"
      @updateRange="handleMonthly"
    />
    <!-- 향후 필터 적용 버튼 삽입 예정 -->
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
  border-bottom: 2px solid var(--whitish);
}
.element2 {
  margin-top: 1.5rem;
}
</style>
