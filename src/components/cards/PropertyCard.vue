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
});

const formattedPrice = `${(props.price / 1000).toFixed(0)},000`;
</script>

<template>
  <div class="property-card">
    <div class="image-placeholder">사진</div>
    <div class="details">
      <div class="price">전세 {{ formattedPrice }}</div>
      <div class="title">{{ props.title }}</div>
      <div class="info">{{ props.area }} / {{ props.supplyArea }} · {{ props.floor }} / {{ props.totalFloors }}층 · {{ props.direction }}</div>
      <div class="address">{{ props.address }}</div>
      <div class="badge">안심 매물</div>
    </div>
    <div class="heart">❤️</div>
  </div>
</template>

<style scoped>
.property-card {
  display: flex;
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 6px;
  align-items: flex-start;
  position: relative;
}
.image-placeholder {
  width: 100px;
  height: 100px;
  background-color: #aaa;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.details {
  margin-left: 12px;
  flex: 1;
}
.price {
  font-weight: bold;
}
.title,
.info,
.address {
  font-size: 14px;
  margin-top: 4px;
}
.badge {
  display: inline-block;
  background-color: #4a8378;
  color: white;
  padding: 2px 8px;
  margin-top: 6px;
  font-size: 13px;
}
.heart {
  position: absolute;
  top: 8px;
  right: 8px;
  color: red;
}
</style>
