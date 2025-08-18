<script setup>
import { defineProps, computed } from 'vue'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import SampleImg1 from '@/assets/images/home/sample-img1.png'
const props = defineProps({
  properties: {
    type: Array,
    required: true,
    default: () => [],
  },
  propertyMessage: {
    type: String,
  },
})
const getImageUrl = p => {
  if (p.imageUrls.length === 0) {
    console.log(1)
    return SampleImg1
  }
  return p.imageUrls
}
const formattedMessage = computed(() => {
  return props.propertyMessage
    ? props.propertyMessage.replace(/\n/g, '<br>')
    : ''
})
</script>
<template>
  <div class="property-box">
    <div class="title-box">
      <div class="board-text-box">전체 매물</div>
      <small class="sm-text-box">
        <router-link to="/search" class="router-text"> 더보기 </router-link>
      </small>
    </div>

    <div class="property-table-box mt-2">
      <p
        v-if="formattedMessage"
        class="property-message"
        v-html="formattedMessage"
      ></p>
      <div class="row-box" v-for="p in props.properties">
        <PropertyCard
          :propertyId="p.propertyId"
          :transactionType="p.transactionType"
          :price="p.jeonseDeposit ? p.jeonseDeposit : p.monthlyDeposit"
          :monthlyRent="p.monthlyRent"
          :title="p.name"
          :imageUrls="getImageUrl(p)"
          :propertyType="p.propertyType"
          :detailAddress="p.detailAddress"
          :exclusiveArea="p.exclusiveAreaM2"
          :supplyArea="p.supplyAreaM2"
          :floor="p.floor"
          :totalFloors="p.totalFloors"
          :direction="p.mainDirection"
          :address="p.roadAddress"
          :isFavorite="p.isFavorite"
          :isSafe="p.isSafe"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.board-text-box {
  font-weight: var(--font-weight-lg);
}

.lg-text-box {
  font-size: rem(22px);
}
.property-box {
  background-color: var(--white);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  height: auto;
  padding: 2rem 0 1.5rem 0;
}
.property-table-box {
  width: 100%;
  height: auto;
  padding-bottom: rem(20px);
  padding: 0 1rem;
}

.title-box {
  width: 100%;
  height: var(30px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: rem(18px);
  padding: 0 2rem;
}

.sm-text-box {
  color: var(--grey);
  font-size: rem(12px);
}

.router-text {
  text-decoration: none;
  color: var(--grey);
}
.row-box {
  width: 100%;
  height: auto;
  padding: 0 2rem;
}
.property-message {
  padding: 1rem 1rem;
  color: var(--grey);
  font-weight: var(--font-weight-regular);
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
}
</style>
