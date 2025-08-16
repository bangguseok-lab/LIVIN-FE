<script setup>
import { FilterSecureOption, FilterChecklistSlider } from './FilterBar.js'

const props = defineProps({
  checklistItems: Array,
  selected: String,
  onlySecure: Boolean,
  region: Object,
  regionData: Object,
})

const emit = defineEmits([
  'update:selected',
  'update:onlySecure',
  'update:region',
  'filterCompleted',
])
</script>

<template>
  <div class="filter-bar-favorite">
    <!-- 체크리스트 버튼 스크롤 -->
    <FilterChecklistSlider
      :checklist-items="props.checklistItems"
      :model-value="props.selected"
      :region-data="props.regionData"
      :region="props.region"
      @update:region="val => emit('update:region', val)"
      @filterCompleted="() => emit('filterCompleted')"
      @update:modelValue="val => emit('update:selected', val)"
    />

    <!-- 안심 매물 체크 -->
    <FilterSecureOption
      :model-value="props.onlySecure"
      @update:modelValue="val => emit('update:onlySecure', val)"
    />
  </div>
</template>

<style scoped lang="scss">
.filter-bar-favorite {
  width: 100%;
}
</style>
