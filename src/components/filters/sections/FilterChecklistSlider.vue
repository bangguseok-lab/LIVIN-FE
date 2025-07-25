<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import RegionPanel from '@/components/panels/RegionPanel.vue'

const props = defineProps({
  checklistItems: Array,
  modelValue: String,
  regionData: Object,
})
const emit = defineEmits(['update:modelValue', 'update:region'])

function handleSelect(item) {
  emit('update:modelValue', item)
}

const showPanel = ref(null)
const panelRef = ref(null)
const buttonRef = ref(null)
const panelPosition = ref({ left: 0, top: 0 })

function togglePanel(event, panelKey) {
  if (showPanel.value === panelKey) {
    showPanel.value = null
    return
  }

  showPanel.value = panelKey

  nextTick(() => {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const container = button.closest('.filter-scroll-section')
    const containerRect = container.getBoundingClientRect()

    const panelWidth = 400

    panelPosition.value = {
      left: containerRect.left + containerRect.width / 2 - panelWidth / 2,
      top: rect.bottom + 8 + window.scrollY,
    }
  })
}

function handleClickOutside(event) {
  const panelEl = panelRef.value
  const buttonEl = buttonRef.value
  if (
    panelEl &&
    !panelEl.contains(event.target) &&
    buttonEl &&
    !buttonEl.contains(event.target)
  ) {
    showPanel.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="filter-scroll-section">
    <!-- 지역 드롭다운 버튼 -->
    <button
      ref="buttonRef"
      class="dropdown-button"
      panelKey="region"
      @click="e => togglePanel(e, 'region')"
    >
      지역별
      <span class="arrow-down">▼</span>
    </button>

    <!-- 체크리스트 버튼들 -->
    <button
      v-for="item in checklistItems"
      :key="item"
      :class="{ active: modelValue === item }"
      @click="handleSelect(item)"
    >
      {{ item }}
    </button>

    <!-- 드롭다운 패널 -->
    <div
      v-if="showPanel"
      class="dropdown-panel"
      ref="panelRef"
      :style="{
        left: panelPosition.left + 'px',
        top: panelPosition.top + 'px',
      }"
    >
      <RegionPanel
        :cities="regionData.cities"
        :districts="regionData.districts"
        :parishes="regionData.parishes"
        @updateRegion="val => emit('update:region', val)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.filter-scroll-section {
  display: flex;
  gap: rem(10px);
  overflow-x: auto;
  padding: rem(12px) rem(16px);
  background-color: var(--white);
  border-top: rem(1px) solid var(--whitish);
  border-bottom: rem(1px) solid var(--whitish);
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }

  button {
    padding: rem(6px) rem(14px);
    font-size: rem(12px);
    border: rem(1px) solid var(--grey);
    border-radius: rem(999px);
    background-color: var(--white);
    color: var(--grey);
    white-space: nowrap;
    cursor: pointer;

    &.active {
      background-color: var(--primary-color);
      color: var(--white);
      border: none;
    }

    &.dropdown-button {
      font-weight: 600;
      color: var(--primary-color);
      border-color: var(--primary-color);
    }

    .arrow-down {
      margin-left: rem(4px);
    }
  }

  .dropdown-panel {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }
}
</style>
