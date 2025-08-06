import apiClient from './apiClient'

const checklistAPI = {
  // 체크리스트 전체 조회
  async fetchChecklists() {
    const { data } = await apiClient.get('/checklists')
    console.log(data.data.checklists)
    return data.data.checklists
  },

  // 체크리스트 상세 조회
  async fetchChecklistById(id) {
    const { data } = await apiClient.get(`/checklists/${id}`)
    console.log(data)
    return data.data
  },

  // 체크리스트 생성
  async createChecklist(payload) {
    const { data } = await apiClient.post('/checklists', payload)
    console.log(data)
    return data.data
  },

  // 체크리스트 수정
  async editChecklist(checklistId, payload) {
    const { data } = await apiClient.put(`/checklists/${checklistId}`, payload)
    return data.data
  },

  // 체크리스트 삭제
  async deleteChecklist(id) {
    const { data } = await apiClient.delete(`/checklists/${id}`)
    return data.data
  },

  async createMyChecklistItem(checklistId, items) {
    const { data } = await apiClient.post(
      `/checklists/${checklistId}/custom/item`,
      items,
    )
    console.log(data)
    return data.data
  },

  // 나의 체크리스트 항목 수정(db)
  async editMyChecklistItem(checklistId, items) {
    console.log('✅ 보내는 payload:', items)
    const { data } = await apiClient.put(`/checklists/${checklistId}/items`, {
      items,
    })
    return data.data
  },

  // 특정 체크리스트 적용 매물 조회
  async propertiesChecklistItem(id) {
    const { data } = await apiClient.get(`/checklists/properties/${id}`)
    return data.data
  },

  async deleteMyChecklistItem(checklistId, checklistItemId) {
    const { data } = await apiClient.delete(
      `/checklists/${checklistId}/custom/items/${checklistItemId}`,
    )
    return data.data
  },
}

export default checklistAPI
