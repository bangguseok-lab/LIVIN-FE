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
  <div v-if="props.type === 'together'" class="Header" :class="background">
    <BackButton :icon="props.icon" />
    <LogoButton :icon="props.icon" />
    <div class="header-right"></div>
  </div>
  <div
    v-else-if="props.type === 'alone-logo'"
    class="Header-alone"
    :class="background"
  >
    <LogoButton :icon="props.icon" />
  </div>
</template>

<style scoped>
.Header,
.Header-alone {
  width: 100%;
  height: 3rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
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
