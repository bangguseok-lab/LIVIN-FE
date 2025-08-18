<script setup>
import Buttons from '@/components/common/buttons/Buttons.vue'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { VueSpinnerIos } from 'vue3-spinners'
import api from '@/api/property'
import { usePropertyStore } from '@/stores/property'
import DoneCharacter from '@/assets/images/character/character-basic.svg'
import { storeToRefs } from 'pinia'

const router = useRouter()
const loading = ref(true) // 로딩 상태
const riskResult = ref(null) // 위험도 분석 결과 저장

const propertyStore = usePropertyStore()
const { newProperty } = storeToRefs(propertyStore)

// 다음 버튼 클릭 시 이벤트 처리
const handleClick = () => {
  router.push({ name: 'photoPage' })
}

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
  // 이미 분석 완료된 상태
  if (propertyStore.getNewProperty.riskAnalyzed) {
    // console.log('분석완료')
    loading.value = false // 로딩 여부
  } else {
    // console.log('분석 해야 함')
    // 3초 대기 → 스피너 테스트
    // await new Promise(resolve => setTimeout(resolve, 3000))
    // loading.value = false

    const inputPostcode = propertyStore.getNewProperty.postcode
    const inputAddress = propertyStore.getNewProperty.address
    const inputDetailAddress = propertyStore.getNewProperty.detailAddress
    const inputPropertyDeposit = propertyStore.getNewProperty.jeonseDeposit
    let dong = ''
    let ho = ''
    console.log(inputDetailAddress)

    // 동과 호 추출 (숫자만 또는 '동', '호' 포함해서)
    const match = inputDetailAddress.match(/(\d+)동\s*(\d+)호/)

    if (match) {
      dong = match[1].concat('동') // 103동
      ho = match[2] // 3001
    } else {
      console.log('형식이 맞지 않습니다.')
    }

    try {
      const np = newProperty.value ?? {}
      const body = {
        jeonseDeposit: inputPropertyDeposit,
        roadNo: inputAddress,
        buildingNo: '60',
        buildingSubNo: '0',
        dong: dong,
        ho: ho,
        zipCode: inputPostcode,
        commUniqueNo: np.propertyNum,
        isGeneral: false,
      }

      // 위험도 분석 요청 보내기
      const result = await api.postRiskAnalysis(body)
      riskResult.value = result

      // 성공 시만 로딩 해제
      loading.value = true
      if (result.success) {
        loading.value = false // 로딩 상태 없애기

        console.log('sido: ', result.data.sido)
        console.log('sigungu: ', result.data.sigungu)
        console.log('eupmyeondong: ', result.data.eupmyeondong)

        // 행정구역 스토어에 업데이트 하기
        propertyStore.updateNewProperty('sido', result.data.sido)
        propertyStore.updateNewProperty('sigungu', result.data.sigungu)
        propertyStore.updateNewProperty('eupmyendong', result.data.eupmyeondong)
        propertyStore.updateNewProperty('riskAnalyzed', true) // 분석된 상태 업데이트
      } else {
        // 실패 시 처리 (에러 페이지 이동 등)
        console.error('위험도 분석 실패', result)
      }
    } catch (err) {
      console.error('위험도 분석 에러', err)
      // 필요시 에러 페이지 이동
    }
  }
})
</script>

<template>
  <div class="RiskAnalysisDonePage">
    <div class="risk-container">
      <img v-if="!loading" :src="DoneCharacter" alt="완료 캐릭터" class="character shake-once" />
    </div>
    <Buttons type="default" label="다음" @click="handleClick" class="nextBtn" />
  </div>
  <!-- 전체 화면 블랙 오버레이 + 스피너 -->
  <Teleport to="body">
    <div v-if="loading" class="loading-overlay" role="status" aria-live="polite">
      <VueSpinnerIos size="48" color="#fff" />
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.RiskAnalysisDonePage {
  position: relative;
  width: 100%;
  height: 90%;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background-color: black;
}

.risk-container {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
  height: 70%;
}

.character {
  width: 60%;
}

/* 좌우 흔들기 */
@keyframes shake-x {

  0%,
  100% {
    transform: translateX(0);
  }

  10%,
  30%,
  50%,
  70% {
    transform: translateX(calc(var(--shake-distance, 4px) * -1));
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(var(--shake-distance, 4px));
  }
}

/* 한 번만 흔들고 멈춤 */
.shake-once {
  animation: shake-x var(--shake-duration, 600ms) ease-in-out 1;
}

/* 접근성: 모션 감소 선호 시 애니메이션 끔 */
@media (prefers-reduced-motion: reduce) {

  .shake-x,
  .shake-once,
  .hover-shake-x:hover {
    animation: none !important;
  }
}

.nextBtn {
  width: 100%;
  height: rem(60px);
  margin-top: 5rem;
}

/* 전체 페이지 오버레이 */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0.4; // 투명도
}

@media (max-width: 375px) {
  .risk-container {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    width: 100%;
    height: 50%;
  }
}
</style>
