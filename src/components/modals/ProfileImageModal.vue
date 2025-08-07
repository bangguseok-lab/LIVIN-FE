<script setup>
import { ref, defineEmits, defineProps, watch } from 'vue'
import ImageBox from '@/components/common/imagebox/ImageBox.vue'

import test1 from '@/assets/images/profile/test-1.svg'
import test2 from '@/assets/images/profile/test-2.svg'
import test3 from '@/assets/images/profile/test-3.svg'
import test4 from '@/assets/images/profile/test-4.svg'
import test5 from '@/assets/images/profile/test-5.svg'
import test6 from '@/assets/images/profile/test-6.svg'

const emit = defineEmits(['change', 'update:modelValue'])
const props = defineProps({ modelValue: Boolean })

const images = [test1, test2, test3, test4, test5, test6]
const selectedIndex = ref(null)

// 선택된 이미지 숫자 반환
const selectImage = index => {
  selectedIndex.value = index
}

const confirmChange = () => {
  if (selectedIndex.value !== null) {
    emit('change', selectedIndex.value + 1)   // 이미지의 번호만 부모 컴포넌트로 넘겨줌
  }
  emit('update:modelValue', false)
}

const closeModal = () => {
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  val => {
    if (!val) selectedIndex.value = null
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
        <ImageBox v-for="(img, idx) in images" :key="idx" :image="img" type="profile" :selected="selectedIndex === idx"
          @select="() => selectImage(idx)" />
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
  width: rem(510px);
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
  margin-bottom: rem(30px);
  color: var(--grey);
}

.image-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: rem(20px);
  max-width: rem(600px);
  margin: 0 auto rem(40px);
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
