import { defineStore } from 'pinia'

export const useAuthStore = defineStore('signup', {
  state: () => ({
    name: '',
    nickname: '',
    phone: '',
    birthDate: '',
    role: '', // 'TENANT' or 'LANDLORD'
    profileImage: 0,
    providerId: '',
  }),

  actions: {
    setName(name) {
      this.name = name
    },
    setNickname(nickname) {
      this.nickname = nickname
    },
    setPhone(phone) {
      this.phone = phone
    },
    setBirth(birthDate) {
      this.birthDate = birthDate
    },
    setRole(role) {
      this.role = role
    },
    setProfile(profileImage) {
      this.profileImage = profileImage
    },
    setProviderId(id) {
      this.providerId = id
    },
  },
  getSignupPayload() {
    return {
      name: this.name,
      nickname: this.nickname,
      phone: this.phone,
      birthDate: this.birth,
      role: this.role,
      profileImage: this.profileImage,
    }
  },
  reset() {
    this.name = ''
    this.nickname = ''
    this.phone = ''
    this.birth = ''
    this.role = ''
    this.profileImage = 0
  },
})
