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
  async uploadProfileImage(imgNumber) {
    // const formData = new FormData()
    // formData.append('image', file)

    const { data } = await apiClient.put('/users/profile-image', {
      profileImage: imgNumber,
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
    return data.nickname
  },

  // 9. 보증금 조회
  async fetchDeposit() {
    const { data } = await apiClient.get('/users/deposit')
    // 기대 응답 예: { deposit: number|null, updatedAt?: string }
    return data.data
  },

  // 11. 보증금 저장/수정 - PUT
  async updateDeposit(payload) {
    // payload 예: { deposit: number }
    const { data } = await apiClient.put('/users/deposit', payload)
    return data.data
  },

  // 12. 보증금 삭제 - DELETE
  async deleteDeposit() {
    const { data } = await apiClient.delete('/users/deposit')
    return data.data
  },
}

export default userAPI
