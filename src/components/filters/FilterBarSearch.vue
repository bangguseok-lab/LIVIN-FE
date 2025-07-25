<script setup>
import { FilterDropdownSection, FilterSecureOption } from './FilterBar.js' // 섹션 export 경로

// props로 상위에서 전달 받는 상태 바인딩
const props = defineProps({
  dealType: Array,
  deposit: Object,
  monthly: Object,
  onlySecure: Boolean,
  region: Object,
  regionData: Object,
})

// emit으로 상위에 전달
const emit = defineEmits([
  'update:dealType',
  'update:deposit',
  'update:monthly',
  'update:onlySecure',
  'update:region',
])
</script>

<template>
  <div class="filter-bar-search">
    <FilterDropdownSection
      mode="search"
      :dealType="props.dealType"
      :deposit="props.deposit"
      :monthly="props.monthly"
      :region-data="props.regionData"
      @update:dealType="val => emit('update:dealType', val)"
      @update:deposit="val => emit('update:deposit', val)"
      @update:monthly="val => emit('update:monthly', val)"
      @update:region="val => emit('update:region', val)"
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
