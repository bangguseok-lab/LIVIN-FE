import apiClient from '@/api/apiClient'
import axios from 'axios'

export default {
  async getFavorite(params) {
    const { data } = await apiClient.get('/properties/favorite', { params })
    console.log(data)
    return data
  },

  async getProperties(params) {
    const { data } = await apiClient.post('/properties', params)
    return data
  },
}
