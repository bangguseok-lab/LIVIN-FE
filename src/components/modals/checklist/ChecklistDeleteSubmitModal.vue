<script setup>
const emit = defineEmits(['confirm', 'close'])

function onConfirm() {
  emit('confirm')
}
</script>
<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <p class="message">정말 삭제하시겠습니까?</p>
      <div class="button-group">
        <button class="cancel-btn" @click="emit('close')">취소</button>
        <button class="delete-btn" @click="onConfirm">삭제</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  width: 100%;
  max-width: rem(600px);
  min-width: rem(400px);
}

.message {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  background: #ccc;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.delete-btn {
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style>
