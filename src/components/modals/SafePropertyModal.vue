<script setup>
import { defineProps, defineEmits, computed, ref, watch } from 'vue'
import badge from '@/assets/images/landing/SecureBadge.png'
import icon from '@/assets/icons/badge/commentCheck.png'
import riskAPI from '@/api/risk'
import userAPI from '@/api/user'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  propertyId: { type: [Number, String], required: true },
})

const emit = defineEmits(['update:modelValue', 'cta'])

const closeModal = () => {
  emit('update:modelValue', false)
}

// API 연동 상태
const loading = ref(false)
const errorMsg = ref('') // 간단 에러 문자열
const riskRaw = ref(null) // { isSafe, floatingCharge, checkLandlord, injusticeBuilding, jeonseRatio }

const hasUserDeposit = ref(null)
const showDepositCta = computed(() => hasUserDeposit.value === false)

// 서버 응답 { success, message, data } → data만 꺼내기
function normalize(raw) {
  const d = raw?.data ?? {}
  return {
    isSafe: d.isSafe ?? null,
    floatingCharge: d.floatingCharge ?? null, // "안전" | "위험" | "계산 불가" -> 백엔드 수정에 맞춰서 바꿀것//TODO!!!!!!!!!!
    checkLandlord: d.checkLandlord ?? null, // true/false/null
    injusticeBuilding: d.injusticeBuilding ?? null, // true/false/null
    jeonseRatio: typeof d.jeonseRatio === 'number' ? d.jeonseRatio : null,
  }
}

async function fetchUserDeposit() {
  try {
    const { deposit } = await userAPI.fetchDeposit() // 기대 응답: { deposit: number|null, updatedAt?: string }
    // 0 또는 null ⇒ 없음 취급
    hasUserDeposit.value = typeof deposit === 'number' && deposit > 0
  } catch (e) {
    // 조회 실패 시엔 보증금 입력을 유도하는 방향
    hasUserDeposit.value = false
  }
}

async function fetchRisk() {
  if (!props.propertyId) return
  loading.value = true
  errorMsg.value = ''
  riskRaw.value = null
  try {
    const raw = await riskAPI.getRiskAnalysis(props.propertyId) // { success, message, data }
    if (raw?.success !== true || !raw?.data) {
      throw new Error(raw?.message || '위험도 분석 데이터를 찾을 수 없습니다.')
    }
    riskRaw.value = normalize(raw)
  } catch (e) {
    errorMsg.value = e?.message || '리스크 분석 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

/* 모달이 열릴 때 & propertyId 변경 시에만 요청 */
watch(
  () => [props.modelValue, props.propertyId],
  ([open]) => {
    if (open) {
      fetchRisk()
      fetchUserDeposit()
    }
  },
  { immediate: false },
)

/* ----- 뷰 모델 ----- */
const risk = computed(() => riskRaw.value ?? {})

// 전세가율
const JEONSE_SAFE_THRESHOLD = 70
const jeonseView = computed(() => {
  const v =
    typeof risk.value.jeonseRatio === 'number'
      ? Math.round(risk.value.jeonseRatio)
      : null
  if (v === null)
    return { value: '?', tone: 'info', caption: '전세가율 정보가 필요해요' }
  const caption =
    v < JEONSE_SAFE_THRESHOLD ? '안전한 수준이에요' : '적정 전세가율보다 높아요'
  return { value: `${v}%`, tone: 'ok', caption }
})

// 불법 건축물 여부
const illegalView = computed(() => {
  const v = risk.value.injusticeBuilding
  if (v === false)
    return { value: '안전', tone: 'ok', caption: '불법 건축물이 아니에요' }
  if (v === true)
    return { value: '주의', tone: 'warn', caption: '불법 건축물일 수 있어요' }
  return { value: '?', tone: 'info', caption: '행정 정보 확인이 필요해요' }
})

// 임대인 = 소유자 확인
const ownerView = computed(() => {
  const v = risk.value.checkLandlord
  if (v === true)
    return { value: '완료', tone: 'ok', caption: '소유자와 임대인이 동일해요' }
  if (v === false)
    return {
      value: '주의',
      tone: 'warn',
      caption: '소유자와 임대인 확인이 필요해요',
    }
  return { value: '?', tone: 'info', caption: '등기부 확인이 필요해요' }
})

//TODO!!!!!!!!!!!!!!!!!!!
// 근저당/보증금 비율(문자열 그대로 사용) -> 이 부분 백엔드 수정 후 변경 필요
const mortgageView = computed(() => {
  const s = risk.value.floatingCharge
  if (s === '안전')
    return {
      value: '안전',
      tone: 'ok',
      caption: '근저당권이 없지만, 주의가 필요해요',
    }
  if (s === '?')
    return {
      value: '?',
      tone: 'ok',
      caption: '보증금을 입력하면, 더 정확한 정보를 알 수 있어요',
    }
  if (s === '위험')
    return {
      value: '위험',
      tone: 'warn',
      caption: '보증금을 돌려받지 못 할 확률이 높아요',
    }
  return {
    value: s,
    tone: 'ok',
    caption: '안전한 수준',
  }
})
//TODO!!!!!!!!!!!!!!!!!!!

// 라우터 이동
function onClickCta() {
  emit('cta')
  emit('update:modelValue', false)
}
</script>

<template>
  <div v-if="props.modelValue" class="SafePropertyModal spm-modal">
    <div class="spm-modal__overlay" @click="closeModal"></div>

    <div class="spm-modal__content" role="dialog" aria-modal="true" @click.stop>
      <div class="spm">
        <div class="spm__header">
          <img :src="badge" alt="안심 뱃지" class="spm__badge" />
          <h2 class="spm__title">리빈 레포트</h2>
          <p class="spm__subtitle">
            <span class="spm__subtitle-line1"
              >해당 매물에 대한 리빈의 분석이에요</span
            >
            <span class="spm__subtitle-line2"
              >실시간 데이터가 아니므로 이후 재확인이 필요해요</span
            >
          </p>
        </div>

        <!-- 로딩/에러/데이터(정상)/데이터 없음 순으로 분기 -->
        <div class="spm__caption" v-if="loading">불러오는 중…</div>
        <div class="spm__caption" v-else-if="errorMsg" style="color: #d00">
          {{ errorMsg }}
        </div>

        <div class="spm__stats" v-else-if="riskRaw">
          <div class="spm__stat">
            <div class="spm__stat-label">전세가율</div>
            <div :class="['spm__value', `spm__value--${jeonseView.tone}`]">
              {{ jeonseView.value }}
            </div>
            <div class="spm__caption">{{ jeonseView.caption }}</div>
          </div>

          <div class="spm__stat">
            <div class="spm__stat-label">불법 건축물</div>
            <div :class="['spm__value', `spm__value--${illegalView.tone}`]">
              {{ illegalView.value }}
            </div>
            <div class="spm__caption">{{ illegalView.caption }}</div>
          </div>

          <div class="spm__stat">
            <div class="spm__stat-label">임대인 확인</div>
            <div :class="['spm__value', `spm__value--${ownerView.tone}`]">
              {{ ownerView.value }}
            </div>
            <div class="spm__caption">{{ ownerView.caption }}</div>
          </div>

          <div class="spm__stat">
            <div class="spm__stat-label">근저당권</div>
            <div :class="['spm__value', `spm__value--${mortgageView.tone}`]">
              {{ mortgageView.value }}
            </div>
            <div class="spm__caption">{{ mortgageView.caption }}</div>
          </div>
        </div>

        <div class="spm__caption" v-else>표시할 데이터가 없습니다.</div>

        <button
          class="spm__cta"
          type="button"
          v-if="showDepositCta"
          @click="onClickCta"
        >
          <img :src="icon" alt="" class="spm__cta-img" />
          보증금 입력하고 더 안전한 매물 확인하러 가기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 외곽 레이아웃 (네임스페이스) */
.spm-modal {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.spm-modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}
.spm-modal__content {
  position: relative;
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  width: 400px;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

/* 내부 콘텐츠 (BEM) */
.spm {
  text-align: center;

  &__badge {
    width: 80px;
    height: auto;
    display: block;
    margin: 4px auto 6px;
  }
  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 0.02em;
    color: var(--title-text);
  }
  &__subtitle {
    margin: 8px 0 16px;
    line-height: 1.5;
    color: var(--title-text);
  }
  &__subtitle-line1 {
    display: block;
    font-size: rem(15px);
  }
  &__subtitle-line2 {
    display: block;
    font-size: 11px;
    margin-top: 2px;
    opacity: 0.5;
    color: var(--sub-title-text);
  }
  &__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px 8px;
    margin: 8px 0 12px;
  }
  &__stat {
    border-radius: 12px;
    padding: 4px 4px 10px;
  }
  &__stat-label {
    font-size: 12px;
    color: var(--title-text);
    margin-bottom: 2px;
    font-weight: 600;
  }

  &__value {
    font-weight: 800;
    font-size: 36px;
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
    &--ok {
      color: var(--primary-color);
    }
    &--warn {
      color: #f59e0b;
    }
    &--info {
      color: var(--grey);
    }
  }
  &__caption {
    font-size: 10px;
    color: var(--grey);
  }

  &__cta {
    appearance: none;
    background: transparent; /* 배경 없음 */
    border: 0; /* 테두리 없음 */
    color: var(--primary-color);
    font-weight: 700;
    font-size: rem(11px);
    line-height: 1.6;
    display: inline-flex; /* 아이콘 + 텍스트 가로 정렬 */
    align-items: center;
    gap: 6px;
    padding: 0 0 2px; /* 밑줄과 텍스트 사이 여백 */
    margin: 8px 0 4px;
    cursor: pointer;

    /* === 이미지까지 포함해서 ‘한 줄’ 밑줄 === */
    border-bottom: rem(0.5px) solid currentColor;

    /* 접근성/인터랙션 */

    &:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
      border-radius: 4px;
    }
  }

  &__cta-img {
    width: 14px;
    height: 14px;
    object-fit: contain;
    flex: 0 0 auto;
  }
}
</style>
