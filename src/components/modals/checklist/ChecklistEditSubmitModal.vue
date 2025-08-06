<script setup>
import { defineProps, defineEmits, ref } from 'vue'

const props = defineProps({
  initTitle: String,
  initDescription: String,
})
const emit = defineEmits(['save', 'close'])

const title = ref(props.initTitle || '')
const description = ref(props.initDescription || '')

function onSave() {
  emit('save', {
    title: title.value,
    description: description.value,
  })
}

function onCancel() {
  emit('close')
}
</script>
<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">체크리스트 정보 수정</h3>

      <div class="form-group">
        <label for="title">제목</label>
        <input id="title" v-model="title" class="input-field" />
      </div>

      <div class="form-group">
        <label for="description">설명</label>
        <textarea id="description" v-model="description" class="input-field" />
      </div>

      <div class="btn-group">
        <button class="confirm-btn" @click="onSave">저장</button>
        <button class="cancel-btn" @click="onCancel">취소</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  z-index: 999;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 500px;
  max-width: 90%;
  text-align: left;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.modal-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.input-field {
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

.btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.confirm-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}

.cancel-btn {
  background-color: #aaa;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>
