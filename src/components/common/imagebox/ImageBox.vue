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
    validator: val =>
      ['profile', 'listing', 'listing-safe', 'register'].includes(val),
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
    <div v-if="props.type === 'listing-safe'" class="badge">안심매물</div>
    <img :src="image" :alt="alt" />
  </div>
</template>

<style scoped lang="scss">
.ImageBox {
  border: rem(4px) solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;

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
  width: rem(142px);
  height: rem(142px);
  border-radius: 14%;
  overflow: hidden;
}

.imagebox-register {
  width: rem(148px);
  height: rem(148px);
  border-radius: 14%;
  overflow: hidden;
}

.imagebox-listing {
  width: rem(132px);
  height: rem(104px);
  border-radius: 14%;
  overflow: hidden;
}

.imagebox-listing-safe {
  @extend .imagebox-listing;
  overflow: visible;
}

.badge {
  position: absolute;
  top: rem(-4px);
  left: rem(-14px);
  background-color: var(--primary-color);
  color: var(--white);
  padding: rem(4px);
  border-radius: rem(9999px);
  font-size: rem(10px);
  width: rem(48px);
  height: rem(18px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  overflow: visible;
}
</style>
