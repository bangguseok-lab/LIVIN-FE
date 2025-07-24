<script setup>
import { computed } from 'vue'

const props = defineProps({
  image: String,
  selected: Boolean,
  alt: {
    type: String,
    default: '이미지',
  },
  type: {
    type: String,
    default: 'profile',
    validator: val => ['profile', 'listing', 'register'].includes(val),
  },
})

const emit = defineEmits(['select'])

const typeClass = computed(() => `imagebox-${props.type}`)

const isSelectedClass = computed(() =>
  props.type === 'profile' && props.selected ? 'selected' : '',
)

const handleClick = () => {
  if (props.type === 'profile') {
    emit('select', props.image)
  }
}
</script>

<template>
  <div
    class="ImageBox"
    :class="[typeClass, isSelectedClass]"
    @click="handleClick"
  >
    <img :src="image" :alt="alt" />
  </div>
</template>

<style scoped lang="scss">
.ImageBox {
  border: rem(4px) solid transparent;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease-in-out;

  &.selected {
    border-color: var(--primary-color);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.imagebox-profile {
  width: rem(132px);
  height: rem(165px);
  border-radius: 14%;
}
</style>
