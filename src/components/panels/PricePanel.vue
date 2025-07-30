<script setup>
import Buttons from '../common/buttons/Buttons.vue'
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
const handleDeposit = range => {
  range.final = false
  emit('update:deposit', range)
}
/*월세 범위가 변경되었을 때 상위로 전달 @param {Object} range - { min, max }*/
const handleMonthly = range => {
  range.final = false
  emit('update:monthly', range)
}

function complete_btn_handler() {
  if (props.deposit) props.deposit.final = true
  if (props.monthly) props.monthly.final = true
  emit('update:deposit', props.deposit)
  emit('update:monthly', props.monthly)
  emit('filterCompleted') // 완료되었다는 이벤트를 emit
}

function cancel_btn_handler() {
  if (props.deposit) {
    props.deposit.final = false
    props.deposit.min = null
    props.deposit.max = null
    emit('update:deposit', props.deposit)
  }
  if (props.monthly) {
    props.monthly.final = false
    props.monthly.min = null
    props.monthly.max = null
    emit('update:monthly', props.monthly)
  }
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
  border-bottom: 2px solid var(--whitish);
}
.element2 {
  margin-top: 1.5rem;
}
.region-btn-section {
  display: flex; // 버튼들을 가로로 나열
  justify-content: space-between; // 또는 center, flex-end 등 필요에 맞게 조정
  gap: rem(10px); // 버튼 사이 간격
  margin: 1.5rem 1rem 0 1rem;
}
</style>
