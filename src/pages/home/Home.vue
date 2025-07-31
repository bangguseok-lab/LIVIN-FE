<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import Buttons from '@/components/common/buttons/Buttons.vue'
import FavoritePropertySection from './FavoritePropertySection.vue'
import PropertySection from './PropertySection.vue'
import { usePropertyStore } from '@/stores/property'
import { onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const property = usePropertyStore()

const addressErrorMessage = ref('')
const isKakaoApiReady = ref(false)

const SIDO_MAP = {
  경기: '경기도',
  충북: '충청북도',
  충남: '충청남도',
  전남: '전라남도',
  경남: '경상남도',
  경북: '경상북도',
  서울: '서울특별시',
  인천: '인천광역시',
  부산: '부산광역시',
  대구: '대구광역시',
  울산: '울산광역시',
  광주: '광주광역시',
  대전: '대전광역시',
}

const searchAddressByCoords = (latitude, longitude) => {
  addressErrorMessage.value = ''

  if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
    addressErrorMessage.value = '카카오 맵 API (서비스)가 준비되지 않았습니다.'
    console.error('Kakao Maps API (services) not ready.')
    return
  }

  const geocoder = new window.kakao.maps.services.Geocoder()

  geocoder.coord2Address(longitude, latitude, (result, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      if (result.length > 0) {
        const firstResult = result[0]

        const region1 = firstResult.address.region_1depth_name
        const region2 = firstResult.address.region_2depth_name
        const region3 = firstResult.address.region_3depth_name

        property.address.sido = SIDO_MAP[region1.slice(0, 2)] || region1

        if (property.address.sido === '세종특별자치시') {
          property.address.sigungu = null // 세종시는 시군구 없이 바로 읍면동으로 넘어가는 경우가 많음
        } else {
          property.address.sigungu = region2 || null
        }
        property.address.eupmyendong = region3 ? region3.split(' ')[0] : null
      } else {
        addressErrorMessage.value =
          '해당 좌표에 대한 주소 정보를 찾을 수 없습니다.'
      }
    } else {
      addressErrorMessage.value = `주소 검색 실패: ${status}`
    }
  })
}

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    kakao.maps.load(() => {
      isKakaoApiReady.value = true

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude

            searchAddressByCoords(latitude, longitude)
          },
          error => {
            console.error('Geolocation 오류:', error)
            addressErrorMessage.value =
              '현재 위치를 가져올 수 없습니다. 브라우저 설정에서 위치 정보 접근을 허용했는지 확인해주세요.'
            switch (error.code) {
              case error.PERMISSION_DENIED:
                console.error('사용자가 위치 정보 접근을 거부했습니다.')
                break
              case error.POSITION_UNAVAILABLE:
                console.error('위치 정보를 사용할 수 없습니다.')
                break
              case error.TIMEOUT:
                console.error('위치 정보를 가져오는 데 시간이 초과되었습니다.')
                break
            }
          },
        )
      } else {
        addressErrorMessage.value =
          '이 브라우저에서는 Geolocation을 지원하지 않습니다.'
        console.error('Geolocation 지원 안함')
      }
    })
  } else {
    addressErrorMessage.value =
      '카카오 맵 API 스크립트가 로드되지 않았습니다. public/index.html 파일을 확인해주세요.'
    console.error('Kakao Maps SDK not loaded in index.html.')
  }
  const favoriteParams = {
    limit: 3,
  }
  property.fetchFavoriteProperties(favoriteParams)
})

watch(
  () => property.address,
  newAddress => {
    if (newAddress.sido && newAddress.sigungu && newAddress.eupmyendong) {
      const properties = {
        limit: 4,
        sido: newAddress.sido,
        sigungu: newAddress.sigungu,
        eupmyendong: newAddress.eupmyendong,
      }
      property.fetchProperties(properties)
    } else if (
      newAddress.sido &&
      !newAddress.sigungu &&
      newAddress.eupmyendong
    ) {
      const properties = {
        limit: 4,
        sido: newAddress.sido,
        eupmyendong: newAddress.eupmyendong,
      }
      property.fetchProperties(properties)
    }
  },
  { deep: true, immediate: true },
)
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
