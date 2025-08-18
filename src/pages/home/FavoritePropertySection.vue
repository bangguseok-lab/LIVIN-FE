<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Parallax } from 'swiper/modules'
import { RouterLink } from 'vue-router'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import 'swiper/css'
import { defineProps, onMounted } from 'vue'
import Buttons from '@/components/common/buttons/Buttons.vue'
import SampleImg2 from '@/assets/images/home/sample-img2.png'
const props = defineProps({
  favorite: {
    type: Array,
    required: true,
    default: () => [],
  },
})
// 대체 이미지를 위한 함수 추가
const getImageUrl = fp => {
  if (fp.imageUrls.length === 0) {
    return SampleImg2
  }
  return fp.imageUrls[0].imageUrl
}
const modules = [Parallax, Pagination]
</script>
<template>
  <div
    class="favorite-box"
    :class="{ 'no-favorite-box': props.favorite.length === 0 }"
  >
    <div class="title-box">
      <div class="board-text-box">찜한 매물</div>
      <small class="sm-text-box">
        <router-link to="/favorite" class="router-text"> 더보기 </router-link>
      </small>
    </div>
    <div
      class="favorite-card-box"
      :class="{ 'no-favorite-card-box': props.favorite.length === 0 }"
    >
      <div v-if="props.favorite.length === 0" class="favorite-go-btn">
        <Buttons type="xl" togo="/search" class="property-search-router-btn">
          <span class="btn-inner">
            <span class="btn-text">
              <div class="top-text">아직 저장한 매물이 없다면?</div>
              <div class="bottom-text">매물 보러 가기</div>
            </span>
            <img
              src="@/assets/icons/home/go-to-favorite-icon.svg"
              class="btn-icon"
            />
          </span>
        </Buttons>
      </div>
      <swiper
        v-else
        :slidesPerView="1"
        :spaceBetween="20"
        :parallax="true"
        :modules="modules"
        :loop="loop"
        class="mySwiper"
        :breakpoints="{
          450: {
            slidesPerView: 2,
            spaceBetween: 20,
            loop: true,
          },
        }"
      >
        <div
          class="parallax-bg"
          slot="container-start"
          data-swiper-parallax="-23%"
        ></div>
        <swiper-slide v-for="fp in props.favorite" :key="fp.propertyId">
          <router-link
            :to="`/property/${fp.propertyId}`"
            class="router-text router-card"
          >
            <div class="card fp-box">
              <img
                :src="getImageUrl(fp)"
                class="card-img-top fp-img"
                alt="건물 이미지"
              />
              <div class="card-body">
                <p class="card-text board-text-box">
                  {{ fp.name }} <br />
                  <small class="fp-addr">{{ fp.filteringDistrictName }}</small>
                </p>
                <p class="card-text fp-description">
                  {{ fp.description }}
                </p>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mySwiper {
  width: 100%;
  height: 100%;
}

.board-text-box {
  font-weight: var(--font-weight-lg);
}

.lg-text-box {
  font-size: rem(22px);
}

.favorite-box {
  background-color: var(--white);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  border-radius: 35px 35px 0 0;
  height: rem(550px);
  margin-bottom: rem(10px);
  justify-content: space-between;
}

.no-favorite-box {
  background-color: var(--white);
  padding: 2rem 0 10rem;
  display: flex;
  flex-direction: column;
  border-radius: 35px 35px 0 0;
  height: rem(230px);
  margin-bottom: rem(10px);
  justify-content: space-between;
}

.favorite-card-box {
  height: rem(400px);
  padding-left: 2rem;
  padding-right: 2rem;
}

.no-favorite-card-box {
  height: rem(200px);
  padding-bottom: rem(20px);
  padding-left: rem(30px);
  padding-right: rem(30px);
}

@media (max-width: 399px) {
  .fp-box {
    width: 100%;
    height: 95%;
    border: 1.5px solid var(--whitish);
  }
}

@media (min-width: 400px) {
  .fp-box {
    width: 100%;
    height: 95%;
    border: 1.5px solid var(--whitish);
  }
}

@media (min-width: 449px) {
  .fp-box {
    width: 100%;
    height: 95%;
    border: 1.5px solid var(--whitish);
  }
}

.fp-img {
  height: 60%;
}

.card-text {
  font-size: rem(14px);
}

.fp-description,
.fp-addr {
  font-size: rem(11px);
  color: var(--grey);
}

.fp-description {
  height: rem(45px);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box; // 웹킷 기반 브라우저에서 멀티라인 말줄임표를 위한 속성
  -webkit-line-clamp: 3; // 3줄을 넘어가면 말줄임표
  -webkit-box-orient: vertical; // 텍스트 방향을 세로로 설정
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

.router-card {
  width: 45%;
}

.title-box {
  width: 100%;
  height: var(30px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: rem(18px);
  padding: 0.2rem 2rem;
}

:deep(.favorite-go-btn) {
  padding-top: 1.3rem;
  --primary-color: var(--purple);
  width: 100%;
  height: 100%;

  .top-text {
    font-size: 0.9rem;
    font-weight: var(--font-weight-light);
    color: var(--white);
  }
  .bottom-text {
    font-size: 1.1rem;
    font-weight: var(--font-weight-semibold);
    color: var(--white);
    margin-top: -0.3rem;
  }
}

.property-search-router-btn {
  height: rem(100px);
  margin-top: 1rem;
}

/* 슬롯 래퍼: 좌우 끝 정렬 */
.property-search-router-btn .btn-inner {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 왼쪽: 텍스트, 오른쪽: 아이콘 */
  width: 100%;
  gap: 12px;
  padding-right: rem(10px);
  padding-left: rem(10px);
}

/* 텍스트 묶음: 왼쪽 정렬 */
.property-search-router-btn .btn-text {
  display: flex;
  flex-direction: column;
  text-align: left;
  flex: 1 1 auto; /* 남는 너비를 텍스트가 차지 */
  line-height: 1.25;
}

/* 아이콘: 고정 크기, 오른쪽 */
.property-search-router-btn .btn-icon {
  width: rem(80px);
  flex: 0 0 auto;
  padding-top: rem(5px);
}
</style>
