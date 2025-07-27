<script setup>
defineProps({
  title: String,
  onClose: Function,
})
</script>

<template>
  <div class="check-panel">
    <div class="check-header">
      <h2 class="check-title">{{ title }}</h2>
      <button class="check-close" @click="onClose">×</button>
    </div>
    <div class="check-content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.check-panel {
  position: fixed; // 또는 absolute (보통 fixed가 UI 겹침 방지에 유리)
  z-index: 9999;
  left: 0; // 디폴트값
  top: 0;

  background-color: white;
  border-radius: 1rem;
  border: solid var(--whitish) 1.5px;
  padding: 2rem;
  width: rem(400px);
  max-width: rem(500px);
  margin-top: 0.5rem;
}

.check-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.check-title {
  font-weight: bold;
  font-size: 1rem;
}

.check-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--primary-color);
  cursor: pointer;
}

.check-content {
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>
