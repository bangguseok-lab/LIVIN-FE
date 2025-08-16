<script setup>
import { ref, nextTick, onMounted, onUnmounted, computed } from 'vue'
import RegionPanel from '@/components/panels/RegionPanel.vue'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, A11y, Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/scrollbar'

const favScrollbarRef = ref(null)
const modules = [FreeMode, A11y, Scrollbar]

const props = defineProps({
  checklistItems: Array, // ['라벨1','라벨2', ...]
  modelValue: String, // 현재 선택 라벨
  regionData: Object, // { cities, districts, parishes }
  region: Object, // { city, district, parish }
  regionApplied: { type: Object, default: null },
})
const emit = defineEmits([
  'update:modelValue',
  'update:region',
  'filterCompleted',
])
const isRegionActive = computed(() => {
  const r = props.regionApplied ?? props.region
  return !!(r?.city || r?.district || r?.parish)
})

const showPanel = ref(null) // 'region' | null
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
    left:
      containerRect.left +
      containerRect.width / 2 -
      panelWidth / 2 +
      window.scrollX,
    top: rect.bottom + 8 + window.scrollY,
  }
}

// ✅ 체크리스트 버튼 클릭 → 선택만 emit (모달/상세 없음)
function handleSelect(label) {
  if (props.modelValue === label) {
    emit('update:modelValue', '') // 같은 항목 다시 누르면 해제
  } else {
    emit('update:modelValue', label)
  }
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
  if (
    panelEl &&
    !panelEl.contains(event.target) &&
    buttonEl &&
    !buttonEl.contains(event.target)
  ) {
    showPanel.value = null
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

const handleRegionUpdate = region => {
  // 중간 변경: draft만 올림
  emit('update:region', region)
  // 완료: 패널 닫기 (filterCompleted는 아래 핸들러에서 한 번만)
  if (region?.final === true) {
    showPanel.value = null
  }
}

function handleFilterCompleted() {
  showPanel.value = null // 패널 닫기
  emit('filterCompleted') // 상위로 완료 이벤트 1회 전달
}
</script>

<template>
  <div class="filter-scroll-section">
    <div class="region-row">
      <button
        ref="buttonRef"
        class="dropdown-button"
        :class="{ active: isRegionActive }"
        panelKey="region"
        @click="e => togglePanel(e, 'region')"
      >
        지역별
      </button>
    </div>

    <!-- ✅ 체크리스트 버튼들 -->
    <div class="chips-area">
      <Swiper
        class="checklist-swiper"
        :modules="modules"
        :slides-per-view="'auto'"
        :space-between="10"
        :free-mode="{ enabled: true, momentum: true }"
        :loop="false"
        :watch-overflow="false"
        :centerInsufficientSlides="false"
        :allow-touch-move="true"
        :simulateTouch="true"
        :touchStartPreventDefault="false"
        :preventClicks="true"
        :preventClicksPropagation="true"
        :grabCursor="false"
        touchEventsTarget="container"
        :scrollbar="{ el: favScrollbarRef, draggable: true, hide: false }"
        :observer="true"
        :observe-parents="true"
        :resize-observer="true"
        :a11y="{ enabled: true }"
      >
        <SwiperSlide
          v-for="item in checklistItems"
          :key="item.id ?? item"
          class="slide-auto"
        >
          <button
            :class="{ active: modelValue === (item.label ?? item) }"
            @click="() => handleSelect(item.label ?? item)"
          >
            {{ item.label ?? item }}
          </button>
        </SwiperSlide>
      </Swiper>

      <!-- ✅ chips-area 내부 전용 스크롤바 -->
      <div ref="favScrollbarRef" class="fav-scrollbar swiper-scrollbar"></div>
    </div>

    <!-- 지역 드롭다운 패널 -->
    <div
      v-if="showPanel === 'region'"
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
        :selected-region="props.region"
        @updateRegion="handleRegionUpdate"
        @filterCompleted="handleFilterCompleted"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.filter-scroll-section {
  display: flex;
  align-items: center; /* 지역 버튼과 칩 수직정렬 맞춤 */
  gap: rem(8px);
  padding: 0 rem(16px);
  background-color: var(--white);
  border-top: rem(1px) solid var(--whitish);
  border-bottom: rem(1px) solid var(--whitish);
  position: relative;
}

button {
  height: rem(30px); /* 지역 버튼/칩 높이 통일 */
  display: inline-flex;
  align-items: center;
  padding: 0 rem(14px);
  font-size: rem(12px);
  border: rem(1px) solid var(--grey);
  border-radius: rem(999px);
  background-color: var(--white);
  color: var(--grey);
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;

  &.active {
    background-color: var(--primary-color);
    color: var(--white);
    border: none;
  }
}

button.dropdown-button {
  position: relative;
  padding-right: rem(24px);
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: rem(8px);
    transform: translateY(-50%) rotate(45deg);
    width: rem(6px);
    height: rem(6px);
    border: solid var(--grey);
    border-width: 0 rem(1px) rem(1px) 0;
    pointer-events: none;
  }
}

.region-row {
  padding: rem(12px) 0;
  display: flex;
  align-items: center;
}

.chips-area {
  flex: 1 1 auto;
  min-width: 0;
  position: relative; /* ✅ 기준 */
  padding: rem(12px) 0; /* ✅ 바 공간 확보 */
  cursor: default;
  display: block; /* 행 전체로 */
}

.checklist-swiper {
  width: 100%;
}
.checklist-swiper :deep(.swiper-wrapper) {
  align-items: center;
}
.checklist-swiper :deep(.swiper-slide) {
  width: auto !important;
}
.slide-auto {
  display: flex;
  align-items: center;
}

/* ===== 진행바 스타일 ===== */

.fav-scrollbar {
  position: absolute;
  left: 0; /* ✅ chips-area 콘텐츠 폭과 정확히 일치 */
  right: 0;
  bottom: 0; /* ✅ chips-area의 패딩 라인(아랫변)에 딱 붙음 */
  height: rem(6px);
  border-radius: rem(999px);
  background: var(--whitish);
}
.fav-scrollbar :deep(.swiper-scrollbar-drag) {
  height: 100%;
  border-radius: inherit;
  background: var(--grey); /* 원하면 var(--primary-color) */
  min-width: rem(24px); /* 초기 0px 방지 */
}

.dropdown-panel {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}
</style>
