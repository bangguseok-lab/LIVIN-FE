import apiClient from '@/api/apiClient'
import axios from 'axios'

export default {
  async getFavorite(params) {
    const { data } = await apiClient.get('/properties/favorite', { params })
    return data
  },

  async getProperties(params) {
    const { data } = await apiClient.post('/properties', params)
    return data
  },

  async getPropertyDetails(propertyId) {
    const { data } = await apiClient.get(`/properties/details/${propertyId}`)
    console.log(data)
    return data
  },
  async addFavoriteProperty(propertyId) {
    try {
      await apiClient.post(`/properties/${propertyId}/favorite`)
    } catch (error) {
      console.error(error)
      alert('관심매물 등록에 실패했습니다.')
    }
  },

  async removeFavoriteProperty(propertyId) {
    try {
      await apiClient.delete(`/properties/${propertyId}/favorite`)
    } catch (error) {
      console.error(error)
      alert('관심매물 등록해제에 실패했습니다.')
    }
  },
}
