<script setup>
import { reactive, watch, ref, nextTick } from 'vue'

// emit 정의
// 상위 컴포넌트에 선택된 지역 정보를 전달하기 위한 emit 함수 선언 (이벤트 이름: updateRegion)
const emit = defineEmits(['updateRegion'])

// 상위에서 내려주는 지역 리스트 props
// 외부로부터 3가지 지역 목록을 props로 받습니다
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
  selectedRegion: {
    type: Object,
    required: false,
    default: () => ({ city: null, district: null, parish: null }),
  },
})

// 선택된 지역 정보를 저장
// 현재 사용자가 선택한 지역 코드들을 저장하는 반응형 상태 객체
const selected = reactive({
  city: null, // 시/도 코드
  district: null, // 군/구 코드
  parish: null, // 읍/면/동 코드
})

watch(
  () => props.selectedRegion,
  val => {
    if (!val) return
    selected.city = val.city || null
    selected.district = val.district || null
    selected.parish = val.parish || null
  },
  { immediate: true, deep: true }, // 이 부분 중요!
)

// 시/도 선택 → 상위 컴포넌트로 현재 선택 정보 emit
// 하위 지역(군/구, 읍/면/동)은 초기화
function selectCity(code) {
  selected.city = code
  selected.district = null
  selected.parish = null
  emit('updateRegion', { ...selected })
}

// 군/구 선택 → 읍/면/동 초기화 → emit
function selectDistrict(code) {
  selected.district = code === '__NONE__' ? null : code
  selected.parish = null
  emit('updateRegion', { ...selected })
}

// 읍/면/동 선택 → 최종 지역 emit
function selectParish(code) {
  selected.parish = code
  emit('updateRegion', { ...selected })
}

const cityListRef = ref(null)
const districtListRef = ref(null)
const parishListRef = ref(null)

async function scrollToSelection() {
  await nextTick()
  const alignBottom = ul => {
    if (!ul) return
    const target = ul.querySelector('li.selected') || ul.querySelector('li')
    if (!target) return
    const margin = 6 // 아래 여백 조절
    const desired =
      target.offsetTop - (ul.clientHeight - target.clientHeight) + margin
    const max = Math.max(0, ul.scrollHeight - ul.clientHeight)
    ul.scrollTop = Math.max(0, Math.min(desired, max))
  }
  alignBottom(cityListRef.value)
  alignBottom(districtListRef.value)
  alignBottom(parishListRef.value)
}

defineExpose({ scrollToSelection })
</script>

<template>
  <div class="region-selector">
    <div class="col">
      <div class="header">시/도</div>
      <ul class="scroll-list" ref="cityListRef">
        <!-- 
         시/도 목록을 순회
         클릭 시 selectCity 호출
         현재 선택된 항목은 class selected 적용 
        -->
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

    <!-- 위와 동일한 구조. 각각 props.districts, props.parishes 기반으로 렌더링 -->
    <div class="col">
      <div class="header">시/군/구</div>
      <ul class="scroll-list" ref="districtListRef">
        <li
          v-for="d in props.districts"
          :key="d.code"
          :class="{
            selected: d.code !== '__NONE__' && selected.district === d.code,
            none: d.code === '__NONE__',
          }"
          @click="selectDistrict(d.code)"
        >
          {{ d.name }}
        </li>
      </ul>
    </div>

    <div class="col">
      <div class="header">읍/면/동</div>
      <ul class="scroll-list" ref="parishListRef">
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

<style scoped lang="scss">
.region-selector {
  font-size: 0.9rem;
  display: flex;
  gap: 2rem;
  padding: 0.5rem;
  border: none;
}

.col {
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
  width: 110%;
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
.scroll-list li.none {
  color: var(--grey);
  font-weight: normal;
}
</style>
