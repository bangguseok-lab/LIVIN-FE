<script setup>
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  icon: {
    Type: String,
    required: true,
  },
})
const router = useRouter()
const route = useRoute()
const home = () => {
  if (route.path.startsWith('/auth/signup')) {
    if (
      confirm(
        '작성하신 내용이 저장되지 않습니다. \n괜찮으시다면 "확인"을 눌러주세요.',
      )
    ) {
      router.push('/landing')
    }
  } else {
    router.push('/home')
  }
}
</script>
<template>
  <div class="logo-button-wrap" @click.prevent="home">
    <img src="../../../assets/icons/header/logo-blue.svg" alt="로고 파란색" v-if="props.icon === 'blue'" />
    <img src="../../../assets/icons/header/logo-white.svg" alt="로고 하얀색" v-else-if="props.icon === 'white'" />
  </div>
</template>
<style scoped>
.logo-button-wrap {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 1.2rem;
}
</style>
