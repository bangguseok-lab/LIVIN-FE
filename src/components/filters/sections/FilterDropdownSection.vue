<script setup>
import { ref, nextTick, computed, onMounted, onUnmounted } from 'vue'
import FilterButton from '@/components/filters/FilterButton.vue'
import DealTypePanel from '@/components/panels/DealTypePanel.vue'
import RegionPanel from '@/components/panels/RegionPanel.vue'
import PricePanel from '@/components/panels/PricePanel.vue'

const props = defineProps({
  mode: String,
  dealType: Array,
  deposit: Object,
  monthly: Object,
  regionData: Object,
})

const emit = defineEmits([
  'update:dealType',
  'update:deposit',
  'update:monthly',
  'update:region',
])

const activePanel = ref(null)
const panelPosition = ref({ left: 0, top: 0 })

const panelRef = ref(null)
const buttonGroupRef = ref(null)

function togglePanel(event, panelKey) {
  if (activePanel.value === panelKey) {
    activePanel.value = null
    return
  }

  activePanel.value = panelKey

  nextTick(() => {
    const button = event.currentTarget
    const buttonRect = button.getBoundingClientRect()

    const dropdown = document.querySelector('.dropdown-section')
    const dropdownRect = dropdown?.getBoundingClientRect()

    if (!dropdownRect) return

    panelPosition.value = {
      left: dropdownRect.width / 2, // 부모의 중심점
      top: buttonRect.bottom + 8 - dropdownRect.top, // 버튼 아래에 띄움
    }
  })
}

function handleClickOutside(event) {
  const panelEl = panelRef.value
  const buttonsEl = buttonGroupRef.value
  if (
    panelEl &&
    !panelEl.contains(event.target) &&
    buttonsEl &&
    !buttonsEl.contains(event.target)
  ) {
    activePanel.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const currentPanelComponent = computed(() => {
  switch (activePanel.value) {
    case 'deal':
      return DealTypePanel
    case 'region':
      return RegionPanel
    case 'price':
      return PricePanel
    default:
      return null
  }
})
</script>

<template>
  <div class="dropdown-section">
    <div class="filter-buttons" ref="buttonGroupRef">
      <FilterButton
        label="거래 유형"
        panelKey="deal"
        :is-active="activePanel === 'deal'"
        @click="e => togglePanel(e, 'deal')"
      />
      <FilterButton
        label="지역"
        panelKey="region"
        :is-active="activePanel === 'region'"
        @click="e => togglePanel(e, 'region')"
      />
      <FilterButton
        label="가격"
        panelKey="price"
        :is-active="activePanel === 'price'"
        @click="e => togglePanel(e, 'price')"
      />
    </div>

    <!-- 드롭다운 패널: 중앙 정렬된 패널 -->
    <div
      v-if="activePanel"
      ref="panelRef"
      class="dropdown-panel"
      :style="{
        left: panelPosition.left + 'px',
        top: panelPosition.top + 'px',
      }"
    >
      <component
        :is="currentPanelComponent"
        :selected="props.dealType"
        @select="val => emit('update:dealType', val)"
        :deposit="props.deposit"
        :monthly="props.monthly"
        @update:deposit="val => emit('update:deposit', val)"
        @update:monthly="val => emit('update:monthly', val)"
        :cities="props.regionData.cities"
        :districts="props.regionData.districts"
        :parishes="props.regionData.parishes"
        @updateRegion="val => emit('update:region', val)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.dropdown-section {
  background-color: var(--white);
  padding: rem(12px) rem(30px);
  border-bottom: rem(1px) solid var(--whitish);
  border-top: rem(1px) solid var(--whitish);
  position: relative;

  .filter-buttons {
    display: flex;
    justify-content: space-between;
    gap: rem(3px);
    position: relative;
  }
  .dropdown-panel {
    position: absolute;
    width: 400px;
    transform: translateX(-50%);
    z-index: 10;
  }

  .panel-section {
    position: absolute;
    z-index: 1000;
    margin-top: rem(8px);
  }
}
</style>
