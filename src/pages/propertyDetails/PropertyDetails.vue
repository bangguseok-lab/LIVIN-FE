<script setup>
import { usePropertyStore } from '@/stores/property'
import { onMounted, computed, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import ChecklistModal from './ChecklistModal.vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/free-mode'
import sample1 from '../../assets/images/home/sample-img1.png'
import sample2 from '../../assets/images/home/sample-img2.png'
import sample3 from '../../assets/images/home/sample-img3.png'
import badge from '../../assets/images/landing/SecureBadge.png'
import FavoriteButton from '@/components/common/buttons/FavoriteButton.vue'

import WasherIcon from '@/assets/icons/property/washing-machine.svg'
import RefrigeratorIcon from '@/assets/icons/property/refrigerator.svg'
import AirConditionerIcon from '@/assets/icons/property/air-conditioner.svg'
import DryerIcon from '@/assets/icons/property/dryer.svg'
import MicrowaveIcon from '@/assets/icons/property/microwave-oven.svg'
import GasStoveIcon from '@/assets/icons/property/gas-stove.svg'
import InductionIcon from '@/assets/icons/property/induction-stove.svg'
import BedIcon from '@/assets/icons/property/bed.svg'
import { useRoute } from 'vue-router'
import api from '@/api/property'

const optionMap = {
  Washer: { name: '세탁기', iconUrl: WasherIcon },
  AirConditioner: { name: '에어컨', iconUrl: AirConditionerIcon },
  Refrigerator: { name: '냉장고', iconUrl: RefrigeratorIcon },
  Dryer: { name: '건조기', iconUrl: DryerIcon },
  Microwave: { name: '전자렌지', iconUrl: MicrowaveIcon },
  GasStove: { name: '가스렌지', iconUrl: GasStoveIcon },
  Induction: { name: '인덕션', iconUrl: InductionIcon },
  Bed: { name: '침대', iconUrl: BedIcon },
}

const isModalOpen = ref(false)
const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}
const { kakao } = window
const route = useRoute()
const propertyId = route.params.id

const chunkedOptions = computed(() => {
  const options = property.getPropertyDetails?.options || []
  const mappedOptions = options
    .map(optionKey => {
      return (
        optionMap[optionKey] || {
          id: optionKey,
          name: optionKey,
          iconUrl: null,
        }
      )
    })
    .filter(option => option.iconUrl !== null)

  const chunks = []
  const chunkSize = 4
  for (let i = 0; i < mappedOptions.length; i += chunkSize) {
    chunks.push(mappedOptions.slice(i, i + chunkSize))
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
    if (status === kakao.maps.services.Status.OK) {
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x)
      const mapContainer = document.getElementById('kakaomap')
      const mapOption = {
        center: coords,
        level: 3,
      }
      const map = new kakao.maps.Map(mapContainer, mapOption)
      const marker = new kakao.maps.Marker({
        map: map,
        position: coords,
      })
      map.setCenter(coords)
    } else {
      console.error('주소 검색 실패:', status)
    }
  })
}
onMounted(async () => {
  await property.fetchPropertyDetails(propertyId)

  loadKakaoMap(property.getPropertyDetails.building.roadAddress)
})

const formatPrice = (price, isRent) => {
  if (price === null || price === undefined) {
    return '가격 정보 없음'
  }
  const numberPrice = Number(price)

  if (isRent) {
    const 천 = Math.floor(numberPrice / 1000)
    const 만 = numberPrice % 1000

    let result = ''
    if (천 > 0) {
      result += `${천}천`
    }
    if (만 > 0) {
      result += ` ${만}만`
    }

    return result.trim()
  }

  // ✅ [2] 전세/보증금 포맷 → "x억 y천 z만"
  const 억 = Math.floor(numberPrice / 100000000)
  const 나머지 = numberPrice % 100000000
  const 천 = Math.floor(나머지 / 10000000)
  const 만 = Math.floor((나머지 % 10000000) / 10000)

  let result = ''
  if (억 > 0) result += `${억}억`
  if (천 > 0) result += ` ${천}천`
  if (만 > 0) result += ` ${만}만`

  return result.trim() || `${numberPrice}원`
}

const formattedPrice = computed(() => {
  const propertyDetails = property.getPropertyDetails
  if (!propertyDetails || !propertyDetails.transactionType) {
    return '가격 정보 없음'
  }
  const { transactionType, price } = propertyDetails
  if (transactionType === '전세') {
    return formatPrice(price, false)
  } else if (transactionType === '월세') {
    const [deposit, rent] = price.split('/')
    return `${formatPrice(deposit, false)}/${formatPrice(rent, true)}`
  }
  return '가격 정보 없음'
})
const handleFavoriteToggle = async (propertyId, newFavoriteStatus) => {
  if (newFavoriteStatus) {
    await api.addFavoriteProperty(propertyId)
  } else {
    await api.removeFavoriteProperty(propertyId)
  }
  await property.fetchPropertyDetails(propertyId)
}

const calculate = computed(() => {
  const propertyDetails = property.getPropertyDetails
  const total = propertyDetails.management?.reduce((acc, crr) => {
    if (crr.managementFee !== null && crr.managementFee !== undefined) {
      return acc + parseInt(crr.managementFee, 10)
    }
    return acc
  }, 0)
  if (total === 0) {
    return '관련 정보 없음'
  }
  return '매월' + formatPrice(total)
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
          <div class="property-title-inner">
            {{ property.getPropertyDetails.name }}
            <img
              v-if="property.getPropertyDetails.safe"
              :src="badge"
              alt="안심매물 뱃지"
              class="badge-img"
            />
          </div>
          <div class="favorite-btn">
            <FavoriteButton
              width="18"
              height="18"
              :isFavorite="property.getPropertyDetails.favorite"
              :propertyId="propertyId"
              @toggle-favorite="handleFavoriteToggle"
            />
          </div>
        </div>
        <div class="property-price">
          {{ formattedPrice }}
          <span
            class="transaction-type"
            v-if="property.getPropertyDetails.transactionType == '전세'"
            >전세금</span
          >
          <span
            class="transaction-type"
            v-else-if="property.getPropertyDetails.transactionType == '월세'"
            >보증금/월세</span
          >
        </div>
        <div class="property-addr">
          {{ property.getPropertyDetails.building?.roadAddress }}
        </div>
        <div class="property-checklist">
          <button class="checklist-btn" @click="openModal">
            항목 체크하러 가기 >
          </button>
          <!--클릭 이벤트 추가해서 모달 나오도록-->
        </div>
      </div>
      <ChecklistModal
        v-if="isModalOpen"
        :propertyId="propertyId"
        @close="closeModal"
      />
      <div class="content-box">
        <div class="content-title-row">가격 정보</div>
        <div class="content-details">
          <div class="content-details-row">
            <div class="content-details-row-title">
              {{ property.getPropertyDetails.transactionType }}
            </div>
            <div class="content-details-row-content">
              {{ formattedPrice }}
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">관리비</div>
            <div class="content-details-row-content">
              {{ calculate }}<br /><br />
              <div v-for="m in property.getPropertyDetails?.management">
                {{ m.managementType }}:
                {{
                  m.managementFee !== '0'
                    ? formatPrice(m.managementFee, false)
                    : '쓴 만큼'
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-box">
        <div class="content-title-row">상세 정보</div>
        <div class="content-details">
          <div class="content-details-row">
            <div class="content-details-row-title">상세 주소</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.detailAddress }}
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">종류</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.propertyType }}
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">공급/전용면적</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.supplyAreaM2 }}/{{
                property.getPropertyDetails.exclusiveAreaM2
              }}
              m<sup>2</sup>
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">해당층/총층</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.floor }}/{{
                property.getPropertyDetails.building?.totalFloors
              }}층
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">방</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.room }}
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">욕실</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.bathrooms }}
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">주실 방향</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.direction }}
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">복층 여부</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.duplexStructure ? 'O' : 'X' }}
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">입주시기</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.moveInDate }}
            </div>
          </div>
        </div>
      </div>
      <div class="content-box">
        <div class="content-title-row">단지 정보</div>
        <div class="content-details">
          <div class="content-details-row">
            <div class="content-details-row-title">우편 번호</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.building?.postcode }}
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">도로명 주소</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.building?.roadAddress }}
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">총 층수</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.building?.totalFloors }}층
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">총 세대수</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.building?.totalUnit }}
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">현관 구조</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.building?.entranceStructure }}
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">난방 구조</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.building?.heatingType }}({{
                property.getPropertyDetails.building?.heatingFuel
              }})
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">엘리베이터</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.building?.elevator ? 'O' : 'X' }}
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">주차 자리수</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.building?.numParking }}
            </div>
          </div>
          <div class="content-details-row">
            <div class="content-details-row-title">주차 가능여부</div>
            <div class="content-details-row-content">
              {{ property.getPropertyDetails.building?.parking }}
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
                :key="option.name"
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
        {{ property.getPropertyDetails.description }}
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: rem(30px);
  width: 100%;
}
.property-title-inner {
  font-size: rem(24px);
  font-weight: var(--font-weight-lg);
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
  width: 50%;
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
.transaction-type {
  font-size: rem(12px);
  color: var(--grey);
}
</style>
