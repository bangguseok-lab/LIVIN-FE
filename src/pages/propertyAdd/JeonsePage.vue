<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import Buttons from '@/components/common/buttons/Buttons.vue';
import { useRouter } from 'vue-router';
import { usePropertyStore } from '@/stores/property';
import { computed, ref } from 'vue';

const router = useRouter()

// 전세 보증금 저장에 사용하려고 둔 스토어
const propertyStore = usePropertyStore()

// 보증금 금액 변수
const moneyStr = ref('')

// 출력되는 금액 포맷팅
const onlyDigits = (s) => s.replace(/[^\d]/g, '')
const withCommas = (s) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

// 단위별 , 찍기
const onNumberInput = () => {
  const digits = onlyDigits(moneyStr.value).replace(/^0+(?=\d)/, '')
  moneyStr.value = digits ? withCommas(digits) : ''
}

// 입력 받은 금액 문자열을 숫자형(만원 단위)로 변환
const amountMan = computed(() => {
  const num = Number(onlyDigits(moneyStr.value) || '0')
  return Number.isFinite(num) ? num : 0
})

// 계산된 금액 보이기
const prettyAmount = computed(() => {
  const n = amountMan.value
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
})


// 다음 페이지로 이동
const handleClick = () => {
  // 부동산 고유번호가 비어있지 않을 때
  if (moneyStr.value) {
    const numDeposit = Number(moneyStr.value.replace(/,/g, '') + '0000')
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
  <div class="JunsePage">
    <div class="jeonse-container">
      <div class="jeonse-input-wrapper">
        <div class="rent-label">보증금</div>
        <div class="rent-field">
          <div class="input-group">
            <input type="text" v-model="moneyStr" inputmode="numeric" placeholder="금액(만원)을 입력하세요" id="deposit"
              @input="onNumberInput" />
            <span class="unit">만원</span>
          </div>
        </div>
      </div>
      <p v-if="prettyAmount" class="formatt-deposit">계산된 금액: &nbsp;{{ prettyAmount }}</p>
    </div>
    <Buttons type="default" label="위험도 분석하기" @click="handleClick" class="nextBtn" />
  </div>
</template>

<style scoped lang="scss">
.JunsePage {
  position: relative;
  width: 100%;
  height: 90%;
}

.jeonse-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70%;
}

.jeonse-input-wrapper {
  display: grid;
  grid-template-columns: rem(64px) 1fr;
  align-items: center;
  gap: 0.6rem;
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
  margin: 5rem 0;
}
</style>
