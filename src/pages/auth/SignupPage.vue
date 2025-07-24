<script setup></script>

<template>
  <div class="SignupPage">
    <!-- 내부 컴포넌트 보일 곳(이름, 닉네임, 연락처, 생일, 프로필 이미지 선택 페이지) -->
    <router-view />
  </div>
</template>

<style scoped lang="scss">
.SignupPage {
  width: 100%;
  height: 100vh;
  padding: 6rem 2rem 0;
}

.nextBtn {
  width: rem(500px);
}
</style>
