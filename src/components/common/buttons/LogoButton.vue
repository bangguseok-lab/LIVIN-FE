<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  icon: {
    Type: String,
    required: true,
  },
})
const router = useRouter()
const home = () => {
  router.push('/')
}
</script>
<template>
  <div class="logo-button-wrap" @click.prevent="home">
    <img
      src="../../../assets/icons/header/logo-blue.svg"
      alt="로고 파란색"
      v-if="props.icon === 'blue'"
    />
    <img
      src="../../../assets/icons/header/logo-white.svg"
      alt="로고 하얀색"
      v-else-if="props.icon === 'white'"
    />
  </div>
</template>
<style scoped>
.logo-button-wrap {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
