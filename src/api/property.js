import apiClient from '@/api/apiClient'

export default {
  async getFavorite(params) {
    const { data } = await apiClient.get('/properties/favorite', { params })
    return data
  },

  async getProperties(params) {
    const { data } = await apiClient.get('/properties', { params })
    return data
  },
}
