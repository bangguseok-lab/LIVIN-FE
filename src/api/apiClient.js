// src/api/apiClient.js
import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefresh = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// 요청 인터셉터
apiClient.interceptors.request.use(
  async config => {
    const token = sessionStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error),
)

//응답 인터셉터
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    const status = error.response?.status
    const isRefreshUrl = originalRequest.url.includes('/api/users/refresh')
    if (
      (status === 401 || status === 403) &&
      !originalRequest._retry &&
      !isRefreshUrl
    ) {
      originalRequest._retry = true
      if (!isRefresh) {
        isRefresh = true
        try {
          const accessToken = await refreshAccessToken()
          sessionStorage.setItem('accessToken', accessToken)
          processQueue(null, accessToken)

          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return apiClient(originalRequest)
        } catch (error) {
          console.log('토큰 재발급 실패:', error)
          isRefresh = false
          processQueue(error)

          alert('인증이 만료되었습니다. 다시 로그인해주세요.')
          window.location.href = '/landing'
          sessionStorage.clear()
          return Promise.reject(error)
        }
      } else {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }
    }

    if (status === 401 || (status === 403 && isRefreshUrl)) {
      logout()
      alert('인증이 만료되었습니다. 다시 로그인해주세요.')
      window.location.href = '/landing'
    }

    console.error('요청 중 오류 발생:', error)
    return Promise.reject(error)
  },
)

const refreshAccessToken = async () => {
  const response = await axios.post(
    `${apiClient.defaults.baseURL}/users/refresh`,
  )
  const accessToken = response.data
  // const accessToken = response.headers?.Authorization?.split(' ')[1]
  return accessToken
}

const logout = async () => {
  sessionStorage.removeItem('accessToken')
  const response = await axios.post(
    `${apiClient.defaults.baseURL}/users/logout`,
  )
  console.log(response)
}

export default apiClient
