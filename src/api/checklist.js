import apiClient from './apiClient'

// 체크리스트 전체 조회
export const fetchChecklists = async id => {
  const response = await apiClient.get(`/checklists`)
  return response.data
}

// 체크리스트 상세 조회
export const fetchChecklistById = async id => {
  const response = await apiClient.get(`/checklists/${id}`)
  return response.data
}

// 체크리스트 생성
export const createChecklist = async data => {
  const response = await apiClient.post('/checklists', data)
  return response.data
}

// 체크리스트 수정
export const editChecklist = async (id, data) => {
  const response = await apiClient.put(`/checklists/${id}`, data)
  return response.data
}

// 체크리스트 삭제
export const deleteChecklist = async id => {
  const response = await apiClient.delete(`/checklists/${id}`)
  return response.data
}

// 나의 체크리스트 항목 추가
export const createMyChecklistItem = async (id, data) => {
  const response = await apiClient.post(`/checklists/${id}/items`, data)
  return response.data
}

// 나의 체크리스트 항목 삭제
export const deleteMyChecklistItem = async (id, itemId) => {
  const response = await apiClient.delete(`/checklists/${id}/items/${itemId}`)
  return response.data
}

// 나의 체크리스트 항목 수정
export const editMyChecklistItem = async (id, itemId, data) => {
  const response = await apiClient.put(
    `/checklists/${id}/items/${itemId}`,
    data,
  )
  return response.data
}

// 특정 체크리스트 적용 매물 조회
export const propertiesChecklistItem = async id => {
  const response = await apiClient.get(`/checklists/properties/${id}`)
  return response.data
}
