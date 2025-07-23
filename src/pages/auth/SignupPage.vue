<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router'
import Button from '@/components/common/buttons/Buttons.vue';

const route = useRoute()

const nextPath = ref('')

// 경로 감지 후 nextPath 업데이트
watch(() => route.path,
  (newPath) => {
    if (newPath.endsWith('/name')) {
      nextPath.value = '/auth/signup/nickname'
    } else if (newPath.endsWith('/nickname')) {
      nextPath.value = '/auth/signup/phone-number'
    } else if (newPath.endsWith('/phone-number')) {
      nextPath.value = '/auth/signup/birth'
    } else if (newPath.endsWith('/birth')) {
      nextPath.value = '/auth/signup/role'
    } else if (newPath.endsWith('/role')) {
      nextPath.value = '/auth/signup/profile'
    } else if (newPath.endsWith('/profile')) {
      nextPath.value = '/auth/signup/done'
    }
  }, {
  immediate: true
})
</script>

<template>
  <div class="SignupPage">
    <!-- 내부 컴포넌트 (이름, 닉네임, 연락처, 생일 입력) -->
    <router-view />
    <!-- 주소가 있으면 버튼 활성화 -->
    <Button type="default" label="다음" :togo="nextPath" />
  </div>
</template>

<style scoped>
.SignupPage {
  width: 100%;
  height: 100vh;
  padding: 6rem 2rem 0;
}
</style>
