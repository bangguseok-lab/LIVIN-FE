import { defineStore } from 'pinia'
import userAPI from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    providerId: '', // 로그인 시 서버에서 받은 providerId 저장
    userInfo: null, // 사용자 상세 정보 (닉네임, 연락처, 프로필 이미지 등)
    loading: false,
    error: null,

    depositAmount: null, // 원 단위 number|null
    depositLoading: false,
    depositError: null,
  }),

  getters: {
    getNickname: state => state.userInfo?.nickname || '',
    getUserRole: state => state.userInfo?.data.role,
    // 보증금 포맷팅
    formattedDeposit: state => {
      const n = state.depositAmount // 원
      if (!Number.isFinite(n) || n <= 0) return '설정하지 않음'

      const man = Math.trunc(n / 10000) // 만원 단위
      const eok = Math.trunc(man / 10000) // 억(= 1만만원)
      const restMan = man % 10000 // 남은 만원

      const fmt = new Intl.NumberFormat('ko-KR')

      if (eok > 0) {
        // 2억 5,300만원 / 3억 (꼬리 0이면 억만 표기)
        return restMan > 0
          ? `${fmt.format(eok)}억 ${fmt.format(restMan)}만원`
          : `${fmt.format(eok)}억`
      }
      // 5,000만원
      return `${fmt.format(man)}만원`
    },
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
        console.log(data)
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

    // ✅ 보증금 조회 (서버 우선 → 로컬 폴백)
    async fetchDeposit({ useCache = true } = {}) {
      if (useCache && this.depositAmount != null) return this.depositAmount
      this.depositLoading = true
      this.depositError = null
      try {
        const { deposit } = await userAPI.fetchDeposit() // { deposit: number|null }
        this.depositAmount = typeof deposit === 'number' ? deposit : null
        if (this.depositAmount != null) {
          localStorage.setItem('deposit.amount', String(this.depositAmount))
        } else {
          localStorage.removeItem('deposit.amount')
        }
        return this.depositAmount
      } catch (err) {
        this.depositError = err
        const raw = localStorage.getItem('deposit.amount')
        const parsed = raw != null ? Number(raw) : null
        this.depositAmount = Number.isFinite(parsed) ? parsed : null
        return this.depositAmount
      } finally {
        this.depositLoading = false
      }
    },

    async updateDeposit(amount) {
      this.depositLoading = true
      this.depositError = null

      const val = Number(amount)
      if (!Number.isFinite(val) || val <= 0)
        throw new Error('유효하지 않은 보증금')
      try {
        const { deposit } = await userAPI.updateDeposit({ deposit: val })
        this.depositAmount = Number.isFinite(deposit) ? deposit : val
        localStorage.setItem('deposit.amount', String(this.depositAmount))
        return this.depositAmount
      } catch (err) {
        this.depositError = err
        throw err
      } finally {
        this.depositLoading = false
      }
    },

    // ✅ 존재 여부에 따라 자동 분기
    async saveDeposit(amount) {
      return this.updateDeposit(amount)
    },

    // ✅ 삭제(DELETE)
    async deleteDeposit() {
      this.depositLoading = true
      this.depositError = null
      try {
        await userAPI.deleteDeposit()
        this.depositAmount = null
        localStorage.removeItem('deposit.amount')
      } catch (err) {
        this.depositError = err
        throw err
      } finally {
        this.depositLoading = false
      }
    },

    // 유저 상태 초기화
    clearUser() {
      this.providerId = ''
      this.userInfo = null
      this.error = null
      this.loading = false

      this.depositAmount = null
      this.depositLoading = false
      this.depositError = null
      localStorage.removeItem('deposit.amount')
    },
  },
})
