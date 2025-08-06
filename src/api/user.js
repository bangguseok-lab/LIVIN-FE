import apiClient from './apiClient'

const userAPI = {
  // 1. 마이페이지 정보 조회
  async fetchMyPageInfo() {
    const { data } = await apiClient.get('/users')
    return data
  },

  // 2. 닉네임, 연락처 수정
  async updateMyPageInfo(payload) {
    const { data } = await apiClient.put('/users', payload)
    return data
  },

  // 3. 사용자 역할 전환
  async changeUserRole(newRole) {
    const { data } = await apiClient.put('/users/role', { role: newRole })
    return data
  },

  // 4. 로그아웃
  async logout() {
    const { data } = await apiClient.post('/users/logout')
    return data
  },

  // 5. 회원 탈퇴
  async withdraw() {
    const { data } = await apiClient.delete('/users/withdraw')
    return data
  },

  // 6. 프로필 이미지 업로드
  async uploadProfileImage(file) {
    const formData = new FormData()
    formData.append('image', file)

    const { data } = await apiClient.post('/users/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  // 7. 프로필 이미지 조회
  async fetchProfileImage() {
    const { data } = await apiClient.get('/users/profile-image')
    return data
  },

  // 8. 닉네임만 조회
  async fetchNickname() {
    const { data } = await apiClient.get('/users/nickname')
    return data
  },
}

export default userAPI
