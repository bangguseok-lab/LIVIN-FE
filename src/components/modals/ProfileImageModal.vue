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

const selectImage = img => {
  selectedImage.value = img
}

const confirmChange = () => {
  if (selectedImage.value) {
    emit('change', selectedImage.value)
  }
  emit('update:modelValue', false)
}

const closeModal = () => {
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
      <h2>프로필 이미지를 선택하세요</h2>
      <p>선택 후 완료를 누르면 적용돼요</p>
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
        <button @click="confirmChange">완료</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
  background: var(--white);
  border-radius: rem(24px);
  padding: rem(24px);
  width: rem(500px);
  z-index: 1000;
  box-shadow: 0 rem(4px) rem(16px) rgba(0, 0, 0, 0.25);
}

h2 {
  font-size: rem(18px);
  font-weight: 800;
  padding-left: rem(20px);
  margin-bottom: rem(3px);
  margin-top: rem(20px);
}

p {
  padding-left: rem(20px);
  font-size: rem(12px);
  margin-bottom: rem(34px);
  color: var(--grey);
}

.image-list {
  display: flex;
  justify-content: center;
  gap: rem(18px);
  margin-bottom: rem(40px);
}

.image-item {
  width: rem(132px);
  height: rem(165px);
  border-radius: 14%;
  overflow: hidden;
  border: rem(4px) solid transparent;
  cursor: pointer;
}

.image-item.selected {
  border-color: var(--primary-color);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-actions {
  display: flex;
  justify-content: center;
  font-size: rem(14px);
}

button {
  padding: rem(16px) rem(200px);
  border: none;
  border-radius: rem(18px);
  cursor: pointer;
  margin-bottom: rem(4px);
}

button:first-child {
  background: #eee;
}

button:last-child {
  background: var(--primary-color);
  color: var(--white);
}
</style>
