import apiClient from './apiClient'

const registeredPropertyAPI = {
  // 1. 사용자 등록 매물 리스트 조회
  async fetchMyProperties() {
    const { data } = await apiClient.get('/properties/landlord')
    return data
  },

  // 2. 사용자 등록 매물 총 개수 조회
  async countMyProperties() {
    const { data } = await apiClient.get('/properties/landlord/count')
    return data
  },

  // 3. 사용자 등록 매물 삭제
  async deleteProperty(propertyId) {
    const { data } = await apiClient.delete(`/properties/${propertyId}`)
    return data
  },
}

export default registeredPropertyAPI
