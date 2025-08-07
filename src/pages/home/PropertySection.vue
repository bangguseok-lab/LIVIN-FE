<script setup>
import { RouterLink } from 'vue-router'
import { defineProps, onMounted } from 'vue'

const props = defineProps({
  properties: {
    type: Array,
    required: true,
    default: () => [],
  },
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
      <div class="row-box" v-for="p in props.properties">
        <div class="row-title board-text-box">{{ p.name }}</div>
        <small class="sm-text-box">
          <router-link :to="`/property/${p.propertyId}`" class="router-text">
            자세히 보기
          </router-link>
        </small>
      </div>
    </div>
    <div class="description-box">
      더 많은 매물이 궁금하시다면, 더보기를 눌러 확인해보세요
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
  height: rem(420px);
  padding: 2rem 0 1.5rem 0;
}
.property-table-box {
  width: 100%;
  height: rem(300px);
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

.description-box {
  color: var(--grey);
  font-size: rem(12px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.router-text {
  text-decoration: none;
  color: var(--grey);
}
.row-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: rem(70px);
  border-top: 1px solid rgba($color: #000000, $alpha: 0.1);

  padding: 0 2rem;
}
.row-box:last-child {
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
}
</style>
