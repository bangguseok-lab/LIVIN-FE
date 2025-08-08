<script setup>
import { computed } from 'vue'
import { defineProps } from 'vue'
import { usePriceStore } from '@/stores/priceStore'

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
  type: {
    type: String, // 'jeonseDeposit' | 'monthlyDeposit' | 'monthlyRent'
    required: true,
  },
})

// store 연결
const priceStore = usePriceStore()

// 현재 선택된 범위
const selectedRange = computed(() => {
  const selected =
    props.type === 'jeonseDeposit'
      ? priceStore.states.jeonseDeposit
      : props.type === 'monthlyDeposit'
        ? priceStore.states.monthlyDeposit
        : props.type === 'monthlyRent'
          ? priceStore.states.monthlyRent
          : undefined

  if (selected === undefined) {
    console.warn(`[RangeSelector] 잘못된 type 전달됨: "${props.type}"`)
  }
  return selected ?? { min: null, max: null }
})

// 숫자 포맷 함수
function formatNumber(num, index) {
  // const isLast = index === props.numberList.length - 1
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
    if (title === '월세') return '10만원 -'
    if (title === '월세 보증금') return '500만원 -'
    return '5천 -'
  }

  if (num === '+') {
    return '10억 +' // 모두 공통
  }
  return formatNumber(num)
}

// 버튼 클릭 핸들러
function handleClick(num) {
  if (num === '-') num = 0
  if (num === '+') num = 9999999

  if (props.type === 'jeonseDeposit') {
    priceStore.selectJeonseDeposit(num)
  } else if (props.type === 'monthlyDeposit') {
    priceStore.selectMonthlyDeposit(num)
  } else if (props.type === 'monthlyRent') {
    priceStore.selectMonthlyRent(num)
  }
}

// 버튼 스타일 클래스
function getButtonClass(num) {
  const { min, max } = selectedRange.value || { min: null, max: null }

  if (num === '-' && min === 0) return 'btn selected'
  if (num === '+' && max === 9999999) return 'btn selected'
  if (num === min || num === max) return 'btn selected'
  if (min !== null && max !== null && num > min && num < max)
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
      <button class="display-btn" :disabled="selectedRange.min == null">
        {{
          selectedRange.min === 0
            ? formatDisplay('-')
            : selectedRange.min !== null
              ? formatNumber(selectedRange.min)
              : '최소'
        }}
      </button>
      <span>~</span>
      <button class="display-btn" :disabled="selectedRange.max == null">
        {{
          selectedRange.max === 9999999
            ? formatDisplay('+')
            : selectedRange.max !== null
              ? formatNumber(selectedRange.max)
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
  font-size: 0.95rem;
  text-align: center;
  // margin-left: 1rem;
}

.description {
  color: var(--grey);
  font-size: 0.85rem;
  text-align: center;
  margin: -1rem 0 0 0;
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
  width: 28%;
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
