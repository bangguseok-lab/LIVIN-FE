<script setup>
import Buttons from '@/components/common/buttons/Buttons.vue'
import FavoritePropertySection from './FavoritePropertySection.vue'
import PropertySection from './PropertySection.vue'
import { usePropertyStore } from '@/stores/property'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'

const property = usePropertyStore()
const user = useUserStore()
const addressErrorMessage = ref('')
const isKakaoApiReady = ref(false)
const propertyMessage = ref('')

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

const searchAddressByCoords = async (latitude, longitude) => {
  addressErrorMessage.value = ''

  if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
    addressErrorMessage.value = '카카오 맵 API (서비스)가 준비되지 않았습니다.'
    console.error('Kakao Maps API (services) not ready.')
    return
  }

  const geocoder = new window.kakao.maps.services.Geocoder()

  geocoder.coord2Address(longitude, latitude, async (result, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      if (result.length > 0) {
        const firstResult = result[0]
        const region1 = firstResult.address.region_1depth_name
        const region2 = firstResult.address.region_2depth_name
        const region3 = firstResult.address.region_3depth_name

        sessionStorage.setItem('sido', SIDO_MAP[region1.slice(0, 2)] || region1)
        if (sessionStorage.getItem('sido') === '세종특별자치시') {
          sessionStorage.setItem('sigungu', null)
        } else {
          sessionStorage.setItem('sigungu', region2 || null)
        }
        sessionStorage.setItem(
          'eupmyendong',
          region3 ? region3.split(' ')[0] : null,
        )

        const properties = {
          limit: 4,
          sido: sessionStorage.getItem('sido'),
          sigungu: sessionStorage.getItem('sigungu'),
          eupmyendong: sessionStorage.getItem('eupmyendong'),
        }
        await property.fetchProperties(properties)
        if (property.getPropertiesList.length === 0) {
          propertyMessage.value = propertyMessage.value =
            '현재 위치 주변에 매물이 없어요.\n 서울특별시 강남구 대치동의 매물을 보여드릴게요.'
          const initialProperties = {
            limit: 4,
            sido: '서울특별시',
            sigungu: '강남구',
            eupmyendong: '대치동',
          }
          await property.fetchProperties(initialProperties)
        } else {
          propertyMessage.value = ''
        }
      } else {
        addressErrorMessage.value =
          '해당 좌표에 대한 주소 정보를 찾을 수 없습니다.'
      }
    } else {
      addressErrorMessage.value = `주소 검색 실패: ${status}`
    }
  })
}

onMounted(async () => {
  sessionStorage.setItem('sido', '서울특별시')
  sessionStorage.setItem('sigungu', '강남구')
  sessionStorage.setItem('eupmyendong', '대치동')
  if (property.getPropertiesList.length !== 0) {
    property.clearProperties()
  }

  if (window.kakao && window.kakao.maps) {
    window.kakao.maps.load(() => {
      isKakaoApiReady.value = true
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            searchAddressByCoords(latitude, longitude)
          },
          async error => {
            console.error('Geolocation 오류:', error)
            addressErrorMessage.value =
              '현재 위치를 가져올 수 없습니다. 브라우저 설정에서 위치 정보 접근을 허용했는지 확인해주세요.'
            const initialProperties = {
              limit: 4,
              sido: '서울특별시',
              sigungu: '강남구',
              eupmyendong: '대치동',
            }
            switch (error.code) {
              case error.PERMISSION_DENIED:
                propertyMessage.value = propertyMessage.value =
                  '위치 정보 접근이 거부되었습니다.\n 서울특별시 강남구 대치동의 매물을 보여드릴게요.'
                await property.fetchProperties(initialProperties)
                console.error('사용자가 위치 정보 접근을 거부했습니다.')
                break
              case error.POSITION_UNAVAILABLE:
                propertyMessage.value = propertyMessage.value =
                  '위치 정보를 사용할 수 없습니다.\n 서울특별시 강남구 대치동의 매물을 보여드릴게요.'
                await property.fetchProperties(initialProperties)
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
  await property.fetchFavoriteProperties(favoriteParams)
  await user.fetchNickname()
  console.log(property.getPropertiesList)
})
</script>

<template>
  <div class="Home">
    <div class="intro-box">
      <div class="character">
        <img
          src="@/assets/images/character/character-basic.svg"
          alt="Character"
        />
      </div>
      <div class="name-text">{{ user.getNickname }}님,</div>
      <div class="main-text">
        오늘도 함께 <br />
        좋은 집을 찾아봐요!
      </div>
    </div>
    <div class="content-wrap">
      <div class="content-box">
        <favorite-property-section :favorite="property.getFavorite" />
        <property-section
          :properties="property.getPropertiesList"
          :propertyMessage="propertyMessage"
          class="propertyMessage"
        />
      </div>
      <div class="checklist-router-box">
        <div class="description-box mb-2">
          더 많은 매물이 궁금하시다면, 더보기를 눌러 확인해보세요
        </div>
        <Buttons type="xl" togo="/checklist" class="checklist-router-btn mt-5">
          <span class="btn-inner">
            <span class="btn-text">
              <div class="top-text">
                나만의 공간을 위한 모든 준비, 지금 여기서 시작하세요
              </div>
              <div class="bottom-text">나만의 체크리스트 만들기</div>
            </span>
            <img
              src="@/assets/icons/home/go-to-check-icon.svg"
              class="btn-icon"
            />
          </span>
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
  padding: 7rem 0;
  background-color: var(--primary-color);
  display: flex;
  flex-direction: column;
}

.intro-box {
  color: white;
  margin-top: rem(100px);
  padding: 2rem 2rem 0 2rem;
  position: relative;
  height: 30vh;
}
.name-text {
  font-size: 1rem;
  font-weight: var(--font-weight-light);
  margin-bottom: rem(4px);
}

.main-text {
  font-size: 1.6rem;
  font-weight: var(--font-weight-bold);
  line-height: 1.3;
}

.intro-box .character {
  position: absolute;
  right: 25px; /* 오른쪽에서 띄움 */
  bottom: rem(50px);
  width: 200px;
  pointer-events: none; /* 클릭 방지 */
}

.intro-box .character img {
  display: block;
  width: 100%;
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
  border-radius: 35px 35px 0 0;
  margin-bottom: rem(-70px);
}

.content-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.checklist-router-box {
  padding: 0 rem(30px) rem(50px) rem(30px);
  background-color: var(--white);
  width: 100%;
}

:deep(.checklist-router-btn) {
  height: rem(100px);
  // 색상 적용이 안 돼서 이 부분의 primary color만 var(--green)으로 재정의
  --primary-color: var(--green);

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

:deep(.checklist-router-btn.btn-xl) {
  background-color: var(--green) !important;
}

.description-box {
  color: var(--grey);
  font-size: rem(12px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 슬롯 래퍼: 좌우 끝 정렬 */
.checklist-router-btn .btn-inner {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 왼쪽: 텍스트, 오른쪽: 아이콘 */
  width: 100%;
  gap: 12px;
}

/* 텍스트 묶음: 왼쪽 정렬 및 두 줄 세로 배치 */
.checklist-router-btn .btn-text {
  display: flex;
  flex-direction: column;
  text-align: left;
  flex: 1 1 auto; /* 남는 영역을 텍스트가 차지 */
  line-height: 1.25;
}

.checklist-router-btn .btn-icon {
  width: rem(65px);
  flex: 0 0 auto;
}
</style>
