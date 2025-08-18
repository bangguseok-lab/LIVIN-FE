<script setup>
import { FilterSecureOption, FilterChecklistSlider } from './FilterBar.js'

const props = defineProps({
  checklistItems: Array,
  selected: String,
  checklistId: [Number, String],
  onlySecure: Boolean,
  region: Object,
  regionApplied: Object,
  regionData: Object,
})

const emit = defineEmits([
  'update:selected',
  'update:onlySecure',
  'update:checklistId',
  'update:region',
  'filterCompleted',
])
</script>

<template>
  <div class="filter-bar-favorite">
    <!-- 체크리스트 버튼 스크롤 -->
    <FilterChecklistSlider
      :checklist-items="props.checklistItems"
      :checklist-id="props.checklistId"
      :model-value="props.selected"
      :region-data="props.regionData"
      :region="props.region"
      :region-applied="props.regionApplied"
      @update:region="val => emit('update:region', val)"
      @filterCompleted="() => emit('filterCompleted')"
      @update:modelValue="val => emit('update:selected', val)"
      @update:checklistId="val => emit('update:checklistId', val)"
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
