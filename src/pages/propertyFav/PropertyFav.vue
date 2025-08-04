<script setup>
import PropertyCard from '@/components/cards/PropertyCard.vue';
import { ref } from 'vue';

const propertyList = ref([
  {
    id: 1,
    price: 38000,
    title: '빌라 에덴 4차 3층',
    area: '76㎡',
    supplyArea: '35㎡',
    floor: '저',
    totalFloors: '5',
    direction: '동향',
    address: '서울시 강남구 논현1동',
    isWished: true
  },
  {
    id: 2,
    price: 13000,
    title: '빌라 에덴 4차 3층',
    area: '76㎡',
    supplyArea: '35㎡',
    floor: '저',
    totalFloors: '5',
    direction: '동향',
    address: '서울시 강남구 논현1동',
    isWished: true
  }
]);
</script>

<template>
  <div class="PropertyFav">
    <div class="test-box">
      <h1>찜한 관심매물</h1>
      <PropertyCard
        v-for="property in propertyList"
        :key="property.id"
        v-bind="property"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.PropertyFav {
  width: 100%;
  padding: 4rem 2rem;
}
.test-box {
  min-height: 800px;
}
</style>

