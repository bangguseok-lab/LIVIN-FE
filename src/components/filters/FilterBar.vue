<script setup>
import {
  ref,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  computed,
  reactive,
} from 'vue'

import FilterButton from './FilterButton.vue'
import Buttons from '@/components/common/buttons/Buttons.vue'
import DealTypePanel from '@/components/panels/DealTypePanel.vue'
import RegionPanel from '@/components/panels/RegionPanel.vue'
import PricePanel from '@/components/panels/PricePanel.vue'

//거래유형 선택 상태 관리
const dealTypeSelected = ref([])

// 거래유형 패널에서 선택된 항목 처리
function handleDealTypeSelect(selected) {
  dealTypeSelected.value = selected
  emit('update:dealType', selected) // ← 이 줄은 FilterView에서 v-model로 받고 싶을 때
}

// Props 및 Emits 정의
// 부모로부터 전달받는 props
const props = defineProps({
  mode: String,
  checklistItems: { type: Array, default: () => [] },
  selected: String, // 체크리스트에서 선택된 항목
  onlySecure: Boolean, // 안심 매물 체크 여부
  dealType: { type: Array, default: () => [] },
  deposit: { type: Object, default: () => ({ min: null, max: null }) },
  monthly: { type: Object, default: () => ({ min: null, max: null }) },
  regionData: {
    type: Object,
    default: () => ({
      cities: [],
      districts: [],
      parishes: [],
    }),
  },
})

const selectedRegion = ref({
  city: null,
  district: null,
  parish: null,
})

function handleRegionUpdate(region) {
  selectedRegion.value = region
  emit('update:region', region)
}

// 상태 동기화를 위한 반응형 변수
const deposit = reactive({ ...props.deposit })
const monthly = reactive({ ...props.monthly })

// 부모로 전달할 이벤트
const emit = defineEmits([
  'update:selected',
  'update:onlySecure',
  'update:dealType',
  'update:deposit',
  'update:monthly',
  'update:region',
])

// 기본 상태 초기화
const onlySecure = ref(props.onlySecure ?? false)
const isGeneralActive = ref(props.selected === '일반 매물')
const isFavoriteActive = ref(props.selected === '관심 매물')

// 패널 상태 및 위치 관리
const activePanel = ref(null)
const panelPosition = ref({ left: 0, top: 0 })

// 모드가 변경되면 패널 닫기
watch(
  () => props.mode,
  () => {
    activePanel.value = null
  },
)

// 보증금/월세 변경 시 부모로 전달 (v-model 연동)
watch(deposit, val => emit('update:deposit', val), { deep: true })
watch(monthly, val => emit('update:monthly', val), { deep: true })

// 드롭다운 패널 열기/닫기
function togglePanel(event, panelKey) {
  if (activePanel.value === panelKey) {
    activePanel.value = null
    return
  }

  activePanel.value = panelKey

  // 클릭 위치 기준으로 패널 위치 조정
  nextTick(() => {
    const rect = event.currentTarget.getBoundingClientRect()
    console.log('📍 버튼 위치 정보:')
    console.log('left:', rect.left)
    console.log('top:', rect.top)
    console.log('bottom:', rect.bottom)
    console.log('width:', rect.width)
    console.log('height:', rect.height)
    console.log('window.scrollY:', window.scrollY)
    console.log('window.innerWidth:', window.innerWidth)

    panelPosition.value =
      props.mode === 'favorite'
        ? {
            left: window.innerWidth / 2 - 100,
            top: rect.bottom - 200 + window.scrollY - 8,
          }
        : {
            left: window.innerWidth / 2 - 100,
            top: rect.bottom + window.scrollY + 8,
          }
    console.log('📦 패널 위치 정보:')
    console.log('left:', panelPosition.value.left)
    console.log('top:', panelPosition.value.top)
  })
}

// 외부 클릭 시 패널 닫기
function handleClickOutside(event) {
  const panelEl = document.querySelector('.panel-section')
  const buttonsEl =
    document.querySelector('.filter-buttons') ||
    document.querySelector('.scrollable-checklist')
  if (
    panelEl &&
    !panelEl.contains(event.target) &&
    buttonsEl &&
    !buttonsEl.contains(event.target)
  ) {
    activePanel.value = null
  }
}

// 전역 클릭 리스너 등록/해제
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Checklist 모드 탭 전환
function selectGeneral() {
  isGeneralActive.value = true
  isFavoriteActive.value = false
  emit('update:selected', '일반 매물')
}

function selectFavorite() {
  isGeneralActive.value = false
  isFavoriteActive.value = true
  emit('update:selected', '관심 매물')
}

// onlySecure 상태 동기화
watch(onlySecure, val => {
  emit('update:onlySecure', val)
})

// 패널 컴포넌트 동적 지정
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
  <div class="filter-bar">
    <!-- Search 모드 -->
    <template v-if="mode === 'search'">
      <!-- 드롭다운 버튼 영역 -->
      <div class="dropdown-section">
        <div class="filter-buttons">
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

          <!-- 선택된 필터에 따른 패널 렌더링 -->
          <div class="panel-section" v-if="activePanel">
            <component
              :is="currentPanelComponent"
              :selected="dealTypeSelected"
              @select="handleDealTypeSelect"
              :deposit="deposit"
              :monthly="monthly"
              @update:deposit="val => Object.assign(deposit, val)"
              @update:monthly="val => Object.assign(monthly, val)"
              :cities="props.regionData.cities"
              :districts="props.regionData.districts"
              :parishes="props.regionData.parishes"
              @updateRegion="handleRegionUpdate"
            />
          </div>
        </div>
      </div>

      <!-- 안심 매물 체크박스 영역 -->
      <div class="secure-option" :class="{ active: onlySecure }">
        <span class="secure-label">안심 매물만 보기</span>
        <input
          type="checkbox"
          class="secure-checkbox"
          v-model="onlySecure"
          @click.stop
        />
      </div>
    </template>

    <!-- Favorite 모드인 경우 -->
    <template v-else-if="mode === 'favorite'">
      <!-- 스크롤 가능한 체크리스트 버튼들 -->
      <div class="scrollable-checklist">
        <FilterButton
          label="지역"
          panelKey="region"
          :isActive="activePanel === 'region'"
          class="region-in-favorite"
          @click="togglePanel"
        />
        <button
          v-for="item in checklistItems"
          :key="item"
          :class="{ active: selected === item }"
          @click="$emit('update:selected', item)"
        >
          {{ item }}
        </button>
      </div>
      <!-- 패널 렌더링 -->
      <div
        class="panel-section"
        :style="{
          left: panelPosition.left + 'px',
          top: panelPosition.top + 'px',
        }"
        v-if="activePanel"
      >
        <component
          :is="currentPanelComponent"
          :cities="props.regionData.cities"
          :districts="props.regionData.districts"
          :parishes="props.regionData.parishes"
          @updateRegion="handleRegionUpdate"
        />
      </div>

      <!-- 안심 매물 체크박스 -->
      <div class="secure-option" :class="{ active: onlySecure }">
        <span class="secure-label">안심 매물만 보기</span>
        <input
          type="checkbox"
          class="secure-checkbox"
          v-model="onlySecure"
          @click.stop
        />
      </div>
    </template>

    <!-- Checklist 모드 -->
    <template v-else-if="mode === 'checklist'">
      <div class="checklist-tab-buttons">
        <Buttons
          v-model:is-active="isGeneralActive"
          type="property"
          label="일반 매물"
          @click="selectGeneral"
        />
        <Buttons
          v-model:is-active="isFavoriteActive"
          type="property"
          label="관심 매물"
          @click="selectFavorite"
        />
      </div>

      <!-- 드롭다운 버튼 영역 -->
      <div class="dropdown-section">
        <div class="filter-buttons">
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

          <!-- 패널 렌더링 -->
          <div class="panel-section" v-if="activePanel">
            <component
              :is="currentPanelComponent"
              :selected="dealTypeSelected"
              @select="handleDealTypeSelect"
              :deposit="deposit"
              :monthly="monthly"
              @update:deposit="val => Object.assign(deposit, val)"
              @update:monthly="val => Object.assign(monthly, val)"
              :cities="props.regionData.cities"
              :districts="props.regionData.districts"
              :parishes="props.regionData.parishes"
              @updateRegion="handleRegionUpdate"
            />
          </div>
        </div>
      </div>

      <!-- 안심 매물 체크박스 -->
      <div class="secure-option" :class="{ active: onlySecure }">
        <span class="secure-label">안심 매물만 보기</span>
        <input
          type="checkbox"
          class="secure-checkbox"
          v-model="onlySecure"
          @click.stop
        />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.filter-bar {
  width: 100%;
  max-width: rem(535px);
  min-width: rem(375px);
  box-sizing: border-box;
  position: relative;

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
      position: relative; // 기준 요소로 만듦
    }
  }

  .secure-option-section {
    background-color: var(--white);
    padding: rem(16px);
    border-bottom: rem(1px) solid var(--whitish);
  }

  .secure-option {
    height: rem(56px);
    padding: rem(12px) rem(30px);
    border-bottom: rem(1px) solid var(--whitish);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: rem(6px);
    font-size: 14px;
    color: var(--grey);

    .secure-label {
      cursor: default;
    }

    input.secure-checkbox {
      width: rem(16px);
      height: rem(16px);
      border-radius: rem(4px);
      border: rem(1px) solid var(--grey);
      accent-color: var(--primary-color);
      cursor: pointer;
    }

    &.active {
      color: var(--primary-color);
    }
  }

  .scrollable-checklist {
    display: flex;
    gap: rem(10px);
    overflow-x: auto;
    padding: rem(12px) rem(16px);
    background-color: var(--white);
    scrollbar-width: none;
    border-top: rem(1px) solid var(--whitish);
    border-bottom: rem(1px) solid var(--whitish);

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
    }
    .region-in-favorite {
      width: rem(100px);
      height: rem(36px);
      font-size: rem(13px);
      font-weight: 500;
      flex-shrink: 0; // 스크롤 영역에서 줄어들지 않게
    }
  }

  .checklist-tab-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: rem(100px);
    padding: rem(8px) 0;
    border-top: rem(1px) solid var(--whitish);
  }
  .panel-section {
    position: absolute;
    top: 100%; // 버튼 아래에 붙이기
    left: 50%; // 가로 중앙
    transform: translateX(-50%);
    z-index: 1000;
    margin-top: rem(8px); // 여백
  }
}
</style>
