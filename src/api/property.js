import apiClient from '@/api/apiClient'

export default {
  async getFavorite(params) {
    const { data } = await apiClient.get('/favoriteProperties', { params })
    console.log(data)
    return data
  },

  async getProperties(params) {
    const { data } = await apiClient.get('/properties', { params })
    return data
  },
}
