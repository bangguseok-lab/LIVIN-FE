<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import icon from '@/assets/icons/badge/exclamation.png'
import Buttons from '@/components/common/buttons/Buttons.vue'

const router = useRouter()
const userStore = useUserStore()

const inputText = ref('')
const inputEl = ref(null)

function format(num) {
  return new Intl.NumberFormat('ko-KR').format(num)
}

function parseToNumber(text = '') {
  const n = Number(String(text).replace(/[^\d]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function onInput(e) {
  // 쉼표 자동 포맷 (간단 버전)
  const digits = e.target.value.replace(/[^\d]/g, '')
  inputText.value = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const rawValue = computed(() => parseToNumber(inputText.value))
const hasValue = computed(() => rawValue.value > 0)
const sendAmountWon = computed(() => rawValue.value * 10000)

async function handleSubmit() {
  // 1) 비어있음 검사
  const text = inputText.value.trim()
  if (text === '') {
    alert('숫자를 입력해 주세요.')
    requestAnimationFrame(() => inputEl.value?.focus())
    return
  }

  // 2) 숫자 형식(쉼표 허용) 검사
  // 예: "1", "1,000", "12,345"만 허용
  if (!/^\d{1,3}(,\d{3})*$/.test(text)) {
    alert('숫자만 입력해 주세요.')
    requestAnimationFrame(() => inputEl.value?.focus())
    return
  }

  if (rawValue.value <= 0) {
    alert('0원보다 큰 값을 입력해 주세요. (최소 1만원 이상)')
    requestAnimationFrame(() => inputEl.value?.focus())
    return
  }
  try {
    const payload = { deposit: rawValue.value }
    console.log('[DepositInput] 요청 -> PUT /api/users/deposit', payload)
    console.log(
      '[DepositInput] 입력(만원):',
      rawValue.value,
      '→ 전송(원):',
      sendAmountWon.value,
    )
    await userStore.updateDeposit(sendAmountWon.value)
    console.log('[DepositInput] 저장 완료(원):', sendAmountWon.value)
    router.back()
  } catch (e) {
    console.error(e)
    alert('저장에 실패했어요. 잠시 후 다시 시도해주세요.')
  }
}

async function handleReset() {
  if (!confirm('보증금을 초기화할까요?')) return
  try {
    console.log('[DepositInput] 요청 -> DELETE /api/users/deposit')
    await userStore.deleteDeposit()
    inputText.value = ''
    requestAnimationFrame(() => inputEl.value?.focus())
    console.log('[DepositInput] 보증금 삭제 완료')
  } catch (e) {
    console.error(e)
    alert('초기화에 실패했어요. 잠시 후 다시 시도해주세요.')
  }
}

onMounted(async () => {
  // 서버에서 최신값 가져와서 프리필
  await userStore.fetchDeposit({ useCache: false })
  if (
    typeof userStore.depositAmount === 'number' &&
    userStore.depositAmount >= 0
  ) {
    const inManwon = Math.trunc(userStore.depositAmount / 10000)
    inputText.value = format(inManwon)
  }
})
</script>

<template>
  <div class="deposit">
    <!-- 본문 -->
    <main class="deposit__main">
      <h2 class="deposit__h2">내 보증금을 알려주세요</h2>
      <p class="deposit__sub">
        근저당권 설정을 위해 제출 가능한 최대 금액을 알려주세요 (만원)
      </p>

      <!-- 입력 -->
      <label for="depositInput" class="sr-only">보증금</label>
      <div class="deposit__field">
        <input
          id="depositInput"
          ref="inputEl"
          v-model="inputText"
          class="deposit__input"
          type="text"
          inputmode="numeric"
          placeholder="보증금(만원)을 입력하세요"
          @input="onInput"
        />
        <span class="deposit__suffix" v-show="hasValue">만원</span>
      </div>

      <p class="deposit__hint">
        <img :src="icon" alt="" class="deposit__hint-icon" />
        이 정보를 입력하면 더 안전한 매물을 확인할 수 있어요
      </p>
    </main>

    <div class="deposit__footer">
      <div class="deposit__actions">
        <Buttons
          type="md"
          label="저장"
          :disabled="userStore.depositLoading"
          :loading="userStore.depositLoading"
          is-active="true"
          @click="handleSubmit"
          class="deposit__cta-save"
        />
        <Buttons
          type="md"
          label="초기화"
          :disabled="userStore.depositLoading"
          @click="handleReset"
          class="deposit__cta-reset"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.deposit {
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 96px 32px 0;
}
.sr-only {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 본문 */
.deposit__main {
  padding: 0;
}
.deposit__h2 {
  margin: 21px 0 6px;
  font-size: 20px;
  font-weight: 800;
}
.deposit__sub {
  margin: 0 0 16px;
  font-size: 12px;
  color: #94a3b8;
}

/* 입력 박스 */
.deposit__field {
  position: relative;
  border: 1px solid var(--whitish);
  border-radius: 12px;
  padding: 0;
  background: var(--white); /* 값/포커스와 관계없이 고정 */
}
.deposit__field:focus-within {
  background: #fff !important;
  border-color: var(--whitish); /* 테두리도 고정. 강조 원하면 primary로 변경 */
}
.deposit__input {
  width: 100%;
  height: 50px;
  padding: 0 48px 0 16px;
  border: 0;
  outline: 0;
  background: transparent;
}
.deposit__input::placeholder {
  color: var(--grey);
}
.deposit__input:focus::placeholder {
  color: transparent;
}

.deposit__suffix {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  font-size: 14px;
  color: var(--grey);
  pointer-events: none;
}

/* 도움 문구 */
.deposit__hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0 0;
  font-size: 12px;
  color: #16a34a;
}
.deposit__hint-icon {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
}

/* 하단 고정 CTA */
.deposit__footer {
  margin-top: auto;
  margin-bottom: 50px;
  position: sticky;
  bottom: 0;
}
.deposit__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.deposit__cta-save,
.deposit__cta-reset {
  width: rem(200px);
  height: rem(40px);
  cursor: pointer;
}
</style>
