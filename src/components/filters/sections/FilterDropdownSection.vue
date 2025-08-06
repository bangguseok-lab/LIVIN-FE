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
  region: Object,
})

// 각 패널에서 선택된 값을 v-model 스타일로 상위에 올려줌
const emit = defineEmits([
  'update:dealType',
  'update:jeonseDeposit',
  'update:monthlyDeposit',
  'update:monthlyRent',
  'update:region',
])

//상태 관리
const activePanel = ref(null)
const panelPosition = ref({ left: 0, top: 0 })

const panelRef = ref(null)
const buttonGroupRef = ref(null)

// 이미 열려 있던 패널이면 닫음
// 새로 열려야 할 패널이면 activePanel 변경
// nextTick() 이후 DOM 계산하여 드롭다운 위치 설정
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

// 클릭된 대상이 패널과 버튼 그룹 바깥이면 activePanel을 null로 닫음
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

//document 클릭 이벤트 등록
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
// document 클릭 이벤트 제거
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleRegionUpdate = region => {
  if (region.final == true) activePanel.value = null
  emit('update:region', region)
}

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
      <!-- 
      클릭 시 togglePanel() 실행
      is-active로 버튼에 강조 효과 줌 -->
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
      <!-- 현재 열린 패널에 따라 동적으로 패널 컴포넌트가 바뀜 -->
      <component
        :is="currentPanelComponent"
        :selected="props.dealType"
        @select="val => emit('update:dealType', val)"
        :jeonseDeposit="props.jeonseDeposit"
        :monthlyDeposit="props.monthlyDeposit"
        :monthlyRent="props.monthlyRent"
        @update:jeonseDeposit="val => emit('update:jeonseDeposit', val)"
        @update:monthlyDeposit="val => emit('update:monthlyDeposit', val)"
        @update:monthlyRent="val => emit('update:monthlyRent', val)"
        :cities="props.regionData.cities"
        :districts="props.regionData.districts"
        :parishes="props.regionData.parishes"
        :selected-region="props.region"
        @updateRegion="handleRegionUpdate"
        @filterCompleted="$emit('filterCompleted')"
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
