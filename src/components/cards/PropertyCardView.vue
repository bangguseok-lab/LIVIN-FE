<script setup>
import PropertyCard from '@/components/cards/PropertyCard.vue'
</script>

<template>
  <div class="card-test-page">
    <h1 class="card-test-title">매물 카드 컴포넌트 테스트</h1>

    <PropertyCard
      :propertyId="1"
      transactionType="MONTHLY_RENT"
      :price="24000000"
      :monthlyRent="1400000"
      title="마포 투룸"
      :imageUrls="[{ imageUrl: '/images/sample-property.jpg' }]"
      propertyType="투룸"
      detailAddress="103호"
      exclusiveArea="18.9"
      supplyArea="22.7"
      floor="1"
      totalFloors="3"
      direction="서"
      address="서울특별시 마포구 토정로3길 13"
      :isFavorite="true"
      :isSafe="true"
      :mortgage="false"
      :ownerMatch="true"
      :illegalBuilding="false"
      :jeonseRate="72.5"
    />
  </div>
</template>

<style scoped lang="scss">
.card-test-page {
  padding-top: 60px;
}

.card-test-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}
</style>
