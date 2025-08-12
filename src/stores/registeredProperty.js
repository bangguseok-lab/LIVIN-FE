import { defineStore } from 'pinia'
import registeredPropertyAPI from '@/api/registeredProperty'

export const useRegisteredPropertyStore = defineStore('registeredProperty', {
  state: () => ({
    myProperties: [],
    propertyCount: 0,
    loading: false,
    error: null,
  }),

  getters: {
    getProperties: state => state.myProperties,
    getPropertyCount: state => state.propertyCount,
  },

  actions: {
    async fetchMyProperties() {
      this.loading = true
      this.error = null
      try {
        const data = await registeredPropertyAPI.fetchMyProperties()
        this.myProperties = data
        this.propertyCount = data.length
      } catch (err) {
        this.error = err
        console.error('내 매물 정보를 가져오는 중 오류 발생:', err)
      } finally {
        this.loading = false
      }
    },

    async deleteProperty(propertyId) {
      this.loading = true
      this.error = null
      try {
        await registeredPropertyAPI.deleteProperty(propertyId)
        await this.fetchMyProperties()
      } catch (err) {
        this.error = err
        console.error('매물 삭제 중 오류 발생:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchPropertyCount() {
      this.loading = true
      this.error = null
      try {
        const data = await registeredPropertyAPI.countMyProperties()
        this.propertyCount = data
      } catch (err) {
        this.error = err
        console.error('매물 개수를 가져오는 중 오류 발생:', err)
      } finally {
        this.loading = false
      }
    },
  },
})
