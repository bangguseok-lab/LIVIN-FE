import apiClient from './apiClient'

const riskAPI = {
  // 1. 매물 위험도 조회 - 안전 뱃지 모달창
  async getRiskAnalysis(propertyId) {
    const { data } = await apiClient.get(`/risk/risk-analysis/${propertyId}`)
    return data
  },
}

export default riskAPI
