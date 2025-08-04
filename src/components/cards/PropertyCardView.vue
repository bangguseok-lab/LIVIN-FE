<script setup>
import PropertyCard from '@/components/cards/PropertyCard.vue'
</script>

<template>
  <div>
    <h1>매물 카드</h1>
    <PropertyCard
      :id: 1,
      price="38000"
      title="빌라 에덴4차 저층"
      area="76m²"
      supplyArea="35m²"
      floor="저"
      totalFloors="5"
      direction="동향"
      address="서울시 강남구 논현동"
      isWished="true"
    />
  </div>
</template>
