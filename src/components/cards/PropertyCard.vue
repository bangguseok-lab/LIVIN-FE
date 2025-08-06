<template>
  <div class="property-card">
    <div class="image-wrapper">
      <div class="image-placeholder">사진</div>
      <div v-if="isWished" class="badge">안심<br />매물</div>
    </div>

    <div class="details">
      <div class="price">전세 {{ formattedPrice }}</div>
      <div class="title">{{ title }}</div>
      <div class="info">{{ area }} / {{ supplyArea }} · {{ floor }} / {{ totalFloors }}층 · {{ direction }}</div>
      <div class="address">{{ address }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  price: Number,
  title: String,
  area: String,
  supplyArea: String,
  floor: String,
  totalFloors: String,
  direction: String,
  address: String,
  isWished: Boolean
})

const formattedPrice = `${(props.price / 10000).toFixed(1).replace('.0', '')}억 ${props.price % 10000 !== 0 ? props.price % 10000 : ''}`
</script>

<style scoped>
.property-card {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid #ddd;
}
.image-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
  flex-shrink: 0;
}
.image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #555;
  border-radius: 8px;
}
.badge {
  position: absolute;
  top: -6px;
  left: -6px;
  background-color: #2b80ff;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  padding: 4px 6px;
  border-radius: 999px;
  line-height: 1.2;
  text-align: center;
}
.details {
  margin-left: 12px;
  flex: 1;
}
.price {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}
.title {
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}
.info {
  font-size: 13px;
  color: #666;
  margin-bottom: 2px;
}
.address {
  font-size: 12px;
  color: #999;
}
</style>
