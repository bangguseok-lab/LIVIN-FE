<script setup>
import { usePropertyStore } from '@/stores/property'
import { defineProps, onMounted, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation' // 내비게이션 CSS 파일 임포트 확인
import 'swiper/css/pagination'
import 'swiper/css/free-mode'
import sample1 from '../../assets/images/home/sample-img1.png'
import sample2 from '../../assets/images/home/sample-img2.png'
import sample3 from '../../assets/images/home/sample-img3.png'
import badge from '../../assets/images/landing/SecureBadge.png'
import SampleOption from '../../assets/icons/property/sample-option-icon1.svg'
const props = defineProps({
  propertyId: {
    type: Number,
    required: true,
  },
})
const { kakao } = window
console.log(kakao)
const propertyOptions = [
  { id: 1, name: '에어컨', iconUrl: SampleOption },
  { id: 2, name: '세탁기', iconUrl: SampleOption },
  { id: 3, name: '냉장고', iconUrl: SampleOption },
  { id: 4, name: '옷장', iconUrl: SampleOption },
  { id: 5, name: 'TV', iconUrl: SampleOption },
  // { id: 6, name: '침대', iconUrl: SampleOption },
  // { id: 7, name: '가스레인지', iconUrl: SampleOption },
  // { id: 8, name: '전자레인지', iconUrl: SampleOption },
]

const chunkedOptions = computed(() => {
  const options = propertyOptions.length > 0 ? propertyOptions : [] // Use actual store data here
  const chunks = []
  const chunkSize = 4
  for (let i = 0; i < options.length; i += chunkSize) {
    chunks.push(options.slice(i, i + chunkSize))
  }
  return chunks
})
const imgUrls = [sample1, sample2, sample3]
const property = usePropertyStore()
const modules = [Navigation, Pagination]

const loadKakaoMap = address => {
  // 주소가 없으면 함수 실행 중단
  if (!address || !kakao) {
    console.error('주소 정보가 없거나 카카오 맵 API가 로드되지 않았습니다.')
    return
  }

  // 주소-좌표 변환 객체 생성
  const geocoder = new kakao.maps.services.Geocoder()

  // 주소로 좌표를 검색
  geocoder.addressSearch(address, (result, status) => {
    // 정상적으로 검색 완료
    console.log(status)
    if (status === kakao.maps.services.Status.OK) {
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x)
      console.log(coords)
      const mapContainer = document.getElementById('kakaomap')
      console.log(mapContainer)
      const mapOption = {
        center: coords,
        level: 3,
      }

      // 지도 생성
      const map = new kakao.maps.Map(mapContainer, mapOption)
      console.log
      // 마커 생성 및 지도에 표시
      const marker = new kakao.maps.Marker({
        map: map,
        position: coords,
      })

      // 지도의 중심을 마커 위치로 이동
      map.setCenter(coords)
    } else {
      console.error('주소 검색 실패:', status)
    }
  })
}
onMounted(() => {
  property.fetchPropertyDetails(props.propertyId)
  // 지도를 로드하는 함수를 onMounted에서 호출
  const address = '경기도 안양시 만안구 안양로 168번길 16' // props로 받은 주소 정보를 사용하도록 수정 필요
  loadKakaoMap(address)
})
</script>

<template>
  <div class="property-details-wrap">
    <div class="img-wrap">
      <swiper
        :slidesPerView="1"
        :spaceBetween="30"
        :navigation="true"
        :pagination="{ clickable: true }"
        :modules="modules"
        class="mySwiper"
      >
        <swiper-slide v-for="(img, index) in imgUrls" :key="index">
          <img :src="img" class="property-img" alt="매물 이미지" />
        </swiper-slide>
      </swiper>
    </div>
    <div class="content-wrap">
      <div class="content-box title-box">
        <div class="property-title">
          <!-- {{ property.getPropertyDetails.title }} -->
          이화빌라 201호
          <img :src="badge" alt="안심매물 뱃지" class="badge-img" />
          <!-- 매물 안전도에 따른 뱃지 부여 로직 필욘 -->
        </div>
        <div class="property-price">
          <!-- {{ property.getPropertyDetails.price }} -->
          월세 월5억/300
        </div>
        <div class="property-addr">
          <!-- {{ property.getPropertyDetails.addr }} -->
          서울시 강남구 역삼동
        </div>
        <div class="property-checklist">
          <button class="checklist-btn">항목 체크하러 가기 ></button>
          <!--클릭 이벤트 추가해서 모달 나오도록-->
        </div>
      </div>
      <div class="content-box">
        <div class="content-title-row">가격 정보</div>
        <div class="content-details">
          <div class="content-details-row">
            <div class="content-details-row-title">월세</div>
            <div class="content-details-row-content">
              <!-- {{  }} -->
              5억/300
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">관리비</div>
            <div class="content-details-row-content">
              <!-- {{  }} -->
              매월 20만원 <br />
              <br />
              기타 정보 어쩌구 저쩌구 얄리얄리얄라셩 얄라리얄라
            </div>
          </div>
        </div>
      </div>
      <div class="content-box">
        <div class="content-title-row">상세 정보</div>
        <div class="content-details">
          <div class="content-details-row">
            <div class="content-details-row-title">종류</div>
            <div class="content-details-row-content">
              <!-- {{  }} -->
              오피스텔
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">방</div>
            <div class="content-details-row-content">
              <!-- {{  }} -->
              2
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">욕실</div>
            <div class="content-details-row-content">
              <!-- {{  }} -->
              2
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">입주시기</div>
            <div class="content-details-row-content">
              <!-- {{  }} -->
              즉시 입주 가능
            </div>
          </div>
        </div>
      </div>
      <div class="content-box">
        <div class="content-title-row">옵션 정보</div>
        <div class="content-details">
          <div v-if="chunkedOptions.length" class="container-fluid p-0">
            <div
              v-for="(chunk, index) in chunkedOptions"
              :key="index"
              class="row gx-2 mb-2"
            >
              <div
                v-for="option in chunk"
                :key="option.id"
                class="col-sm-6 col-md-3 option-item"
              >
                <div
                  class="option-icon-box d-flex justify-content-center align-items-center"
                >
                  <img
                    :src="option.iconUrl"
                    :alt="option.name"
                    class="option-icon"
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted py-4">
            제공된 옵션 정보가 없습니다.
          </div>
        </div>
      </div>
      <div class="content-box">
        <div class="content-title-row">위치 및 주변 정보</div>
        <div id="kakaomap" class="content-map"></div>
      </div>
    </div>
    <div class="content-box">
      <div class="content-title-row">기타 정보</div>
      <div class="content-property-description">
        어쩌구 저쩌구 얄리얄리얄라셩 얄라리얄라 김수한무 거북이와 두루미
        삼천갑자 동방삭 치치카포 사리사리센타 워리워리 세브리깡 무두셀라 구름이
        허리케인에 담벼락 담벼락에 서생원 서생원에 고양이 고양이엔 바둑이
        바둑이는 돌돌이
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.property-details-wrap {
  width: 100%;
  max-width: rem(600px);
  margin: 0 auto;
  padding-top: rem(48px);
  padding-bottom: rem(63px);
  box-sizing: border-box;
  background-color: var(--whitish);
  display: flex;
  flex-direction: column;
  height: auto;
}

.img-wrap {
  width: 100%;
  height: rem(270px);
  border-top: 2px solid rgba($color: #000000, $alpha: 0.2);
  border-bottom: 2px solid rgba($color: #000000, $alpha: 0.2);
}

.property-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mySwiper {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

.mySwiper ::v-deep {
  .swiper-button-prev,
  .swiper-button-next {
    top: 50%;
    width: rem(40px);
    height: rem(40px);
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    transform: translateY(-50%);
    transition: background-color 0.3s ease;
    z-index: 10;
  }

  .swiper-button-prev:hover,
  .swiper-button-next:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  .swiper-button-prev {
    left: rem(10px);
  }

  .swiper-button-next {
    right: rem(10px);
  }

  .swiper-button-prev::after,
  .swiper-button-next::after {
    font-size: rem(16px);
    color: #fff;
  }
}
.content-box {
  background-color: var(--white);
  margin-bottom: rem(10px);
  padding: 2rem;
}
.content-box:last-child {
  margin-bottom: 0;
}
.title-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
}
.property-title {
  font-size: rem(24px);
  font-weight: var(--font-weight-lg);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: rem(30px);
}
.property-price {
  font-size: rem(20px);
  font-weight: var(--font-weight-lg);
}
.badge-img {
  width: rem(45px);
  height: 100%;
}
.property-addr {
  font-size: rem(15px);
  color: rgba($color: #000000, $alpha: 0.3);
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.property-checklist {
  width: 100%;
  height: rem(30px);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.checklist-btn {
  width: rem(150px);
  height: 100%;
  font-size: rem(12px);
  padding-top: rem(7px);
  padding-bottom: rem(7px);
  border: none;
  background-color: var(--primary-color);
  color: var(--white);
  border-radius: 8px;
}
.content-title-row {
  font-size: rem(20px);
  font-weight: var(--font-weight-lg);
}
.content-details {
  width: 100%;
  padding: 1.5rem;
}
.content-details-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
}
.content-details-row:last-child {
  border: none;
}
.content-details-row-title {
  font-size: rem(15px);
  font-weight: var(--font-weight-lg);
  width: 30%;
}
.content-details-row-content {
  color: rgba($color: #000000, $alpha: 0.3);
  width: 70%;
}
.option-item {
  text-align: center;
}
.option-icon-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.option-icon {
  width: rem(50px);
  height: rem(50px);
  object-fit: contain;
}
.option-name {
  font-size: rem(14px);
  color: var(--dark-gray);
  white-space: nowrap;
}
/* No need for the content-details-row-options class anymore */
.content-details-row-options {
  display: none; // or remove this class entirely
}
@media (min-width: 381px) and (max-width: 768px) {
  .option-item {
    // Bootstrap의 col-3 클래스와 유사한 효과를 줍니다.
    width: 25%;
  }
}

// 450px 이하에서는 2개씩 나오도록 설정
@media (max-width: 380px) {
  .option-item {
    // Bootstrap의 col-6 클래스와 유사한 효과를 줍니다.
    width: 50%;
  }
}

// 옵션 아이템의 flex-basis도 함께 조절해주는 것이 좋습니다.
.row {
  display: flex;
  flex-wrap: wrap;
}
.col-sm-6,
.col-md-3 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.content-property-description {
  color: rgba($color: #000000, $alpha: 0.3);
}
#kakaomap {
  width: 100%;
  height: rem(300px);
  border-radius: 20px;
}
</style>
