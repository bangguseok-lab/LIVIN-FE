<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios'

const route = useRoute()
const router = useRouter()


const store = useAuthStore()

onMounted(async () => {
  const code = route.query.code

  if (code) {
    try {
      const res = await axios.get(`/api/kakao/callback?code=${code}`)   // 토큰 발급

      store.setProviderId(res.data)

      router.push('/home')    // 로그인 성공
    } catch (err) {
      if (err.response?.status === 404) {
        // 회원정보가 없는 경우, 회원가입 진행
        const providerId = store.providerId
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
  </div>
</template>

<style scoped>
.KakaoCallback {}
</style>
