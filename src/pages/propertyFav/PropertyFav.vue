<script setup>
import PropertyCard from '@/components/cards/PropertyCard.vue';

const propertyList = [
  {
    id: 1,
    price: 4000,
    title: '빌라 에덴4차 저층',
    area: '76㎡',
    supplyArea: '35㎡',
    floor: '저',
    totalFloors: '5',
    direction: '동향',
    address: '경기도 가평군 가평읍 읍내리 840-7'
  }
]

</script>

<template>
  <!-- slot 스타일 테스트용이라 필요에 따라 마크업이랑 스타일 수정하시면 됩니다. -->
  <div class="PropertyFav">
    <div class="test-box">
      <h1>PropertyFav</h1>
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
  height: 1400px;
}
</style>
