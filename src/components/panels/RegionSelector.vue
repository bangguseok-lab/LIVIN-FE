<script setup>
import { ref, reactive, watch, onMounted } from 'vue'

// 부모 컴포넌트로 지역 선택 결과 전달
const emit = defineEmits(['updateRegion'])

// 선택된 지역 정보를 저장
const selected = reactive({
  city: null, // 시/도 코드
  district: null, // 군/구 코드
  parish: null, // 읍/면/동 코드
})

// 각각의 지역 목록을 저장하는 상태 (초기에는 비어있음)
const cities = ref([]) // 시/도 목록
const districts = ref([]) // 군/구 목록
const parishes = ref([]) // 읍/면/동 목록

// 1. 시/도 목록 로드 함수 (onMounted 시 호출)
async function loadCities() {
  // 테스트용 더미 데이터
  cities.value = [
    { code: '11', name: '서울' },
    { code: '26', name: '부산' },
    { code: '27', name: '대구' },
    { code: '28', name: '인천' },
    { code: '29', name: '광주' },
    { code: '30', name: '대전' },
    { code: '31', name: '울산' },
    { code: '36', name: '세종' },
    { code: '41', name: '경기' },
    { code: '42', name: '강원' },
    { code: '43', name: '충북' },
    { code: '44', name: '충남' },
    { code: '45', name: '전북' },
    { code: '46', name: '전남' },
    { code: '47', name: '경북' },
    { code: '48', name: '경남' },
    { code: '50', name: '제주' },
  ]
}

// 2. 시/도 선택 시 --> 군/구 목록 로드
async function loadDistricts(cityCode) {
  // 테스트용 더미 데이터
  districts.value =
    cityCode === '11'
      ? [
          { code: '11680', name: '강남구' },
          { code: '11740', name: '강동구' },
          { code: '11305', name: '강북구' },
          { code: '11500', name: '강서구' },
          { code: '11620', name: '관악구' },
          { code: '11215', name: '광진구' },
          { code: '11530', name: '구로구' },
          { code: '11545', name: '금천구' },
          { code: '11350', name: '노원구' },
          { code: '11320', name: '도봉구' },
          { code: '11230', name: '동대문구' },
          { code: '11590', name: '동작구' },
          { code: '11440', name: '마포구' },
          { code: '11410', name: '서대문구' },
          { code: '11650', name: '서초구' },
          { code: '11200', name: '성동구' },
          { code: '11290', name: '성북구' },
          { code: '11710', name: '송파구' },
          { code: '11470', name: '양천구' },
          { code: '11560', name: '영등포구' },
          { code: '11170', name: '용산구' },
          { code: '11380', name: '은평구' },
          { code: '11110', name: '종로구' },
          { code: '11140', name: '중구' },
          { code: '11260', name: '중랑구' },
        ]
      : [
          { code: '26110', name: '해운대구' },
          { code: '26290', name: '수영구' },
        ]
}

// 3. 군/구 선택 시 --> 읍/면/동 목록 로드
async function loadparishes(districtCode) {
  // 테스트용 더미 데이터
  parishes.value =
    districtCode === '11680'
      ? [
          { code: '11680101', name: '신사동' },
          { code: '11680102', name: '논현1동' },
          { code: '11680103', name: '논현2동' },
          { code: '11680104', name: '압구정동' },
          { code: '11680105', name: '청담동' },
          { code: '11680106', name: '삼성1동' },
          { code: '11680107', name: '삼성2동' },
          { code: '11680108', name: '대치1동' },
          { code: '11680109', name: '대치2동' },
          { code: '11680110', name: '대치4동' },
          { code: '11680111', name: '역삼1동' },
          { code: '11680112', name: '역삼2동' },
          { code: '11680113', name: '도곡1동' },
          { code: '11680114', name: '도곡2동' },
          { code: '11680115', name: '개포1동' },
          { code: '11680116', name: '개포2동' },
          { code: '11680117', name: '개포3동' },
          { code: '11680118', name: '개포4동' },
          { code: '11680119', name: '일원본동' },
          { code: '11680120', name: '일원1동' },
          { code: '11680121', name: '수서동' },
          { code: '11680122', name: '세곡동' },
        ]
      : [
          { code: '26110101', name: '우동' },
          { code: '26110102', name: '중동' },
        ]
}

// 컴포넌트 마운트 시 시/도 데이터를 로드함
onMounted(loadCities)

// 선택된 시/도가 바뀌면 --> 군/구 목록 갱신
watch(
  () => selected.city,
  async code => {
    selected.district = null
    selected.parish = null
    parishes.value = []
    if (code) await loadDistricts(code)
  },
)

// 선택된 군/구가 바뀌면 --> 읍/면/동 목록 갱신
watch(
  () => selected.district,
  async code => {
    selected.parish = null
    if (code) await loadparishes(code)
  },
)

// 최종적으로 읍/면/동이 선택되면 --> 부모 컴포넌트로 emit
watch(
  () => selected.parish,
  name => {
    emit('updateRegion', { ...selected })
    console.log('[RegionSelector] 선택된 지역:', selected)
  },
)
</script>

<template>
  <div class="region-selector">
    <div class="col">
      <div class="header">시/도</div>
      <ul class="scroll-list">
        <li
          v-for="c in cities"
          :key="c.code"
          :class="{ selected: selected.city === c.code }"
          @click="selected.city = c.code"
        >
          {{ c.name }}
        </li>
      </ul>
    </div>

    <div class="col">
      <div class="header">군/구</div>
      <ul class="scroll-list">
        <li
          v-for="d in districts"
          :key="d.code"
          :class="{ selected: selected.district === d.code }"
          @click="selected.district = d.code"
        >
          {{ d.name }}
        </li>
      </ul>
    </div>

    <div class="col">
      <div class="header">읍/면/동</div>
      <ul class="scroll-list">
        <li
          v-for="n in parishes"
          :key="n.code"
          :class="{ selected: selected.parish === n.code }"
          @click="selected.parish = n.code"
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
