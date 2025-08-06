import apiClient from './apiClient'

const checklistAPI = {
  // 체크리스트 전체 조회
  async fetchChecklists() {
    const { data } = await apiClient.get('/checklists')
    return data
  },

  // 체크리스트 상세 조회
  async fetchChecklistById(id) {
    const { data } = await apiClient.get(`/checklists/${id}`)
    return data
  },

  // 체크리스트 생성
  async createChecklist(payload) {
    const { data } = await apiClient.post('/checklists', payload)
    return data
  },

  // 체크리스트 수정
  async editChecklist(id, payload) {
    const { data } = await apiClient.put(`/checklists/${id}`, payload)
    return data
  },

  // 체크리스트 삭제
  async deleteChecklist(id) {
    const { data } = await apiClient.delete(`/checklists/${id}`)
    return data
  },

  // 나의 체크리스트 항목 추가
  async createMyChecklistItem(id, payload) {
    const { data } = await apiClient.post(`/checklists/${id}/items`, payload)
    return data
  },

  // 나의 체크리스트 항목 삭제
  async deleteMyChecklistItem(id, itemId) {
    const { data } = await apiClient.delete(`/checklists/${id}/items/${itemId}`)
    return data
  },

  // 나의 체크리스트 항목 수정
  async editMyChecklistItem(id, itemId, payload) {
    const { data } = await apiClient.put(
      `/checklists/${id}/items/${itemId}`,
      payload,
    )
    return data
  },

  // 특정 체크리스트 적용 매물 조회
  async propertiesChecklistItem(id) {
    const { data } = await apiClient.get(`/checklists/properties/${id}`)
    return data
  },

  async propretiesApplyChecklist(payload) {
    const { data } = await apiClient.post(`/cheklists/property/apply`, payload)
    return data
  },
}

export default checklistAPI
