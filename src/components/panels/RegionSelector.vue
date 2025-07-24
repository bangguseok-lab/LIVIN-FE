<script setup>
import { ref, reactive, watch, onMounted } from 'vue'

// emit 정의
const emit = defineEmits(['updateRegion'])

// 상위에서 내려주는 지역 리스트 props
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
})

// 선택된 지역 정보를 저장
const selected = reactive({
  city: null, // 시/도 코드
  district: null, // 군/구 코드
  parish: null, // 읍/면/동 코드
})

// 각각의 지역 목록을 저장하는 상태 (초기에는 비어있음)
// const cities = ref([]) // 시/도 목록
// const districts = ref([]) // 군/구 목록
// const parishes = ref([]) // 읍/면/동 목록
// onMounted(() => {
//   cities.value = props.cities
//   districts.value = props.districts
//   parishes.value = props.parishes
// })

// watch(
//   () => props.cities,
//   val => (cities.value = val),
// )
// watch(
//   () => props.districts,
//   val => (districts.value = val),
// )
// watch(
//   () => props.parishes,
//   val => (parishes.value = val),
// )

// 시/도 선택 → emit
function selectCity(code) {
  selected.city = code
  selected.district = null
  selected.parish = null
  emit('updateRegion', { ...selected })
}

// 군/구 선택 → emit
function selectDistrict(code) {
  selected.district = code
  selected.parish = null
  emit('updateRegion', { ...selected })
}

// 읍/면/동 선택 → 최종 지역 emit
function selectParish(code) {
  selected.parish = code
  emit('updateRegion', { ...selected })
}
</script>

<template>
  <div class="region-selector">
    <div class="col">
      <div class="header">시/도</div>
      <ul class="scroll-list">
        <li
          v-for="c in props.cities"
          :key="c.code"
          :class="{ selected: selected.city === c.code }"
          @click="selectCity(c.code)"
        >
          {{ c.name }}
        </li>
      </ul>
    </div>

    <div class="col">
      <div class="header">군/구</div>
      <ul class="scroll-list">
        <li
          v-for="d in props.districts"
          :key="d.code"
          :class="{ selected: selected.district === d.code }"
          @click="selectDistrict(d.code)"
        >
          {{ d.name }}
        </li>
      </ul>
    </div>

    <div class="col">
      <div class="header">읍/면/동</div>
      <ul class="scroll-list">
        <li
          v-for="n in props.parishes"
          :key="n.code"
          :class="{ selected: selected.parish === n.code }"
          @click="selectParish(n.code)"
        >
          {{ n.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.region-selector {
  font-size: 0.9rem;
  display: flex;
  gap: 2rem;
  padding: 0.5rem;
  border: none;
}

.col {
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  font-weight: var(--font-weight-lg);
  font-size: 0.8rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  text-align: center;
}

.scroll-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
  width: 100%;
  max-height: 14rem;
  overflow-y: auto;
  border-top: 1px solid var(--whitish);
  border-bottom: 1px solid var(--whitish);
}

.scroll-list li {
  font-size: 0.8rem;
  padding: 0.4rem;
  text-align: center;
  cursor: pointer;
  color: var(--grey);
  border-bottom: 1px solid var(--whitish);
}

.scroll-list li.selected {
  color: var(--primary-color);
  font-size: 0.9rem;
  font-weight: bold;
}
</style>
