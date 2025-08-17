<script setup>
import { ref, watch } from 'vue'
import Buttons from '../common/buttons/Buttons.vue'

// 부모 컴포넌트에서 선택된 거래유형 리스트를 prop으로 받음
const props = defineProps({
  selected: {
    type: Array,
    default: () => [],
  },
})

// 체크 상태 변경 시 선택된 label 배열을 상위로 전달
const emit = defineEmits(['select', 'filterCompleted'])

// 내부에서 사용할 거래유형 리스트 (체크 여부 포함)
const dealTypes = ref([
  { label: '전세', checked: false },
  { label: '월세', checked: false },
])

// 부모에서 전달된 selected 값을 기준으로 내부 checked 값 동기화
watch(
  () => props.selected,
  selected => {
    dealTypes.value.forEach(type => {
      type.checked = selected.includes(type.label)
    })
  },
  { immediate: true },
) // 컴포넌트 마운트 시 초기값 반영

// 완료 버튼 클릭 시만 emit
function confirmSelection() {
  const selectedLabels = dealTypes.value
    .filter(type => type.checked)
    .map(type => type.label)

  emit('select', selectedLabels)
  emit('filterCompleted')
}

// 초기화 버튼 클릭 시 모든 체크 해제
function resetSelection() {
  dealTypes.value.forEach(type => {
    type.checked = false
  })
  const labels = []
  emit('select', labels)
  emit('filterCompleted')
}
</script>

<template>
  <!-- 거래유형 필터 패널 -->
  <div class="deal-type-panel">
    <!-- 거래유형 리스트 반복 렌더링 -->
    <div
      class="deal-type-row"
      v-for="(type, index) in dealTypes"
      :key="type.label"
    >
      <!-- 라벨 -->
      <label class="deal-type-label" :for="`deal-type-${index}`">
        {{ type.label }}
      </label>

      <!-- 체크박스-->
      <input
        :id="`deal-type-${index}`"
        type="checkbox"
        class="deal-type-checkbox"
        v-model="type.checked"
        @change="updateSelected"
      />

      <!-- 구분선 (마지막 항목 제외) -->
      <div
        v-if="index !== dealTypes.length - 1"
        class="deal-type-divider"
      ></div>
    </div>
    <!-- 버튼 영역 -->
    <div class="deal-type-buttons">
      <Buttons
        label="완료"
        :is-active="true"
        type="md"
        @click="confirmSelection"
        class="complete-btn"
      />
      <Buttons
        label="초기화"
        :is-active="false"
        type="md"
        @click="resetSelection"
        class="cancel-btn"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.deal-type-panel {
  background-color: #fff;
  border-radius: rem(12px);
  box-shadow: 0 0 rem(4px) rgba(0, 0, 0, 0.1);
  padding: rem(16px) rem(32px);
  width: rem(400px);
  align-items: center;
}

.deal-type-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: rem(8px) rem(20px);
}

.deal-type-label {
  font-size: rem(15px);
  font-weight: 600;
  color: var(--black);
}

.deal-type-checkbox {
  width: rem(18px);
  height: rem(18px);
  accent-color: var(--primary-color);
}

.deal-type-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid var(--whitish);
}
.deal-type-buttons {
  display: flex;
  justify-content: space-between; // 또는 center, flex-end, 원하는 정렬로
  gap: 1rem; // 버튼 사이 여백
  padding-top: 20px;
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
