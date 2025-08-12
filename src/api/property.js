import apiClient from '@/api/apiClient'

export default {

  async getFavProperties(params) {
    const { data } = await apiClient.get('/favorite-properties', { params })
    return data
  },

  async getProperties(params) {
    const { data } = await apiClient.get('/properties', { params })
    return data
  },

  async countProperties(params) {
    const { data } = await apiClient.get('/properties/count', { params })
    return Number(data ?? 0)
  },

  async getPropertyDetails(propertyId) {
    const { data } = await apiClient.get(`/properties/details/${propertyId}`)
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
