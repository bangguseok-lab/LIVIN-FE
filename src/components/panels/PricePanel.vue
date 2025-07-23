<script setup>
import RangeSelector from './RangeSelector.vue'

// 백엔드 연결
import { ref } from 'vue'
import axios from 'axios'
const depositRange = ref({ min: null, max: null }) // 보증금
const monthlyRange = ref({ min: null, max: null }) //월세

// 필터 적용 버튼을 누르면 호출 (필터 적용 버튼이 없어서 현재 오류나용 버튼 추가시 오류 사라짐)
const applyFilters = async () => {
  try {
    const res = await axios.get('/api/properties', {
      params: {
        depositMin: depositRange.value.min,
        depositMax: depositRange.value.max,
        monthlyMin: monthlyRange.value.min,
        monthlyMax: monthlyRange.value.max,
      },
    })

    console.log('필터링된 매물:', res.data)
    // -- 여기에 매물 리스트 상태 저장 및 화면 렌더링 로직 추가 --
  } catch (err) {
    console.error('필터 요청 실패:', err)
  }
}
</script>

<template>
  <div class="price-panel">
    <RangeSelector
      title="보증금"
      description="description"
      class="element1"
      :numberList="[
        5000, 6000, 7000, 8000, 9000, 10000, 20000, 30000, 40000, 50000, 60000,
        70000, 80000, 90000, 100000,
      ]"
      @updateRange="range => (depositRange.value = range)"
    />
    <RangeSelector
      title="월세"
      description="description"
      class="element2"
      :numberList="[
        10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600,
      ]"
      @updateRange="range => (monthlyRange.value = range)"
    />
    <!-- 필터 적용 버튼 삽입 -->
  </div>
</template>

<style scoped>
.price-panel {
  background-color: var(--white);
  border-radius: 1rem;
  padding: 2rem;
  width: rem(400px);
  max-width: rem(500px);
  border: solid var(--whitish) 1.5px;
  position: relative;
}
.element1 {
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--whitish);
}
.element2 {
  margin-top: 1.5rem;
}
</style>
