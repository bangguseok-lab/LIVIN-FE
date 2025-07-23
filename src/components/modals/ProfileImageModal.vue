<script setup>
import { ref, defineEmits, defineProps, watch } from 'vue'

const emit = defineEmits(['change', 'update:modelValue'])
const props = defineProps({
  modelValue: Boolean,
})

const images = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?&w=100&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?&w=100&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?&w=100&q=80',
]

const selectedImage = ref(null)

function selectImage(img) {
  selectedImage.value = img
}

function confirmChange() {
  if (selectedImage.value) {
    emit('change', selectedImage.value)
  }
  emit('update:modelValue', false)
}

function closeModal() {
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  val => {
    if (!val) selectedImage.value = null
  },
)
</script>

<template>
  <div v-if="modelValue" class="ProfileImageModal">
    <div class="modal-overlay" @click="closeModal"></div>
    <div class="modal-content">
      <h2>프로필 이미지 변경</h2>
      <div class="image-list">
        <div
          v-for="img in images"
          :key="img"
          class="image-item"
          :class="{ selected: selectedImage === img }"
          @click="selectImage(img)"
        >
          <img :src="img" alt="프로필" />
        </div>
      </div>
      <div class="modal-actions">
        <button @click="closeModal">취소</button>
        <button @click="confirmChange">변경하기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ProfileImageModal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}
.modal-content {
  position: relative;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 300px;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
.image-list {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}
.image-item {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
}
.image-item.selected {
  border-color: #007bff;
}
.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
}
button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
button:first-child {
  background: #eee;
}
button:last-child {
  background: #007bff;
  color: #fff;
}
</style>
