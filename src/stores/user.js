import { defineStore } from 'pinia'
import api from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    nickname: '',
  }),
  actions: {
    async fetchNickname() {
      try {
        const data = await api.getNickname()
        this.nickname = data
      } catch (error) {
        console.error('닉네임 조회에 실패했습니다.:', error)
      }
    },
  },
  getters: {
    getNickname: state => state.nickname,
  },
})
