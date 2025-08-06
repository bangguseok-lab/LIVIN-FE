// stores/priceStore.js
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const usePriceStore = defineStore('price', () => {
  const states = reactive({
    jeonseDeposit: { min: null, max: null },
    monthlyDeposit: { min: null, max: null },
    monthlyRent: { min: null, max: null },
  })

  function handleRangeClick(range, value) {
    if (range.min === null && range.max === null) {
      range.min = value
    } else if (range.min !== null && range.max === null) {
      if (value > range.min) {
        range.max = value
      } else if (value < range.min) {
        range.max = range.min
        range.min = value
      } else {
        range.min = null
        range.max = null
      }
    } else {
      range.min = value
      range.max = null
    }
  }

  // 단일 상태로 클릭 처리
  const selectJeonseDeposit = value =>
    handleRangeClick(states.jeonseDeposit, value)
  const selectMonthlyDeposit = value =>
    handleRangeClick(states.monthlyDeposit, value)
  const selectMonthlyRent = value => handleRangeClick(states.monthlyRent, value)

  // 전체 초기화
  const resetAll = () => {
    states.jeonseDeposit = { min: null, max: null }
    states.monthlyDeposit = { min: null, max: null }
    states.monthlyRent = { min: null, max: null }
  }

  return {
    states,
    selectJeonseDeposit,
    selectMonthlyDeposit,
    selectMonthlyRent,
    resetAll,
  }
})
