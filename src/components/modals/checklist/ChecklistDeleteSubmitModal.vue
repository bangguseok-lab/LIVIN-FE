<script setup>
const emit = defineEmits(['confirm', 'close'])

function onConfirm() {
  emit('confirm')
}
</script>
<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <p class="message">이 체크리스트를 삭제하시겠어요?</p>
      <p class="sm-message">확인을 누르면 삭제되고, 다시 볼 수 없어요</p>
      <div class="button-group">
        <button class="delete-btn" @click="onConfirm">삭제할래요</button>
        <button class="cancel-btn" @click="emit('close')">안 할래요</button>
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
  max-width: rem(500px);
  min-width: rem(400px);
}

.message {
  font-size: 1.2rem;
  margin-bottom: 0.125rem;
}

.sm-message {
  color: #dddddd;
  font-size: 0.825rem;
  padding-bottom: 1.5rem;
}

.button-group {
  display: flex;
  justify-content: center;
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
