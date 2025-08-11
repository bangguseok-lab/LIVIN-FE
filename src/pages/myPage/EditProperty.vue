<script setup>
import Navbar from '@/components/layouts/Navbar.vue'
</script>

<template>
  <div>
    <Navbar />
    <div class="edit-property-container">
      <h1 class="page-title">매물 수정 페이지</h1>
      <p class="guide-text">수정 기능을 구현할 곳입니다.</p>
    </div>
  </div>
</template>

<style scoped>
.edit-property-container {
  padding-top: 6rem;
  text-align: center;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.guide-text {
  font-size: 1.2rem;
  color: #666;
}
</style>
