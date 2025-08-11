<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import PropertyCard from '@/components/cards/PropertyCard.vue'
import Navbar from '@/components/layouts/Navbar.vue'

// todo: 전체 리스트 개수 가져오기
</script>

<template>
  <!-- slot 스타일 테스트용이라 필요에 따라 마크업이랑 스타일 수정하시면 됩니다. -->
  <div class="PropertyManage">
    <div class="propertyManage-title">
      <p>닉네임 님이</p>
      <p>등록하신 매물 정보예요</p>
    </div>
    <div class="propertyManage-list-container">
      <p class="propertyManage-list-count">총 5건</p>
      <div v-for="item in 15" :key="item.id">
        <PropertyCard
          :id="1"
          price="38000"
          title="빌라 에덴4차 저층"
          area="76m²"
          supplyArea="35m²"
          floor="저"
          totalFloors="5"
          direction="동향"
          address="서울시 강남구 논현동"
          isWished="false"
        />
      </div>
    </div>
  </div>

  <Navbar />
</template>

<style scoped lang="scss">
.PropertyManage {
  width: 100%;
  padding-top: 5rem;
  padding-bottom: 5rem;
  background-color: var(--white);
  padding: 6rem 2rem 0;
}
</style>
