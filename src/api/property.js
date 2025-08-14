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

  // 매물 등록 시 옵션 정보 조회
  async getOptions() {
    try {
      const { data } = await apiClient.get('/properties/options')
      return data
    } catch (error) {
      console.error('옵션 조회 과정에서 에러가 발생했습니다.', error)
    }
  },
}
