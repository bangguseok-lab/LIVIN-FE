<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import RegionPanel from '@/components/panels/RegionPanel.vue'

const props = defineProps({
  checklistItems: Array,   // ['라벨1','라벨2', ...]
  modelValue: String,      // 현재 선택 라벨
  regionData: Object,      // { cities, districts, parishes }
  region: Object,          // { city, district, parish }
})
const emit = defineEmits(['update:modelValue', 'update:region'])

const showPanel = ref(null)      // 'region' | null
const panelRef = ref(null)
const buttonRef = ref(null)
const panelPosition = ref({ left: 0, top: 0 })

function setPanelPositionByElement(el) {
  if (!el) return
  const rect = el.getBoundingClientRect()
  const container = el.closest('.filter-scroll-section')
  const containerRect = container.getBoundingClientRect()
  const panelWidth = 400
  panelPosition.value = {
    left: containerRect.left + containerRect.width / 2 - panelWidth / 2,
    top: rect.bottom + 8 + window.scrollY,
  }
}

// ✅ 체크리스트 버튼 클릭 → 선택만 emit (모달/상세 없음)
function handleSelect(label) {
  emit('update:modelValue', label)
}

function togglePanel(event, panelKey) {
  if (showPanel.value === panelKey) {
    showPanel.value = null
    return
  }
  showPanel.value = panelKey
  nextTick(() => setPanelPositionByElement(event.currentTarget))
}

function handleClickOutside(event) {
  const panelEl = panelRef.value
  const buttonEl = buttonRef.value
  if (panelEl && !panelEl.contains(event.target) && buttonEl && !buttonEl.contains(event.target)) {
    showPanel.value = null
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

const handleRegionUpdate = region => {
  if (region.final == true) showPanel.value = null
  emit('update:region', region)
}
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
      지역별 <span class="arrow-down">▼</span>
    </button>

    <!-- ✅ 체크리스트 버튼들 -->
    <button
      v-for="label in checklistItems"
      :key="label"
      :class="{ active: modelValue === label }"
      @click="() => handleSelect(label)"
    >
      {{ label }}
    </button>

    <!-- 지역 드롭다운 패널 -->
    <div
      v-if="showPanel === 'region'"
      class="dropdown-panel"
      ref="panelRef"
      :style="{ left: panelPosition.left + 'px', top: panelPosition.top + 'px' }"
    >
      <RegionPanel
        :cities="regionData.cities"
        :districts="regionData.districts"
        :parishes="regionData.parishes"
        :selected-region="props.region"
        @updateRegion="handleRegionUpdate"
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
      color: var(--grey);
      border-color: var(--grey);
      position: relative; // ::after 위치 기준
      padding: 0 rem(24px) 0 rem(12px);

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        right: rem(8px);
        transform: translateY(-50%) rotate(45deg);
        width: rem(6px);
        height: rem(6px);
        border: solid #b3b3b3;
        border-width: 0 rem(1px) rem(1px) 0;
        pointer-events: none;
      }
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
