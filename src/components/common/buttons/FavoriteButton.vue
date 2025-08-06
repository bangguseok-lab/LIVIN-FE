<script setup>
import FavoriteImg from '@/assets/images/favorite/favorite-btn-img.png'
import FavoriteImgActive from '@/assets/images/favorite/favorite-btn-img-active.png'
import { defineProps, defineEmits } from 'vue'

const emit = defineEmits(['toggle-favorite'])
const props = defineProps({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    required: true,
  },
  propertyId: {
    type: Number,
    required: true,
  },
})
const handleToggle = () => {
  emit('toggle-favorite', props.propertyId, !props.isFavorite)
}
</script>

<template>
  <img
    class="favorite-btn"
    :src="props.isFavorite ? FavoriteImgActive : FavoriteImg"
    @click="handleToggle"
    :style="{ width: `${props.width}px`, height: `${props.height}px` }"
  />
</template>
<style scoped lang="scss"></style>
