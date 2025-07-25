<script setup>
import { computed } from 'vue'
import SafeBadgeIcon from '@/assets/icons/badge/badge.svg'

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
    validator: val =>
      ['profile', 'listing', 'listing-safe', 'register'].includes(val),
  },
})

const emit = defineEmits(['select'])

const typeClass = computed(() => `imagebox-${props.type}`)

const handleClick = () => {
  if (props.type === 'profile') {
    emit('select', props.image)
  }
}
</script>

<template>
  <div class="ImageBox" :class="typeClass" @click="handleClick">
    <img
      v-if="props.type === 'listing-safe'"
      class="badge-icon"
      :src="SafeBadgeIcon"
      alt="안심매물 배지"
    />

    <div
      class="image-wrapper"
      :class="{ selected: props.selected && props.type === 'profile' }"
    >
      <img :src="image" :alt="alt" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ImageBox {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: visible;

  .image-wrapper {
    width: 100%;
    height: 100%;
    border-radius: 14%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border: rem(4px) solid transparent;
    box-sizing: border-box;

    &.selected {
      border-color: var(--primary-color);
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.imagebox-profile {
  width: rem(142px);
  height: rem(142px);
}

.imagebox-register {
  width: rem(148px);
  height: rem(148px);
}

.imagebox-listing {
  width: rem(132px);
  height: rem(104px);
}

.imagebox-listing-safe {
  @extend .imagebox-listing;
  overflow: visible;
}

.badge-icon {
  position: absolute;
  top: rem(-10px);
  left: rem(-18px);
  z-index: 2;
}
</style>
