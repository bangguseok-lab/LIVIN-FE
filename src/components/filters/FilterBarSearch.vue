<script setup>
import { FilterDropdownSection, FilterSecureOption } from './FilterBar.js' // 섹션 export 경로

// props로 상위에서 전달 받는(FilterView.vue로부터 내려받은) 상태 바인딩
const props = defineProps({
  dealType: Array,
  jeonseDeposit: Object,
  monthlyDeposit: Object,
  monthlyRent: Object,
  onlySecure: Boolean,
  region: Object,
  regionData: Object,
})

// emit으로 상위에 전달
// 하위 컴포넌트에서 emit된 값을 그대로 상위(FilterView.vue)로 다시 올려주는 역할
const emit = defineEmits([
  'update:dealType',
  'update:jeonseDeposit',
  'update:monthlyDeposit',
  'update:monthlyRent',
  'update:onlySecure',
  'update:region',
])
</script>

<template>
  <div class="filter-bar-search">
    <FilterDropdownSection
      mode="search"
      :dealType="props.dealType"
      :jeonseDeposit="props.jeonseDeposit"
      :monthlyDeposit="props.monthlyDeposit"
      :monthlyRent="props.monthlyRent"
      :region-data="props.regionData"
      :region="props.region"
      @update:dealType="val => emit('update:dealType', val)"
      @update:jeonseDeposit="val => emit('update:jeonseDeposit', val)"
      @update:monthlyDeposit="val => emit('update:monthlyDeposit', val)"
      @update:monthlyRent="val => emit('update:monthlyRent', val)"
      @update:region="val => emit('update:region', val)"
      @filterCompleted="() => emit('filterCompleted')"
    />

    <FilterSecureOption
      :model-value="props.onlySecure"
      @update:modelValue="val => emit('update:onlySecure', val)"
    />
  </div>
</template>

<style scoped lang="scss">
.filter-bar-search {
  width: 100%;
}
</style>
