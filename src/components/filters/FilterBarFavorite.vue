<script setup>
import { FilterSecureOption, FilterChecklistSlider } from './FilterBar.js'

const props = defineProps({
  checklistItems: { type: Array, default: () => [] },
  selected: { type: Array, default: () => [] },
  onlySecure: Boolean,
  region: Object,
  regionApplied: Object,
  regionData: Object,
})

const emit = defineEmits([
  'update:selected',
  'update:onlySecure',
  'update:region',
  'filterCompleted',
])

function onToggleSelected(newSelected) {
  // ✅ 배열 그대로 올려보내기
  emit('update:selected', newSelected)
}
</script>

<template>
  <div class="filter-bar-favorite">
    <!-- 체크리스트 버튼 스크롤 -->
    <FilterChecklistSlider
      :checklist-items="props.checklistItems"
      :model-value="props.selected"
      :region-data="props.regionData"
      :region="props.region"
      :region-applied="props.regionApplied"
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
