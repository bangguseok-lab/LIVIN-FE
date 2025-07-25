// src/api/apiClient.js
import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터
apiClient.interceptors.request.use(
  async config => {
    let token = sessionStorage.getItem('accessToken')

    if (!token) {
      try {
        const providerId = sessionStorage.getItem('providerId')
        if (providerId) {
          const response = await axios.post(
            `/api/users/refresh?providerId=${providerId}`,
          )
          token = response.data
          // sessionStorage.setItem('accessToken', token)
        }
      } catch (e) {
        console.error('토큰 재발급 실패:', e)
        return Promise.reject(e)
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error),
)

export default apiClient
