<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Pagination } from 'swiper/modules'
import { RouterLink } from 'vue-router'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import 'swiper/css' // 기본 Swiper 스타일
import Sample from '@/assets/images/home/sample-img.png'

const favoriteProperties = [
  {
    id: 1,
    img: Sample,
    title: '매물 이름',
    addr: '매물 주소',
    description:
      '매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명',
  },
  {
    id: 2,
    img: Sample,
    title: '매물 이름',
    addr: '매물 주소',
    description:
      '매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명',
  },
  {
    id: 3,
    img: Sample,
    title: '매물 이름',
    addr: '매물 주소',
    description:
      '매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명 매물 설명',
  },
]

const modules = [FreeMode, Pagination]
</script>
<template>
  <div class="favorite-box">
    <div class="title-box">
      <div class="board-text-box">찜한 매물</div>
      <small class="sm-text-box">
        <router-link to="/favorite" class="router-text"> 더보기 </router-link>
      </small>
    </div>
    <div class="favorite-card-box">
      <swiper
        :slidesPerView="2"
        :spaceBetween="170"
        :freeMode="true"
        :modules="modules"
        :loop="true"
        class="mySwiper"
      >
        <swiper-slide v-for="fp in favoriteProperties" :key="index">
          <router-link :to="`/favorite/${fp.id}`" class="router-text">
            <div class="card fp-box">
              <img
                :src="fp.img"
                class="card-img-top fp-img"
                alt="건물 이미지"
              />
              <div class="card-body">
                <p class="card-text board-text-box">
                  {{ fp.title }} <br />
                  <small class="fp-addr">{{ fp.addr }}</small>
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
  border-radius: 50px 50px 0 0;
  height: rem(550px);
  margin-bottom: rem(20px);
  justify-content: space-between;
}
.favorite-card-box {
  height: rem(400px);
  padding-bottom: rem(20px);
  padding-left: 1rem;
  padding-right: 1rem;
}
@media (max-width: 399px) {
  .fp-box {
    width: rem(230px);
    height: 95%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
}
@media (min-width: 400px) {
  .fp-box {
    width: rem(250px);
    height: 95%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
}
@media (min-width: 449px) {
  .fp-box {
    width: rem(300px);
    height: 95%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
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
.title-box {
  width: 100%;
  height: var(30px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: rem(18px);
  padding: 0 2rem;
}
</style>
