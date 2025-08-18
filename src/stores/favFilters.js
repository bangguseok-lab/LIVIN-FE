// src/stores/favFilters.js
import { defineStore } from 'pinia'

export const useFavFiltersStore = defineStore('favFilters', {
  state: () => ({
    /** 선택된 체크리스트 라벨 배열 (ex: ['체크리스트A','체크리스트B']) */
    selectedLabels: [],
  }),

  getters: {
    isSelected: state => label => state.selectedLabels.includes(label),
    selectedCount: state => state.selectedLabels.length,
  },

  actions: {
    /** 전체 배열을 교체 (반드시 새 배열을 넘겨주세요) */
    setSelected(arr) {
      this.selectedLabels = Array.isArray(arr) ? [...arr] : []
    },

    /** 라벨 토글 (항상 새 배열을 만들어 반응성 보장) */
    toggle(label) {
      const set = new Set(this.selectedLabels)
      set.has(label) ? set.delete(label) : set.add(label)
      this.selectedLabels = [...set]
    },

    /** 전부 해제 */
    clear() {
      this.selectedLabels = []
    },
  },
})
