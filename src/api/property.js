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
    const { data } = await apiClient.get(`/properties/${propertyId}`)
    console.log(data)
    return data
  },
}
