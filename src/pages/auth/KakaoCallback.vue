<script setup>
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { onMounted } from 'vue'
const route = useRoute()
const router = useRouter()


onMounted(async () => {
  const code = route.query.code

  if (code) {
    try {

      const res = await axios.get(`/api/${name}/callback?code=${code}`)


      const jwt = res.headers['authorization']?.replace('Bearer ', '')
      const providerId = res.data

      sessionStorage.setItem('accessToken', jwt)
      sessionStorage.setItem('providerId', providerId)

      router.push('/home')

    } catch (err) {
      if (err.response?.status === 404) {
        const jwt = err.response.headers['authorization']?.replace('Bearer ', '')
        const providerId = err.response.data
        sessionStorage.setItem('accessToken', jwt)
        sessionStorage.setItem('providerId', providerId)
        router.push(`/auth/signup?providerId=${providerId}`)
      } else {
        console.error('카카오 로그인 실패', err)
      }
    }
  }
})
</script>

<template>
  <div class="KakaoCallback">
    <div>로그인 처리 중...</div>
  </div>
</template>

<style scoped>
.KakaoCallback {}
</style>
