// src/stores/checklist.js
import { defineStore } from 'pinia'
import checklistAPI from '@/api/checklist'

export const useChecklistStore = defineStore('checklist', {
  state: () => ({
    checklists: [],
    currentChecklist: null,
    currentChecklistItems: [],
    loading: false,
    error: null,
  }),

  actions: {
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

    // 특정 체크리스트 조회
    async loadChecklist(id) {
      this.loading = true
      try {
        this.currentChecklist = await checklistAPI.fetchChecklistById(id)
        this.currentChecklistItems = await checklistAPI.fetchChecklistItems(id)
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
        await checklistAPI.createMyChecklistItem(id, payload)
        this.currentChecklistItems = await checklistAPI.fetchChecklistItems(id)
      } catch (err) {
        this.error = err
      }
    },

    // 체크리스트 항목 삭제
    async removeItemFromChecklist(id, itemId) {
      try {
        await checklistAPI.deleteMyChecklistItem(id, itemId)
        this.currentChecklistItems = await checklistAPI.fetchChecklistItems(id)
      } catch (err) {
        this.error = err
      }
    },

    // 체크리스트 항목 수정
    async updateChecklistItem(id, itemId, payload) {
      try {
        await checklistAPI.editMyChecklistItem(id, itemId, payload)
        this.currentChecklistItems = await checklistAPI.fetchChecklistItems(id)
      } catch (err) {
        this.error = err
      }
    },
  },
})
