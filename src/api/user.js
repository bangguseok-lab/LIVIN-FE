import apiClient from './apiClient'

export default {
  async getNickname() {
    const { data } = await apiClient.get('/users')
    return data.nickname
  },
}
