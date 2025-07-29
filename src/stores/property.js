import { defineStore } from 'pinia'
import api from '@/api/property'

export const usePropertyStore = defineStore('property', {
  state: () => ({
    favoriteProperties: [],
    properties: [],
    address: {
      sido: '서울특별시',
      sigungu: '강남구',
      eupmyendong: '대치동',
    },
  }),
  actions: {
    async fetchFavoriteProperties(params) {
      try {
        const data = await api.getFavorite(params)
        console.log(data)
        this.favoriteProperties = data
      } catch (error) {
        console.error('찜한 매물 데이터를 불러오는 데 실패했습니다:', error)
      }
    },
    async fetchProperties(params) {
      try {
        const data = await api.getProperties(params)
        this.properties = data
      } catch (error) {
        console.error('매물 데이터를 불러오는 데 실패했습니다:', error)
      }
    },
  },
  getters: {
    getFavorite: state => state.favoriteProperties,
    getPropertiesList: state => state.properties,
    getAddress: state => state.address,
  },
})
