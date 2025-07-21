<script setup></script>

<template>
  <div class="DefaultLayout"></div>
  <div class="layout-wrapper">
    <!-- 예: 공통 헤더 -->
    <!-- <Header /> -->

    <!-- 라우트 페이지가 들어갈 자리 -->
    <slot />

    <!-- 예: 공통 푸터 -->
    <!-- <Footer /> -->
  </div>
</template>

<style scoped>
.DefaultLayout {}
</style>
