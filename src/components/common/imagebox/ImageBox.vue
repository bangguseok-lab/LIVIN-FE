<script setup>
const props = defineProps({
  image: String, // 이미지 URL 또는 import 경로
  selected: Boolean, // 선택 상태
  alt: {
    type: String,
    default: '이미지',
  },
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="ImageBox" :class="{ selected }" @click="$emit('select', image)">
    <img :src="image" :alt="alt" />
  </div>
</template>

<style scoped lang="scss">
.ImageBox {
  width: rem(132px);
  height: rem(165px);
  border-radius: 14%;
  overflow: hidden;
  border: rem(4px) solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.ImageBox.selected {
  border-color: var(--primary-color);
}

.ImageBox img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
