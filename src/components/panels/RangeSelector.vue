<script setup>
import { ref, defineProps, watch } from 'vue'

// props로 title과 description을 받음 --> 사용 시 title, description 입력 가능
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  numberList: {
    type: Array,
    required: true,
    default: () => Array.from({ length: 15 }, (_, i) => i + 1), //사용시 numberList 입력하지 않으면 보이는 디폴트 값입니다
  },
})

// emit 정의
const emit = defineEmits(['updateRange'])

// 내부 상태
const min = ref(null)
const max = ref(null)

// 숫자 → 문자열 변환 (예) 1000 → "1,000만원")
function formatNumber(num, index) {
  const isLast = index === props.numberList.length - 1
  let formatted = ''

  if (num >= 10000) {
    formatted =
      num % 10000 === 0 ? `${num / 10000}억` : `${(num / 10000).toFixed(1)}억`
  } else if (num % 1000 === 0 && num >= 1000 && num < 10000) {
    formatted = `${num / 1000}천`
  } else {
    formatted = `${num.toLocaleString()}만원`
  }

  return isLast ? `${formatted}+` : formatted
}

// 클릭 이벤트 핸들러
function handleClick(num) {
  if (num === min.value || num === max.value) return

  if (min.value === null) {
    min.value = num
  } else if (max.value === null) {
    if (num < min.value) {
      max.value = min.value
      min.value = num
    } else {
      max.value = num
    }
  } else {
    min.value = num
    max.value = null
  }
}

// min 또는 max 값 변경 시 부모에게 전달
watch([min, max], () => {
  emit('updateRange', {
    min: min.value,
    max: max.value,
  })
  // 로그 추가
  console.log(
    `[RangeSelector] 선택된 범위: min = ${min.value}, max = ${max.value}`,
  )
})

function getButtonClass(num) {
  if (num === min.value || num === max.value) {
    return 'btn selected'
  }
  if (
    min.value !== null &&
    max.value !== null &&
    num > min.value &&
    num < max.value
  ) {
    return 'btn in-range'
  }
  return 'btn'
}
</script>

<template>
  <div class="range-selector">
    <div class="header-section">
      <p class="title">{{ props.title }}</p>
      <p class="description">{{ props.description }}</p>
    </div>

    <div class="grid">
      <button
        v-for="(num, idx) in props.numberList"
        :key="num"
        :class="getButtonClass(num)"
        @click="handleClick(num)"
      >
        {{ formatNumber(num, idx) }}
      </button>
    </div>

    <div class="result">
      <button :disabled="!min" class="display-btn">
        <!-- {{ min ? formatNumber(min) : 'min' }} -->
        {{
          min !== null
            ? formatNumber(min, props.numberList.indexOf(min))
            : '최소'
        }}
      </button>
      <span>~</span>
      <button :disabled="!max" class="display-btn">
        <!-- {{ max ? formatNumber(max) : 'max' }} -->
        {{
          max !== null
            ? formatNumber(max, props.numberList.indexOf(max))
            : '최대'
        }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.header-section {
  padding: 0rem 0 1rem 0;
}
.title {
  font-weight: bold;
  font-size: 0.8rem;
  text-align: left;
  margin-left: 1rem;
}

.description {
  color: var(--grey);
  font-size: 0.8rem;
  text-align: left;
  margin: -1rem 0 0 1rem;
}

.grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin: 0rem 0 1.5rem 0;
  border: 0.5px solid var(--grey);
}

.btn {
  height: 35px;
  background-color: var(--white);
  border: 0.5px solid var(--grey);
  border-radius: 0px;
  cursor: pointer;
  font-size: 0.7rem;
}

.btn.selected {
  background-color: var(--primary-color);
  color: var(--white);
  font-weight: bold;
}

.btn.in-range {
  background-color: var(--purple);
  font-weight: bold;
  color: var(--black);
}

.result {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 0.7rem;
}

.display-btn {
  border: 1px solid var(--grey);
  background-color: var(--white);
  width: 25%;
  padding: 0.5rem 0.5rem;
  border-radius: 6px;
  color: var(--grey);
  cursor: default;
}

.display-btn:enabled {
  color: black;
  font-weight: bold;
  font-size: 0.8rem;
}
</style>
