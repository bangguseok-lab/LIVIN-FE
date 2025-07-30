<template>
  <div>
    <h1>매물 카드</h1>
    <PropertyCard
      :price="4000"
      title="빌라 에덴4차 저층"
      area="76"
      supplyArea="35m²"
      floor="저"
      totalFloors="5"
      direction="동향"
      address="경기도 가평군 가평읍 읍내리 840-7"
    />
  </div>
</template>

<script setup>
import PropertyCard from '@/components/Card/PropertyCard.vue'
</script>
