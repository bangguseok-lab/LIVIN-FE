<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },          // 섹션 제목 (예: '대출')
  modelValue: { type: String, default: 'NEEDS_CHECK' },
})

const emit = defineEmits(['update:modelValue'])

const options = [
  { label: '확인필요', value: 'NEEDS_CHECK' },
  { label: '가능', value: 'ABLE' },
  { label: '불가능', value: 'UNABLE' },
]

const current = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})
</script>

<template>
  <section class="tri-field">
    <div class="tri-title">{{ label }}</div>

    <div class="segmented" role="tablist" aria-label="선택: 확인필요/가능/불가능">
      <button v-for="(opt, i) in options" :key="opt.value" class="seg-btn"
        :class="[{ active: current === opt.value }, { 'with-divider': i !== 0 }]" role="tab"
        :aria-selected="current === opt.value" type="button" @click="current = opt.value">
        {{ opt.label }}
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.tri-field {
  padding: rem(20px) 0;
}

.tri-title {
  font-weight: var(--font-weight-bold);
  font-size: 1.1rem;
  margin-bottom: rem(12px);
  color: var(--title-text);
}

/* pill */
.segmented {
  display: flex;
  align-items: stretch;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  overflow: hidden;
  background: var(--white);
}

/* item */
.seg-btn {
  flex: 1 1 0;
  padding: rem(12px) rem(10px);
  font-size: rem(15px);
  color: var(--grey);
  background: transparent;
  border: 0;
  outline: none;
  cursor: pointer;
  transition: color .15s ease, background-color .15s ease;
}

/* 가운데 구분선 */
.seg-btn.with-divider {
  position: relative;
}

.seg-btn.with-divider::before {
  content: "";
  position: absolute;
  left: 0;
  top: 15%;
  bottom: 15%;
  width: rem(1px);
  background: var(--whitish);
}

/* 선택 상태 */
.seg-btn.active {
  color: var(--primary-color);
  background: rgba(37, 99, 235, 0.06);
}

/* 키보드 포커스 되었을 때 디자인 */
.seg-btn:focus-visible {
  box-shadow: inset 0 0 0 2px rgba(37, 99, 235, .35);
  border-radius: 1rem;
}
</style>
