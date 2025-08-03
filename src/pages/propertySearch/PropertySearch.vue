<script setup>
import PropertyCard from '@/components/cards/PropertyCard.vue';
import { ref } from 'vue';

const propertyList = ref([
  {
    id: 1,
    price: 4000, // 만 원 단위 → 4,000만원 = 0.4억
    dealType: '전세',
    isWished: false,
    title: '빌라 에덴4차 저층',
    area: '76㎡',
    supplyArea: '35㎡',
    floor: '저',
    totalFloors: '5',
    direction: '동향',
    address: '경기도 가평군 가평읍 읍내리 840-7'
  }
])
</script>

<template>
  <div class="PropertySearch">
    <div class="test-box">
      <h1>PropertySearch Page</h1>
      <PropertyCard
        v-for="property in propertyList"
        :key="property.id"
        v-bind="property"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.PropertySearch {
  width: 100%;
  padding: 4rem 2rem;
}

.test-box {
  min-height: 800px;
}
</style>
