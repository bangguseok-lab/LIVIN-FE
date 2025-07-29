<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { defineProps, defineEmits, ref, nextTick, watch } from 'vue';


const props = defineProps({
  placeholder: {
    type: String,
    default: '입력해주세요'
  },
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  name: {
    type: String,
  }
})

const emit = defineEmits(['update:modelValue', 'input', 'error'])
const inputRef = ref(null)

// 전화번호 입력 시 자동 하이픈(-) 처리
const formatPhoneNumber = (value) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length < 4) return numbers
  if (numbers.length < 8) return numbers.slice(0, 3) + '-' + numbers.slice(3)
  return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11)
}

const onInput = (e) => {
  let value = e.target.value

  // 전화번호일 경우 자동 포맷 적용
  if (props.type === 'tel') {
    value = formatPhoneNumber(value)
    if (value.length > 13) {
      value = value.slice(0, 13) // 13자 초과 시 자르기
    }
    if (value.length < 13) {
      emit('error', '전화번호는 하이픈 포함 13글자를 넘을 수 없습니다.')
    } else {
      emit('error', '') // 에러 없음
    }
  }

  emit('update:modelValue', value);
  emit('input', { value: value })
}

// 커서를 맨 뒤로 이동
watch(() => props.modelValue, async () => {
  await nextTick()
  const el = inputRef.value
  if (el && (props.type === 'text' || props.type === 'tel')) {
    el.setSelectionRange(el.value.length, el.value.length)
  }
})
</script>

<template>
  <input :type="type" :placeholder="placeholder" :value="modelValue" @input="onInput" class="custom-input"
    ref="inputRef" required>
</template>

<style scoped lang="scss">
.custom-input {
  outline: none;
  border: rem(2px) solid #e1e1e1;
  width: 100%;
  height: rem(50px);
  padding: 1rem;
  border-radius: rem(15px);
  caret-color: var(--primary-color); // 커서 색상 변경
}

.custom-input:focus {
  border-color: var(--primary-color);
}
</style>
