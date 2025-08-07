import { defineStore } from 'pinia'
import userAPI from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    providerId: '', // 로그인 시 서버에서 받은 providerId 저장
    userInfo: null, // 사용자 상세 정보 (닉네임, 연락처, 프로필 이미지 등)
    loading: false,
    error: null,
  }),

  getters: {
    getNickname: state => state.userInfo?.nickname || '',
  },

  actions: {
    // providerId 저장 (로그인 시 1회만 사용)
    setProviderId(id) {
      this.providerId = id
    },

    // 사용자 정보 조회
    async fetchUserInfo() {
      this.loading = true
      this.error = null
      try {
        const data = await userAPI.fetchMyPageInfo()
        this.userInfo = data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // 사용자 정보 수정 (닉네임, 연락처 등)
    async updateUserInfo(payload) {
      this.loading = true
      this.error = null
      try {
        await userAPI.updateMyPageInfo(payload)
        await this.fetchUserInfo() // 수정 후 정보 갱신
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // 역할 변경 (임대인 ↔ 임차인)
    async changeRole(newRole) {
      this.loading = true
      this.error = null
      try {
        await userAPI.changeUserRole(newRole)
        await this.fetchUserInfo()
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // 로그아웃
    async logout() {
      this.loading = true
      this.error = null
      try {
        await userAPI.logout()
        this.clearUser()
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // 회원 탈퇴
    async withdraw() {
      this.loading = true
      this.error = null
      try {
        await userAPI.withdraw()
        this.clearUser()
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // 프로필 이미지 업로드, 변경하려는 이미지 숫자를 받아옴
    async uploadProfileImage(imgNumber) {
      this.loading = true
      this.error = null
      try {
        await userAPI.uploadProfileImage(imgNumber)

        if (this.userInfo) {
          this.userInfo.data.profileImage = imgNumber
        }
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // 프로필 이미지 조회
    async fetchProfileImage() {
      this.loading = true
      this.error = null
      try {
        const imageUrl = await userAPI.fetchProfileImage()
        if (this.userInfo) {
          this.userInfo.profileImageUrl = imageUrl
        } else {
          this.userInfo = { profileImageUrl: imageUrl }
        }
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // 닉네임만 조회
    async fetchNickname() {
      try {
        const nickname = await userAPI.fetchNickname()
        if (this.userInfo) {
          this.userInfo.nickname = nickname
        } else {
          this.userInfo = { nickname }
        }
      } catch (err) {
        console.error('닉네임 조회 실패:', err)
      }
    },

    // 유저 상태 초기화
    clearUser() {
      this.providerId = ''
      this.userInfo = null
      this.error = null
      this.loading = false
    },
  },
})
