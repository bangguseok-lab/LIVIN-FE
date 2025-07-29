<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

function toggleSecure(event) {
  emit('update:modelValue', event.target.checked)
}
</script>

<template>
  <div class="secure-option" :class="{ active: modelValue }">
    <span class="secure-label">안심 매물만 보기</span>
    <input
      type="checkbox"
      class="secure-checkbox"
      :checked="modelValue"
      @click.stop="toggleSecure"
    />
  </div>
</template>

<style scoped lang="scss">
.secure-option {
  height: rem(56px);
  padding: rem(12px) rem(30px);
  border-bottom: rem(1px) solid var(--whitish);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: rem(6px);
  font-size: 14px;
  color: var(--grey);

  .secure-label {
    cursor: default;
  }

  .secure-checkbox {
    width: rem(16px);
    height: rem(16px);
    border-radius: rem(4px);
    border: rem(1px) solid var(--grey);
    accent-color: var(--primary-color);
    cursor: pointer;
  }

  &.active {
    color: var(--primary-color);
  }
}
</style>
