<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import apiClient from '@/api/apiClient'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const code = route.query.code

  if (code) {
    try {
      const res = await apiClient(`kakao/callback?code=${code}`)

      // JWT 토큰을 헤더에서 꺼내기
      const token = res.headers['authorization'] || res.headers['Authorization']; if (token) {
        sessionStorage.setItem('accessToken', token)
      }

      router.push('/home') // 로그인 성공
    } catch (err) {
      if (err.response?.status === 404) {
        // 회원정보가 없는 경우, 회원가입 진행
        const providerId = err.response.data
        router.push(`/auth/signup?providerId=${providerId}`)
      } else {
        console.error('카카오 로그인 실패', err)
      }
    }
  }
})
</script>

<template>
  <div class="KakaoCallback"></div>
</template>

<style scoped></style>
