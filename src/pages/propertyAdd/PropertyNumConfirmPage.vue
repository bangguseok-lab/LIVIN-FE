<script setup>
import Buttons from '@/components/common/buttons/Buttons.vue'
import router from '@/router'
import { usePropertyStore } from '@/stores/property'
import { useUserStore } from '@/stores/user'
import { onMounted, ref, watch } from 'vue'
import { VueSpinnerIos } from 'vue3-spinners'
import api from '@/api/property'

// 매물 등록에 사용하려고 둔 스토어
const propertyStore = usePropertyStore()
// 회원 정보 가져올 스토어
const userStore = useUserStore()

const loading = ref(true) // 로딩 상태

const inputAddress = ref('')
const inputPropertyNum = ref('')

const serverUserName = ref('')
const serverUserBirth = ref('')
const serverUserPhoneNum = ref('')

const ownerName = ref('')

// 로딩 중 스크롤 잠그기
const prevOverflow = ref('')
watch(loading, v => {
  if (v) {
    prevOverflow.value = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = prevOverflow.value || ''
  }
})

onMounted(async () => {
  // 이미 부동산 고유번호 조회 완료된 상태
  if (propertyStore.getNewProperty.confirmPropertyNum) {
    console.log('분석완료')
    loading.value = false // 로딩 여부
  } else {
    // 입력 받은 주소 가져오기
    inputAddress.value =
      propertyStore.getNewProperty.address +
      ' ' +
      propertyStore.getNewProperty.detailAddress +
      propertyStore.getNewProperty.extraAddress
    // 입력 받은 부동산 고유번호 가져오기
    inputPropertyNum.value = propertyStore.getNewProperty.propertyNum // "- 포함" 그대로

    // 가입된 회원정보 가져오기
    await userStore.fetchUserInfo()
    serverUserName.value = userStore.userInfo.data.name
    serverUserBirth.value =
      userStore.userInfo.data.birthDate[0] +
      '.' +
      userStore.userInfo.data.birthDate[1] +
      '.' +
      userStore.userInfo.data.birthDate[2]
    serverUserPhoneNum.value = userStore.userInfo.data.phone

    const commUniqueNo = inputPropertyNum.value
    ownerName.value = serverUserName.value // 가입된 임대인 이름

    const body = {
      commUniqueNo: commUniqueNo,
      ownerName: ownerName.value,
    }
    // 부동산 고유번호가 일치하는 지 요청 보내기
    const result = await api.getPropertyNum(body)
    if (result && result.statusCode === 200) {
      loading.value = false
      console.log('가져온 부동산 고유번호: ', result.data.commUniqueNo)
      console.log('가져온 소유주 이름: ', result.data.ownerName)

      const propertyNumStr = inputPropertyNum.value.replace(/-/g, '')

      // 조회한 부동산 고유번호와 입력 받은 부동산 고유번호가 일치하는 경우
      if (propertyNumStr === result.data.commUniqueNo) {
        // ownerName.value = result.data?.ownerName || '서동주';
        ownerName.value = result.data.ownerName

        console.log(
          '조회한 부동산 고유번호와 일치하는 경우에 렌더링 될 부동산 고유번호: ',
          inputPropertyNum.value,
        )
      } else {
        if (confirm('서버와 부동산 고유번호가 일치하지 않습니다.')) {
          // 부동산 고유번호가 일치하지 않으면, 다시 부동산 고유번호 입력 페이지로 이동
          router.push({ name: 'propertyNum' })
        }
      }
    } else {
      // 실패 시 처리 (에러 페이지 이동 등)
      console.error('부동산 고유번호 조회 실패', result)
    }
  }
})

// 이 고유번호가 아니에요 클릭 시 이전 페이지로 이동
const handleClickNoPropertyNum = () => {
  router.push({ name: 'propertyNum' })
}

// 다음 페이지로 이동
const handleClick = () => {
  router.push({ name: 'propertyType' })
}
</script>

<template>
  <div class="PropertyNumConfirmPage">
    <!-- 전체 화면 블랙 오버레이 + 스피너 -->
    <Teleport to="body">
      <div
        v-if="loading"
        class="loading-overlay"
        role="status"
        aria-live="polite"
      >
        <VueSpinnerIos size="48" color="#fff" />
      </div>
    </Teleport>
    <div class="propertyNumberConfirm-container">
      <p class="inputAddress-text">입력 받은 주소: {{ inputAddress }}</p>
      <div class="propertyNumberConfirm-info-wrapper">
        <div class="propertyNum-title-wrapper">
          {{ inputPropertyNum
          }}<span id="no-propertyNum-text" @click="handleClickNoPropertyNum"
            >이 고유번호가 아니에요</span
          >
        </div>
        <div class="propertyNum-content-wrapper">
          <div>
            <div class="propertyNum-content-text">
              <span class="content-text">부동산 등기부등본상 이름</span
              >{{ ownerName }}
            </div>
          </div>
        </div>
      </div>
      <div class="propertyNumberConfirm-info-wrapper">
        <div class="propertyNum-title-wrapper">
          Livin에 가입된 임대인 회원 정보
        </div>
        <div class="propertyNum-content-wrapper">
          <div>
            <div class="propertyNum-content-text">
              <span class="content-text">이름</span>{{ serverUserName }}
            </div>
          </div>
          <div>
            <div class="propertyNum-content-text">
              <span class="content-text">생년월일</span
              ><span id="birth-text">{{ serverUserBirth }}</span>
            </div>
          </div>
          <div>
            <div class="propertyNum-content-text">
              <span class="content-text">연락처</span
              ><span id="phone-text">{{ serverUserPhoneNum }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Buttons type="default" label="다음" @click="handleClick" class="nextBtn" />
  </div>
</template>

<style scoped lang="scss">
.PropertyNumConfirmPage {
  position: relative;
  width: 100%;
  height: 90%;
}

.propertyNumberConfirm-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.inputAddress-text {
  color: var(--sub-title-text);
  font-size: 0.8rem;
}

.propertyNumberConfirm-info-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 3.5rem 2rem;
  margin-bottom: 1rem;
  border-top: 1px solid var(--grey);
  border-bottom: 1px solid var(--grey);
}

.propertyNum-title-wrapper {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: var(--font-weight-semibold);
  color: var(--title-text);
  margin-bottom: 1rem;
}

#no-propertyNum-text {
  margin-left: 2rem;
  font-size: 0.7rem;
  color: var(--primary-color);
  text-decoration-line: underline;
}

#no-propertyNum-text:hover {
  cursor: pointer;
}

.propertyNum-content-text {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.4rem;
  color: var(--grey);
  font-size: 0.9rem;
}

.content-text {
  margin-right: 5rem;
  color: var(--sub-title-text);
  font-weight: var(--font-weight-semibold);
}

#birth-text {
  position: absolute;
  left: 8.5rem;
}

#phone-text {
  position: absolute;
  left: 8.5rem;
}

@media (max-width: 375px) {
  .inputAddress-text {
    color: var(--sub-title-text);
    font-size: 0.6rem;
  }

  .propertyNum-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    font-weight: var(--font-weight-regular);
    color: var(--title-text);
    margin-bottom: 1rem;
  }

  #no-propertyNum-text {
    margin-left: 0.5rem;
    font-size: 0.6rem;
  }
}

.nextBtn {
  width: 100%;
  height: rem(50px);
  margin: 2rem 0;
}
</style>
