<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:isOpen', 'save'])

const localImages = ref([])

watch(
  () => props.images,
  newImages => {
    localImages.value = [...newImages]
  },
  { immediate: true },
)

const deleteImage = index => {
  localImages.value.splice(index, 1)
}

const handleFileUpload = event => {
  const files = event.target.files
  if (!files) return

  for (const file of files) {
    const reader = new FileReader()
    reader.onload = e => {
      localImages.value.push({
        file: file,
        url: e.target.result,
      })
    }
    reader.readAsDataURL(file)
  }
}

const save = () => {
  emit('save', localImages.value)
  close()
}

const close = () => {
  emit('update:isOpen', false)
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h4>이미지 수정</h4>
      </div>
      <div class="modal-body">
        <div class="image-previews">
          <div
            v-for="(image, index) in localImages"
            :key="index"
            class="image-item"
          >
            <img :src="image.url" alt="매물 이미지" />
            <button class="delete-btn" @click="deleteImage(index)">×</button>
          </div>
          <label for="file-upload" class="upload-area">
            <input
              type="file"
              id="file-upload"
              multiple
              @change="handleFileUpload"
              accept="image/*"
            />
            <div class="upload-icon">+</div>
            <p>사진 추가</p>
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="save" class="save-btn">저장</button>
        <button @click="close" class="cancel-btn">취소</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 1.5rem;
  padding: 2rem;
  width: 90%;
  max-width: 31.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h4 {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--black);
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #999;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;
}

.close-btn:hover {
  opacity: 1;
}

.modal-body {
  margin-bottom: 2.5rem;
}

.image-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.image-item {
  position: relative;
  width: 6.25rem;
  height: 6.25rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 0.0625rem solid #ddd;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: 0.375rem;
  right: 0.375rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  line-height: 1;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-area {
  width: 6.25rem;
  height: 6.25rem;
  border: 0.125rem dashed #ccc;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  color: #777;
  transition:
    border-color 0.2s ease-in-out,
    color 0.2s ease-in-out;
}

.upload-area:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.upload-area:hover .upload-icon {
  color: var(--primary-color);
  transition: color 0.2s ease-in-out;
}

.upload-area input {
  display: none;
}

.upload-icon {
  font-size: 2.2rem;
  color: #ccc;
}

.upload-area p {
  font-size: 0.9rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
}

.save-btn,
.cancel-btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
  border: none;
}

.save-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.save-btn:hover {
  opacity: 0.9;
}

.cancel-btn {
  background: #e0e0e0;
  color: #333;
}

.cancel-btn:hover {
  opacity: 0.9;
}
</style>
