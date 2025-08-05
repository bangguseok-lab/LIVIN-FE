import apiClient from './apiClient'

const userAPI = {
  // 1. 마이페이지 정보 조회
  async fetchMyPageInfo() {
    // '/api/users' -> '/users'로 수정
    const { data } = await apiClient.get('/users')
    return data
  },

  // 2. 닉네임, 연락처 수정
  async updateMyPageInfo(payload) {
    // '/api/users' -> '/users'로 수정
    const { data } = await apiClient.put('/users', payload)
    return data
  },

  // 3. 사용자 역할 전환
  async changeUserRole(newRole) {
    // '/api/users/role' -> '/users/role'로 수정
    const { data } = await apiClient.post('/users/role', { newRole })
    return data
  },

  // 4. 로그아웃
  async logout() {
    // '/api/users/logout' -> '/users/logout'로 수정
    const { data } = await apiClient.post('/users/logout')
    return data
  },

  // 5. 회원 탈퇴
  async withdraw() {
    // '/api/users/withdraw' -> '/users/withdraw'로 수정
    const { data } = await apiClient.delete('/users/withdraw')
    return data
  },

  // 6. 프로필 이미지 업로드
  async uploadProfileImage(file) {
    const formData = new FormData()
    formData.append('image', file)

    // '/api/users/profile-image' -> '/users/profile-image'로 수정
    const { data } = await apiClient.post('/users/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  // 7. 프로필 이미지 조회
  async fetchProfileImage() {
    // '/api/users/profile-image' -> '/users/profile-image'로 수정
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
