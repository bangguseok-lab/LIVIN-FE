<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import BackButton from '@/components/common/buttons/BackButton.vue'
import LogoButton from '@/components/common/buttons/LogoButton.vue'
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
})


const background = computed(() => {
  if (props.icon === 'blue') {
    return 'background-white'
  } else {
    return 'background-blue'
  }
})
</script>

<template>
  <div class="header-wrap">
    <div v-if="props.type === 'together'" class="Header" :class="background">
      <BackButton :icon="props.icon" />
      <LogoButton :icon="props.icon" />
      <div class="header-right"></div>
    </div>
    <div v-else-if="props.type === 'alone-logo'" class="Header-alone" :class="background">
      <LogoButton :icon="props.icon" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/utils/_pxToRem.scss' as *;

.header-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  display: flex;
  justify-content: center;
}

.Header,
.Header-alone {
  width: 100%;
  max-width: rem(600px);
  min-width: rem(100px);
  height: rem(48px);
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  background-color: transparent;
}

.Header {
  justify-content: space-between;
}

.Header-alone {
  justify-content: flex-start;
}

.header-right {
  width: 10%;
  height: 100%;
}

.background-blue {
  background-color: #177dfa;
}

.background-white {
  background-color: #ffffff;
}
</style>
