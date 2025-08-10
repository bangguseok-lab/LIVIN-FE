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
const back = () => {
  console.log(route.name)
  if (route.path.startsWith('/auth/signup')) {
    if (
      confirm(
        '작성하신 내용이 저장되지 않습니다. \n괜찮으시다면 "확인"을 눌러주세요.',
      )
    ) {
      router.push('/landing')
    }
  }
  if (route.name.startsWith('checklistDetail')) {
    console.log(route.name)
    router.push('/checklist')
  } else {
    router.back()
  }
}
</script>
<template>
  <div class="back-button-wrap" @click.prevent="back">
    <img
      src="../../../assets/icons/header/back-icon-blue.svg"
      alt="뒤로가기 파란색"
      v-if="props.icon === 'blue'"
    />
    <img
      src="../../../assets/icons/header/back-icon-white.svg"
      alt="뒤로가기 하얀색"
      v-else-if="props.icon === 'white'"
    />
  </div>
</template>
<style scoped>
.back-button-wrap {
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
