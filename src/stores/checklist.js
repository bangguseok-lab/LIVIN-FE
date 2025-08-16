// src/stores/checklist.js
import { defineStore } from 'pinia'
import checklistAPI from '@/api/checklist'

export const useChecklistStore = defineStore('checklist', {
  state: () => ({
    checklists: [],
    checklistFilters: [], // 관심매물 페이지
    currentChecklist: null,
    currentChecklistItems: [],
    selectedChecklistId: null,
    loading: false,
    error: null,
  }),

  actions: {
    //  관심매물용 체크리스트 필터 조회 (/api/checklist-filters)
    async loadChecklistFilters() {
      this.loading = true
      this.error = null
      try {
        const list = await checklistAPI.fetchPropertiesFavChecklist()
        this.checklistFilters = Array.isArray(list) ? list : []
      } catch (err) {
        this.error = err
        this.checklistFilters = []
      } finally {
        this.loading = false
      }
    },

    // 전체 체크리스트 조회
    async loadChecklists() {
      this.loading = true
      try {
        this.checklists = await checklistAPI.fetchChecklists()
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // 선택 변경
    setSelected(id) {
      this.selectedChecklistId = id
    },

    // 특정 체크리스트 조회
    async loadChecklist(id) {
      this.loading = true
      try {
        const checklistDetail = await checklistAPI.fetchChecklistById(id)
        this.currentChecklist = {
          id: checklistDetail.checklistId,
          title: checklistDetail.title,
          description: checklistDetail.description,
          type: checklistDetail.type,
          createdAt: checklistDetail.createdAt,
          updatedAt: checklistDetail.updatedAt,
        }
        this.currentChecklistItems = checklistDetail.items
          ? Object.values(checklistDetail.items).flat()
          : []
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // 체크리스트 생성
    async addChecklist(payload) {
      try {
        const newChecklist = await checklistAPI.createChecklist(payload)
        this.checklists.push(newChecklist)
        return newChecklist
      } catch (err) {
        this.error = err
      }
    },

    // 체크리스트 수정
    async updateChecklist(id, payload) {
      try {
        const updated = await checklistAPI.editChecklist(id, payload)
        const index = this.checklists.findIndex(c => c.id === id)
        if (index !== -1) this.checklists[index] = updated
        this.currentChecklist = updated
      } catch (err) {
        this.error = err
      }
    },

    // 체크리스트 삭제
    async removeChecklist(id) {
      try {
        await checklistAPI.deleteChecklist(id)
        this.checklists = this.checklists.filter(c => c.id !== id)
      } catch (err) {
        this.error = err
      }
    },

    // 체크리스트 항목 추가
    async addItemToChecklist(id, payload) {
      try {
        const updated = await checklistAPI.createMyChecklistItem(id, payload)
        this.currentChecklist = updated
      } catch (err) {
        this.error = err
      }
    },

    // 체크리스트 항목 삭제
    async removeItemFromChecklist(id, itemId) {
      try {
        const updated = await checklistAPI.deleteMyChecklistItem(id, itemId)
        this.currentChecklist = updated
      } catch (err) {
        this.error = err
      }
    },

    // 체크리스트 항목 수정
    async updateChecklistItem(checklistId, payload) {
      try {
        const updated = await checklistAPI.editMyChecklistItem(
          checklistId,
          payload,
        )
        this.currentChecklist = updated
      } catch (err) {
        this.error = err
      }
    },
  },
})
