// src/stores/checklist.js
import { defineStore } from 'pinia'
import {
  fetchChecklists,
  fetchChecklistById,
  createChecklist,
  editChecklist,
  deleteChecklist,
  createMyChecklistItem,
  deleteMyChecklistItem,
  editMyChecklistItem,
} from '@/api/checklist'

export const useChecklistStore = defineStore('checklist', {
  state: () => ({
    checklists: [],
    currentChecklist: null,
    loading: false,
    error: null,
  }),

  actions: {
    async loadChecklists() {
      this.loading = true
      try {
        this.checklists = await fetchChecklists()
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async loadChecklist(id) {
      this.loading = true
      try {
        this.currentChecklist = await fetchChecklistById(id)
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async addChecklist(data) {
      try {
        const newChecklist = await createChecklist(data)
        this.checklists.push(newChecklist)
      } catch (err) {
        this.error = err
      }
    },

    async updateChecklist(id, data) {
      try {
        const updated = await editChecklist(id, data)
        const index = this.checklists.findIndex(c => c.id === id)
        if (index !== -1) this.checklists[index] = updated
      } catch (err) {
        this.error = err
      }
    },

    async removeChecklist(id) {
      try {
        await deleteChecklist(id)
        this.checklists = this.checklists.filter(c => c.id !== id)
      } catch (err) {
        this.error = err
      }
    },

    async addItemToChecklist(id, itemData) {
      try {
        const updated = await createMyChecklistItem(id, itemData)
        this.currentChecklist = updated
      } catch (err) {
        this.error = err
      }
    },

    async removeItemFromChecklist(id, itemId) {
      try {
        const updated = await deleteMyChecklistItem(id, itemId)
        this.currentChecklist = updated
      } catch (err) {
        this.error = err
      }
    },

    async updateChecklistItem(id, itemId, itemData) {
      try {
        const updated = await editMyChecklistItem(id, itemId, itemData)
        this.currentChecklist = updated
      } catch (err) {
        this.error = err
      }
    },
  },
})
