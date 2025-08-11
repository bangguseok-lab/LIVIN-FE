<script setup>
import RegionSelector from './RegionSelector.vue'
import Buttons from '../common/buttons/Buttons.vue'
import { defineProps, defineEmits, computed } from 'vue'

// 지역 리스트는 props로 받고, 선택된 결과만 emit
const props = defineProps({
  cities: {
    type: Array,
    required: true,
  },
  districts: {
    type: Array,
    required: true,
  },
  parishes: {
    type: Array,
    required: true,
  },
  selectedRegion: Object,
})

// RegionSelector에서 전달받은 선택 정보를 다시 외부로 emit하는 중간 다리
const emit = defineEmits(['updateRegion'])

const handleRegionUpdate = region => {
  region.final = false
  emit('updateRegion', region)
}

function complete_btn_handler() {
  const updatedRegion = { ...props.selectedRegion, final: true }
  emit('updateRegion', updatedRegion)
  emit('filterCompleted') // 선택이 완료되었다는 이벤트를 emit
}

function cancel_btn_handler() {
  const resetRegion = {
    city: null,
    district: null,
    parish: null,
    final: false,
  }
  emit('updateRegion', resetRegion)
}

const visibleDistricts = computed(() =>
  props.selectedRegion?.city ? props.districts || [] : [],
)
const visibleParishes = computed(() =>
  props.selectedRegion?.city ? props.parishes || [] : [],
)
</script>

<template>
  <div class="region-panel">
    <RegionSelector
      class="element1"
      :cities="cities"
      :districts="visibleDistricts"
      :parishes="visibleParishes"
      :selected-region="selectedRegion"
      @updateRegion="handleRegionUpdate"
    />

    <div class="region-btn-section">
      <Buttons
        label="완료"
        :is-active="true"
        type="md"
        @click="complete_btn_handler"
        class="complete-btn"
      />
      <Buttons
        label="초기화"
        :is-active="false"
        type="md"
        @click="cancel_btn_handler"
        class="cancel-btn"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.region-panel {
  background-color: var(--white);
  border-radius: 1rem;
  padding: 2rem;
  width: rem(400px);
  max-width: rem(400px);
  height: 50vh;
  border: solid var(--whitish) 1.5px;
  position: relative;
}
.element1 {
  padding-bottom: 1.5rem;
  height: 34vh;
}
.element2 {
  margin-top: 1.5rem;
  font-size: 0.9rem;
}
.region-btn-section {
  display: flex; // 버튼들을 가로로 나열
  justify-content: space-between; // 또는 center, flex-end 등 필요에 맞게 조정
  gap: rem(10px); // 버튼 사이 간격
  padding-top: 0.8rem;

  .complete-btn :deep(button) {
    background-color: var(--primary-color);
    color: var(--white);
    font-weight: var(--font-weight-medium);
    border-radius: 9px;
    width: rem(150px);
    height: rem(33px);
    font-size: 0.9rem;
  }
  .cancel-btn :deep(button) {
    background-color: var(--grey);
    color: var(--white);
    font-weight: var(--font-weight-medium);
    border-radius: 9px;
    width: rem(150px);
    height: rem(33px);
    font-size: 0.9rem;
  }
}
</style>
