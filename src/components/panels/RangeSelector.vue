<script setup>
import { ref, defineProps, watch } from 'vue'

// props 정의
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
    default: () => Array.from({ length: 15 }, (_, i) => i + 1),
  },
  initialMin: Number,
  initialMax: Number,
})

// emit 정의
const emit = defineEmits(['updateRange'])

// 내부 상태
const min = ref(props.initialMin ?? null)
const max = ref(props.initialMax ?? null)

// 숫자 포맷 함수
function formatNumber(num, index) {
  const isLast = index === props.numberList.length - 1
  if (num >= 10000) {
    return num % 10000 === 0
      ? `${num / 10000}억`
      : `${(num / 10000).toFixed(1)}억`
  } else if (num >= 1000 && num % 1000 === 0) {
    return `${num / 1000}천`
  } else {
    return `${num.toLocaleString()}만원`
  }
}

function formatDisplay(num) {
  const title = props.title

  if (num === '-') {
    if (title === '월세') return '10만원 이하'
    if (title === '월세 보증금') return '500만원 이하'
    return '5천 이하'
  }

  if (num === '+') {
    return '10억 이상' // 모두 공통
  }
  return formatNumber(num)
}

// 버튼 클릭 핸들러
function handleClick(num) {
  // '최소' 클릭: min = 0
  if (num === '-') {
    min.value = 0
    return
  }

  // '최대' 클릭: max = 아주 큰 값 (9999999 등)
  if (num === '+') {
    max.value = 9999999
    return
  }

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

// min/max 변경 시 부모에 emit
watch([min, max], () => {
  emit('updateRange', { min: min.value, max: max.value })
  console.log(
    `[RangeSelector] 부모로 emit된 범위: min = ${min.value}, max = ${max.value}`,
  )
})

// props 변경 시 내부 상태 반영
watch(
  () => [props.initialMin, props.initialMax],
  ([newMin, newMax]) => {
    min.value = newMin
    max.value = newMax
    // console.log('[RangeSelector] initial 값으로 갱신됨:', newMin, newMax)
  },
  { immediate: true },
)

// 버튼 스타일 반환
function getButtonClass(num) {
  // '최소' 선택 여부
  if (num === '-' && min.value === 0) return 'btn selected'
  // '최대' 선택 여부
  if (num === '+' && max.value === 9999999) return 'btn selected'

  if (num === min.value || num === max.value) return 'btn selected'
  if (
    min.value !== null &&
    max.value !== null &&
    num > min.value &&
    num < max.value
  )
    return 'btn in-range'
  return 'btn'
}
</script>

<template>
  <div class="range-selector">
    <!-- 제목 및 설명 영역 -->
    <div class="header-section">
      <p class="title">{{ title }}</p>
      <p class="description">{{ description }}</p>
    </div>

    <!-- 숫자 버튼 그리드 영역 -->
    <div class="grid">
      <button
        v-for="(num, idx) in numberList"
        :key="num"
        :class="getButtonClass(num)"
        @click="handleClick(num)"
      >
        {{ formatDisplay(num) }}
      </button>
    </div>

    <!-- 선택된 최소/최대 값 표시 영역 -->
    <div class="result">
      <button :disabled="!min && min !== 0" class="display-btn">
        {{
          min === 0 || min === '-'
            ? formatDisplay('-')
            : min !== null
              ? formatNumber(min, numberList.indexOf(min))
              : '최소'
        }}
      </button>
      <span>~</span>
      <button :disabled="!max && max !== 9999999" class="display-btn">
        {{
          max === 9999999 || max === '+'
            ? formatDisplay('+')
            : max !== null
              ? formatNumber(max, numberList.indexOf(max))
              : '최대'
        }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
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

  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
  min-width: 65px; // 또는 80px 정도로 넉넉하게
  white-space: nowrap;
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
