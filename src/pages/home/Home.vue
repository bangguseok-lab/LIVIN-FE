<!-- eslint-disable vue/multi-word-component-names -->
<script setup>

</script>

<template>
  <!-- slot 스타일 테스트용이라 필요에 따라 마크업이랑 스타일 수정하시면 됩니다. -->
  <div class="Home">
    <div class="test-box">
      <h1>Home</h1>
    </div>
  </div>
</template>

<style scoped lang="scss">
.Home {
  width: 100%;
  padding: 4rem 2rem;
  background-color: var(--primary-color);
}

.test-box {
  height: 1400px;
}
</style>
