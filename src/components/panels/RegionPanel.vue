<script setup>
import RegionSelector from './RegionSelector.vue'

import { ref } from 'vue'

// 선택된 지역 정보 저장
const selectedRegion = ref({
  city: null,
  district: null,
  neighborhood: null,
})

// 선택된 지역 정보가 변경되었을 때 호출됨
const onRegionUpdate = region => {
  selectedRegion.value = region
  console.log('선택된 지역:', region)
}
</script>

<template>
  <div class="region-panel">
    <RegionSelector class="element1" @updateRegion="onRegionUpdate" />
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
