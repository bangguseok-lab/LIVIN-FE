import api from '@/api'

// const BASE_URL = 'http://localhost:3000/'

export default {
  async getFavorite(params) {
    const { data } = await api.get(`${BASE_URL}favoriteProperties`, { params })
    console.log(data)
    return data
  },

  async getProperties(params) {
    const { data } = await api.get(`${BASE_URL}properties`, { params })
    return data
  },
}
