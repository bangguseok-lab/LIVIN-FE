<script setup>
import RegionSelector from './RegionSelector.vue'
import { defineProps, defineEmits } from 'vue'

// 지역 리스트는 props로 받고, 선택된 결과만 emit
const props = defineProps({
  cities: {
    type: Array,
    required: true,
  },
  districts: {
    type: Array,
    required: true,
  },
  parishes: {
    type: Array,
    required: true,
  },
})

// 선택 결과를 부모로 전달
const emit = defineEmits(['updateRegion'])

const handleRegionUpdate = region => {
  emit('updateRegion', region)
}
</script>

<template>
  <div class="region-panel">
    <RegionSelector
      class="element1"
      :cities="cities"
      :districts="districts"
      :parishes="parishes"
      @updateRegion="handleRegionUpdate"
    />
  </div>
</template>

<style scoped>
.region-panel {
  background-color: var(--white);
  border-radius: 1rem;
  padding: 2rem;
  width: rem(400px);
  max-width: rem(500px);
  height: 60vh;
  border: solid var(--whitish) 1.5px;
  position: relative;
}
.element1 {
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--whitish);
}
.element2 {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #333;
}
</style>
