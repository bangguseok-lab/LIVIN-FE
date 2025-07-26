<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const store = useAuthStore()

onMounted(async () => {
  const code = route.query.code
  const state = route.query.state

  if (code && state) {
    try {
      const res = await axios.get(`/api/naver/callback?code=${code}&state=${state}`)
      const providerId = res.data
      console.log(providerId)

      store.setProviderId(providerId)

      router.push('/home') // 로그인 성공
    } catch (err) {
      if (err.response?.status === 404) {
        const providerId = err.response.data
        store.setProviderId(providerId)
        router.push(`/auth/signup?providerId=${providerId}`)
      } else {
        console.error('네이버 로그인 실패', err)
      }
    }
  }
})
</script>

<template>
  <div class="NaverCallback"></div>
</template>

<style scoped>
.NaverCallback {}
</style>
