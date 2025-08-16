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

  async propretiesApplyChecklist(payload) {
    const { data } = await apiClient.post(`/cheklists/property/apply`, payload)
    return data
  },

  async ChecklistProperties(checklistId) {
    const { data } = await apiClient.get(`/checklists/{checklistId}/properties`)
    return data
  },

  async fetchPropertiesFavChecklist() {
    const { data } = await apiClient.get('/checklist-filters')
    return data
  },

  // 매물 상세 페이지 체크리스트 목록 조회
  async getChecklistTitles() {
    try {
      console.log('getChecklistTitles API 호출 시작')
      const response = await apiClient.get('/properties/checklist')
      console.log('getChecklistTitles 전체 응답:', response)
      console.log('getChecklistTitles response.data:', response.data)
      console.log('getChecklistTitles response.data.data:', response.data?.data)

      // 응답 구조에 따라 적절한 데이터 반환
      if (response.data?.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      } else {
        return response
      }
    } catch (error) {
      console.error('getChecklistTitles API 에러:', error)
      throw error
    }
  },

  // 체크리스트 아이템 조회
  async getChecklistItems(checklistId) {
    try {
      console.log('getChecklistItems API 호출 시작, checklistId:', checklistId)
      console.log('요청 URL:', `/properties/checklist/${checklistId}/items`)

      const response = await apiClient.get(
        `/properties/checklist/${checklistId}/items`,
      )
      console.log('getChecklistItems 전체 응답:', response)
      console.log('getChecklistItems response.data:', response.data)
      console.log('getChecklistItems response.data.data:', response.data?.data)

      // 응답 구조에 따라 적절한 데이터 반환
      if (response.data?.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      } else {
        return response
      }
    } catch (error) {
      console.error('getChecklistItems API 에러:', error)
      console.error('에러 상세 정보:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      })

      // 500 에러인 경우 더 자세한 정보 제공
      if (error.response?.status === 500) {
        console.error('서버 내부 오류 (500) - 백엔드 로그 확인 필요')
        console.error('요청한 checklistId:', checklistId)
        console.error('에러 응답 데이터:', error.response.data)
      }

      throw error
    }
  },

  // 체크리스트 아이템 상태 업데이트
  async updateChecklistItems(checklistId, payload) {
    try {
      console.log(
        'updateChecklistItems API 호출 시작, checklistId:',
        checklistId,
      )
      console.log('요청 payload:', payload)
      console.log('요청 URL:', `/properties/checklist/${checklistId}/items`)

      const response = await apiClient.put(
        `/properties/checklist/${checklistId}/items`,
        payload,
      )
      console.log('updateChecklistItems 전체 응답:', response)
      console.log('updateChecklistItems response.data:', response.data)

      // 응답 구조에 따라 적절한 데이터 반환
      if (response.data?.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      } else {
        return response
      }
    } catch (error) {
      console.error('updateChecklistItems API 에러:', error)
      console.error('에러 상세 정보:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      })

      // 500 에러인 경우 더 자세한 정보 제공
      if (error.response?.status === 500) {
        console.error('서버 내부 오류 (500) - 백엔드 로그 확인 필요')
        console.error('요청한 checklistId:', checklistId)
        console.error('에러 응답 데이터:', error.response.data)
      }

      throw error
    }
  },
}

export default checklistAPI
