<script setup>
import { computed } from 'vue'

// Props 및 이벤트 정의
const props = defineProps({
  label: {
    type: String, // 버튼에 표시될 텍스트
    required: true,
  },
  panelKey: {
    type: String, // 패널 식별용 키값
    required: true,
  },
  isActive: {
    type: Boolean, // 현재 버튼이 활성 상태인지 여부
    default: false,
  },
})

// 패널 클릭 이벤트 발생시 상위에 알림
const emit = defineEmits(['click'])

function handleClick(event) {
  emit('click', event, props.panelKey)
}

// 활성 상태 계산
const isActive = computed(() => props.isActive)
</script>

<template>
  <!-- 필터 버튼 UI  -->
  <button
    class="filter-button"
    :class="{ active: isActive }"
    @click="handleClick"
  >
    {{ label }}
  </button>
</template>

<style scoped lang="scss">
.filter-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: rem(120px);
  height: rem(30px);
  font-size: rem(12px);
  padding: 0 rem(24px) 0 rem(12px);
  background-color: var(--white);
  color: var(--grey);
  border: rem(1px) solid var(--grey);
  border-radius: rem(12px);
  cursor: pointer;
  appearance: none;
  transition: all 0.2s ease;
  text-align: center;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: rem(8px);
    transform: translateY(-50%) rotate(45deg);
    width: rem(6px);
    height: rem(6px);
    border: solid #b3b3b3;
    border-width: 0 rem(1px) rem(1px) 0;
    pointer-events: none;
  }

  &:hover {
    background-color: var(--whitish);
  }

  &.active {
    border-color: var(--primary-color); // ✅ 여기에 강조 색상 적용
    color: var(--primary-color); // 글자 색도 같이 바뀌게 설정 가능
    background-color: var(--white);
  }
}
</style>
