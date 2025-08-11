<script setup>
import { useRouter } from 'vue-router'

import PropertyCard from '@/components/cards/PropertyCard.vue'
import Navbar from '@/components/layouts/Navbar.vue'

// todo: 전체 리스트 개수 가져오기
const router = useRouter()

const goToAppliedList = () => {
  router.push({ name: 'propertyAdd' })
}
</script>

<template>
  <div class="PropertyManage">
    <div class="propertyManage-title">
      <p>닉네임님이</p>
      <p>등록하신 매물 정보예요</p>
    </div>

    <div class="propertyManage-list-header">
      <button class="cta-btn" @click="goToAppliedList">
        매물 등록하러 가기
        <span class="chev">›</span>
      </button>
      <p class="propertyManage-list-count">총 5건</p>
    </div>

    <div class="propertyManage-list-container">
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
.propertyManage-title {
  font-size: 1.4rem;
  margin-bottom: 1.8rem;
}

p {
  margin: 0;
  font-weight: 800;
}

.propertyManage-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.cta-btn {
  border: none;
  outline: none;
  background: var(--primary-color);
  color: var(--white);
  padding: 0.5rem 0.9rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  white-space: nowrap;
}

.propertyManage-list-count {
  font-size: 0.8rem;
  color: var(--grey);
  font-weight: 400;
}
</style>
