<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  icon: {
    Type: String,
    required: true,
  },
  type: {
    Type: String,
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
const aloneClass = computed(() => {
  return props.type === 'alone-logo' ? 'alone' : ''
})
</script>
<template>
  <div class="logo-button-wrap" @click.prevent="home" :class="aloneClass">
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
.alone {
  justify-content: flex-start;
}
</style>
