<script setup>
import { ref } from 'vue'
import {
  FilterDropdownSection,
  FilterSecureOption,
} from './FilterBar.js'

// Props 정의
const props = defineProps({
  checklistItems: Array,
  selected: String,
  onlySecure: Boolean,
  dealType: Array,
  jeonseDeposit: Object,
  monthlyDeposit: Object,
  monthlyRent: Object,
  region: Object,
  regionData: Object,
})

const emit = defineEmits([
  'update:selected',
  'update:onlySecure',
  'update:dealType',
  'update:jeonseDeposit',
  'update:monthlyDeposit',
  'update:monthlyRent',
  'update:region',
])

// 탭 상태
const isGeneral = ref(true)
const isFavorite = ref(false)

function selectGeneral() {
  isGeneral.value = true
  isFavorite.value = false
  emit('update:selected', '일반 매물')
}

function selectFavorite() {
  isGeneral.value = false
  isFavorite.value = true
  emit('update:selected', '관심 매물')
}
</script>

<template>
  <div class="filter-bar-checklist">
    <!-- 상단 탭 -->
    <div class="checklist-tab-buttons">
      <button :class="{ active: isGeneral }" @click="selectGeneral">
        일반 매물
      </button>
      <button :class="{ active: isFavorite }" @click="selectFavorite">
        관심 매물
      </button>
    </div>

    <!-- 드롭다운 필터 -->
    <FilterDropdownSection
      mode="checklist"
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
    />

    <!-- 안심 매물 체크 -->
    <FilterSecureOption
      :model-value="props.onlySecure"
      @update:modelValue="val => emit('update:onlySecure', val)"
    />
  </div>
</template>

<style scoped lang="scss">
.filter-bar-checklist {
  width: 100%;
}

.checklist-tab-buttons {
  display: flex;
  justify-content: center;
  gap: rem(100px);
  padding: rem(8px) 0;
  border-top: rem(1px) solid var(--whitish);

  button {
    padding: rem(6px) rem(16px);
    font-size: rem(14px);
    border: none;
    background-color: transparent;
    color: var(--grey);
    font-weight: var(--font-weight-sm);
    cursor: pointer;

    &.active {
      color: var(--primary-color);
      font-weight: var(--font-weight-lg);
    }
  }
}
</style>
