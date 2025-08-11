<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import Buttons from '@/components/common/buttons/Buttons.vue';
import { useRouter } from 'vue-router';
import { usePropertyStore } from '@/stores/property';
import { computed, ref } from 'vue';

const router = useRouter()

// 월세 보증금 저장에 사용하려고 둔 스토어
const propertyStore = usePropertyStore()

const wolseStr = ref('')      // 월세 보증금 금액 변수
const wolseRentStr = ref('')  // 월세 금액 변수

// 출력되는 금액 포맷팅
const onlyDigits = (s) => s.replace(/[^\d]/g, '')
const withCommas = (s) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

// 단위별 , 찍기
const onWolseNumberInput = () => {
  const wolseDigits = onlyDigits(wolseStr.value).replace(/^0+(?=\d)/, '')
  wolseStr.value = wolseDigits ? withCommas(wolseDigits) : ''
}

const onWolseRentNumberInput = () => {
  const wolseRentDigits = onlyDigits(wolseRentStr.value).replace(/^0+(?=\d)/, '')
  wolseRentStr.value = wolseRentDigits ? withCommas(wolseRentDigits) : ''
}

// 금액 문자열을 숫자형(만원 단위)로 변환하는 함수
const getAmountInMan = (amountStr) => {
  const num = Number(onlyDigits(String(amountStr)) || '0')
  return Number.isFinite(num) ? num : 0
}

// 금액을 한국어 표기로 변환하는 함수
const getPrettyAmount = (amountInMan) => {
  const n = amountInMan
  if (!n) return ''

  const eok = Math.floor(n / 10000)        // 억
  const rem = n % 10000
  const cheon = Math.floor(rem / 1000)     // 천만
  const man = rem % 1000                   // 만원

  const parts = []
  if (eok) parts.push(`${eok}억`)
  if (cheon) parts.push(`${cheon}천`)
  if (man) parts.push(`${man}만원`)

  return parts.join(' ')
}

// 월세 -> 전세가 전환율 적용하여 계산
const jeonseStr = computed(() => {
  const deposit = Number(onlyDigits(wolseStr.value) || 0)
  const rent = Number(onlyDigits(wolseRentStr.value) || 0)
  if (rent !== 0) {
    const total = deposit + (rent * 12) * (1000 / 45)
    const rounded = Math.round(total)   // 정수 반올림
    return withCommas(String(rounded))  // 단위별 콤마 찍기
  }
  return ''
})

// 각 문자열에 대한 computed 값들
const wolseAmount = computed(() => getAmountInMan(wolseStr.value))
const wolseRentAmount = computed(() => getAmountInMan(wolseRentStr.value))
const jeonseAmount = computed(() => getAmountInMan(jeonseStr.value))

// 각 문자열에 대한 pretty amount computed 값들
const wolsePrettyAmount = computed(() => getPrettyAmount(wolseAmount.value))
const wolseRentPrettyAmount = computed(() => getPrettyAmount(wolseRentAmount.value))
const jeonsePrettyAmount = computed(() => getPrettyAmount(jeonseAmount.value))



// 다음 페이지로 이동
const handleClick = () => {
  // 부동산 고유번호가 비어있지 않을 때
  if (jeonseStr.value) {
    const numDeposit = Number(jeonseStr.value.replace(/,/g, '') + '0000')
    // console.log("월세 전환금액:", numDeposit)
    propertyStore.updateNewProperty('propertyDeposit', numDeposit)
    router.push({ name: 'riskAnalysisDone' })
  } else {
    router.push({ name: 'wolsePage' })
  }
}


// 새로고침 여부에 대한 플래그
const FLAG = 'redirect_to_address'

// 사용자가 F5나 Ctrl+R / Cmd+R로 새로고침하려 할 때 막고, 확인창을 띄움.
const handleKeyRefresh = (e) => {
  const isF5 = e.key === 'F5'
  const isR = (e.key === 'r' || e.key === 'R') && (e.ctrlKey || e.metaKey) // Ctrl+R / Cmd+R
  if (!isF5 && !isR) return

  e.preventDefault()
  const ok = confirm('새로고침하면 모든 입력 데이터가 사라집니다. 주소 입력 페이지로 이동할까요?')
  if (ok) {
    // 키로 새로고침하려던 경우는 실제 리로드 없이 바로 이동
    router.replace({ name: 'addressSearch' })
  }
  // 취소면 현재 페이지 유지
}

const handleBeforeUnload = (e) => {
  // 브라우저 새로고침 버튼/창 닫기 등: 브라우저 기본 다이얼로그 표시
  e.preventDefault()
  e.returnValue = ''
  // 사용자가 "확인"을 눌러 실제로 떠나면 다음 로드에서만 이 플래그가 읽힘
  sessionStorage.setItem(FLAG, '1')
}

onMounted(() => {
  // 키보드로 새로고침(F5, Ctrl+R, Cmd+R)을 시도했을 때, 브라우저 기본 동작을 막고(preventDefault())
  // 내가 만든 handleKeyRefresh 함수로 대신 처리
  window.addEventListener('keydown', handleKeyRefresh, { passive: false })
  window.addEventListener('beforeunload', handleBeforeUnload)

  // 처음 이 페이지에 들어왔을 때 주소 검색 페이지로 자동 이동 방지
  // 오직 직전에 이 페이지에서 새로고침(혹은 닫기) 시에만 실제로 떠난 경우에만 redirect
  if (sessionStorage.getItem(FLAG) === '1') {
    sessionStorage.removeItem(FLAG)
    router.replace({ name: 'addressSearch' })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyRefresh)
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<template>
  <div class="WolsePage">
    <div class="wolse-container">
      <div class="wolse-input-box">
        <p class="rent-title">월세</p>
        <div class="wolse-input-wrapper">
          <div class="rent-label">보증금</div>
          <div class="rent-field">
            <div class="input-group">
              <input type="text" v-model="wolseStr" inputmode="numeric" placeholder="금액(만원)을 입력하세요" id="wolseDeposit"
                @input="onWolseNumberInput" />
              <span class="unit">만원</span>
            </div>
          </div>
        </div>
        <p v-if="wolsePrettyAmount" class="formatt-deposit">계산된 금액: &nbsp;{{ wolsePrettyAmount }}</p>
        <div class="wolse-input-wrapper">
          <div class="rent-label">월세</div>
          <div class="rent-field">
            <div class="input-group">
              <input type="text" v-model="wolseRentStr" inputmode="numeric" placeholder="금액(만원)을 입력하세요" id="deposit"
                @input="onWolseRentNumberInput" />
              <span class="unit">만원</span>
            </div>
          </div>
        </div>

        <p v-if="wolseRentPrettyAmount" class="formatt-deposit">계산된 금액: &nbsp;{{ wolseRentPrettyAmount }}</p>
      </div>
      <div class="wolse-input-box">
        <p class="rent-title">전세가 전환 금액</p>
        <p class="wolseTojeonse-description">위험도 분석을 위해 전세가로 전환되었을 때의 금액입니다.</p>
        <p class="wolseTojeonse-description">적용된 전환율: 2.0% + (기준 금리) 2.5%</p>
        <div class="wolse-input-wrapper">
          <div class="rent-label">전환 금액</div>
          <div class="rent-field">
            <div class="input-group">
              <input type="text" v-model="jeonseStr" inputmode="numeric" placeholder="전환율에 맞추어 계산되어 나옵니다" id="jeonse"
                :readonly="jeonseStr" />
              <span class="unit">만원</span>
            </div>
          </div>
        </div>
        <p v-if="jeonsePrettyAmount" class="formatt-deposit">전환율 적용된 금액: &nbsp;{{ jeonsePrettyAmount }}</p>
      </div>

    </div>
    <Buttons type="default" label="위험도 분석하기" @click="handleClick" class="nextBtn" />
  </div>
</template>

<style scoped lang="scss">
.WolsePage {
  position: relative;
  width: 100%;
  height: 90%;
}

.wolse-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70%;
}

.rent-title {
  font-size: 1.2rem;
  font-weight: var(--font-weight-semibold);
}

.wolse-input-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: .4rem;
  padding: 1rem 0;
}

.wolse-input-wrapper {
  display: grid;
  grid-template-columns: 4rem 1fr;
  align-items: center;
  gap: .6rem;
  margin-bottom: .6rem;
}

.wolseTojeonse-description {
  font-size: .8rem;
  font-weight: var(--font-weight-semibold);
  color: var(--sub-title-text);
}

.rent-label {
  font-weight: var(--font-weight-bold);
}

.rent-field {
  width: 100%;
}

.input-group {
  position: relative;
  border: rem(1px) solid #e5e7eb;
  border-radius: 0.625rem;
  background-color: #f9fafb;
}

.input-group input {
  width: 100%;
  height: 2.4rem;
  padding-right: 3.25rem;
  padding-left: .875rem;
  border: 0; // 만원 글씨랑 겹쳐서 무테로 적용
  background: transparent;
  font-size: 0.875rem;
  outline: none;
  transition: border-color .15s, box-shadow .15s;
}

.input-group input::placeholder {
  color: var(--sub-title-text);
}

.input-group input:focus {
  outline: none;
}

.input-group:has(input:focus) {
  caret-color: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, .15);
  background: #fff;
}

.unit {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-weight: 600;
  color: #9ca3af;
  pointer-events: none; // 클릭 비활성화
}

.formatt-deposit {
  display: flex;
  width: 100%;
  padding-left: 5.4rem;
  margin-top: .8rem;
  font-size: .9rem;
  color: var(--sub-title-text);
}

.nextBtn {
  width: 100%;
  height: rem(60px);
  margin-top: 5rem;
}
</style>
