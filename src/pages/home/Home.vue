<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import Buttons from '@/components/common/buttons/Buttons.vue'
import FavoritePropertySection from './FavoritePropertySection.vue'
import PropertySection from './PropertySection.vue'
import { usePropertyStore } from '@/stores/property'
import { onMounted } from 'vue'

const property = usePropertyStore()
onMounted(() => {
  const favoriteParams = {
    limit: 3,
    desc: 'date',
  }
  const propertiesPrams = {
    limit: 4,
    desc: 'date',
  }
  property.fetchFavoriteProperties(favoriteParams)
  property.fetchProperties(propertiesPrams)
})

const nickname = localStorage.getItem('nickname')
</script>

<template>
  <div class="Home">
    <div class="intro-box">
      {{ nickname }}님,
      <br />
      <div class="board-text-box lg-text-box">
        오늘도 함께 <br />
        좋은 집을 찾아봐요!
      </div>
    </div>
    <div class="content-wrap">
      <div class="content-box">
        <favorite-property-section :favorite="property.getFavorite" />
        <property-section :properties="property.getPropertiesList" />
      </div>
      <div class="checklist-router-box">
        <Buttons type="xl" togo="/checklist" class="checklist-router-btn">
          <div class="top-text">
            나만의 공간을 위한 모든 준비, 지금 여기서 시작하세요
          </div>
          <div class="bottom-text">나만의 체크리스트 만들기</div>
        </Buttons>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mySwiper {
  width: 100%;
  height: 100%;
}

.Home {
  width: 100%;
  padding: 4rem 0;
  background-color: var(--primary-color);
  display: flex;
  flex-direction: column;
}

.intro-box {
  color: white;
  margin-top: rem(100px);
  padding: 0 2rem;
}

.board-text-box {
  font-weight: var(--font-weight-lg);
}

.lg-text-box {
  font-size: rem(22px);
}

.content-wrap {
  width: 100%;
  height: auto;
  background-color: var(--whitish);
  border-radius: 50px 50px 0 0;
  margin-top: rem(100px);
  margin-bottom: rem(-20px);
}

.content-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.checklist-router-box {
  padding: 0 rem(10px) rem(30px) rem(10px);
  background-color: var(--white);
  width: 100%;
}

.checklist-router-btn {
  height: rem(100px);
}
</style>
