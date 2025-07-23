<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Pagination } from 'swiper/modules'
import Buttons from '@/components/common/buttons/Buttons.vue'
import Sample from '@/assets/images/home/sample-img.png'
import { RouterLink } from 'vue-router'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import 'swiper/css' // 기본 Swiper 스타일

const nickname = localStorage.getItem('nickname')
console.log(nickname)

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
const Properties = [
  {
    id: 1,
    title: '매물 이름',
  },
  {
    id: 2,
    title: '매물 이름',
  },
  {
    id: 3,
    title: '매물 이름',
  },
  {
    id: 4,
    title: '매물 이름',
  },
]
const modules = [FreeMode, Pagination]
</script>

<template>
  <div class="Home">
    <div class="intro-box">
      {{ nickname }}님
      <br />
      <div class="board-text-box lg-text-box">
        오늘도 함께 <br />
        좋은 집을 찾아봐요!
      </div>
    </div>
    <div class="content-wrap">
      <div class="content-box">
        <div class="favorite-box">
          <div class="title-box">
            <div class="board-text-box">찜한 매물</div>
            <small class="sm-text-box">
              <router-link to="/favorite" class="router-text">
                더보기
              </router-link>
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
        <div class="property-box">
          <div class="title-box">
            <div class="board-text-box">전체 매물</div>
            <small class="sm-text-box">
              <router-link to="/search" class="router-text">
                더보기
              </router-link>
            </small>
          </div>
          <div class="property-table-box mt-2">
            <div class="row-box" v-for="p in Properties">
              <div class="row-title board-text-box">{{ p.title }}</div>
              <small class="sm-text-box">
                <router-link :to="`/search/detail/${p.id}`" class="router-text">
                  자세히 보기
                </router-link>
              </small>
            </div>
          </div>
          <div class="description-box">
            더 많은 매물이 궁금하시다면, 더보기를 눌러 확인해보세요
          </div>
        </div>
      </div>
      <div class="checklist-router-box">
        <Buttons type="xl" togo="/checklist">
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

.favorite-box,
.property-box {
  background-color: var(--white);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
}

.favorite-box {
  border-radius: 50px 50px 0 0;
  height: rem(550px);
  margin-bottom: rem(20px);
  justify-content: space-between;
}

.property-box {
  height: rem(420px);
  padding: 2rem 0 1.5rem 0;
}

.favorite-card-box {
  height: rem(400px);
  padding-bottom: rem(20px);
  padding-left: 1rem;
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
.empty-slide {
  margin: 0;
  width: rem(10px);
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

.checklist-router-box {
  padding: 0 rem(10px) rem(30px) rem(10px);
  background-color: var(--white);
  width: 100%;
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
