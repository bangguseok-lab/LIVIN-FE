<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Buttons from '@/components/common/buttons/Buttons.vue'
import { usePropertyStore } from '@/stores/property'
import api from '@/api/property'
import { storeToRefs } from 'pinia'

const router = useRouter()
const propertyStore = usePropertyStore()
const { newProperty } = storeToRefs(propertyStore)
const loading = ref(false) // 요청 중 버튼 비활성화/스피너 등에 사용

// 로컬 상태
const text = ref('')

// 재진입 시 스토어 → 화면 복원
onMounted(() => {
  text.value = propertyStore.getNewProperty?.description ?? ''
})

// 글자수 계산
const maxLen = 200
const count = computed(() => text.value.length)

// 숫자 같은 문자열을 안전하게 변환(필요 없으면 제거 가능)
const toNumOrZero = v => {
  const n = Number(
    String(v ?? '')
      .replaceAll(',', '')
      .trim(),
  )
  return Number.isFinite(n) ? n : 0
}

// 전송 핸들러
const handleSubmit = async () => {
  if (loading.value) return
  loading.value = true

  try {
    // Request JSON 조립 (스토어에서 꺼내오기)
    const np = newProperty.value ?? {}
    // 관리비 없음 처리
    const managementList = np.managementList ?? []
    const isNoManagement =
      managementList.length === 1 &&
      managementList[0].managementType === '관리비 없음' &&
      managementList[0].managementFee === 0

    const propertyRequest = {
      // 필수/공통
      name: np.name, // 매물이름 (아파트/동호 포함 가능)
      detailAddress: np.detailAddress, // 상세주소 (예: 1305호)
      description: np.description ?? '', // 설명

      // 거래/금액
      transactionType: np.transactionType, // 'JEONSE' | 'MONTHLY_RENT'
      jeonseDeposit: toNumOrZero(np.jeonseDeposit), // 전세보증금 (없으면, 0)
      monthlyDeposit: toNumOrZero(np.monthlyDeposit), // 월세보증금 (없으면, 0)
      monthlyRent: toNumOrZero(np.monthlyRent), // 월세 (없으면, 0)

      // 면적/층/방
      supplyAreaM2: String(np.supplyArea ?? ''), // 공급 면적(String)
      exclusiveAreaM2: String(np.exclusiveArea ?? ''), // 전용 면적
      floor: toNumOrZero(np.floor), // 층
      numRoom: toNumOrZero(np.roomCnt), // 방 개수
      numBathrooms: toNumOrZero(np.bathRoomCnt), // 욕실 개수
      duplexStructure: !!np.isDuplex, // 복층 여부
      mainDirection: np.direction ?? '', // 주실 방향

      // 주소
      sido: np.sido,
      sigungu: np.sigungu,
      eupmyendong: np.eupmyendong,
      propertyNum: (np.propertyNum ?? '').replace(/-/g, ''), // 부동산 고유번호(- 없이)

      // 옵션/정책
      propertyType: 'BUILDING',
      optionIdList: np.optionIdList ?? [], // 옵션 아이디들 (예: [1,3,4,6])
      pet: np.pet ?? 'NEEDS_CHECK', // 'ABLE' | 'UNABLE' | 'NEEDS_CHECK'
      loan: np.loan ?? 'NEEDS_CHECK', // 대출 가능 여부
      parking: np.parking ?? 'NEEDS_CHECK',

      // 이미지 관련 부가 정보
      imgRepresentList: np.imgRepresentList ?? [], // 이미지별 대표사진 여부 [{represent:true|false}, ...]
      // 관리비
      managementList: isNoManagement ? null : (np.managementList ?? []), // [{managementType, managementFee}]  -> 관리비 없을 때는 어떻게?? (현재는 {'관리비 없음', 0} 이렇게 전달됨) !!!!!!!!!확인 필요!!!!!!
      // 입주일
      moveInDate: np.moveDate ?? null, // 'YYYY-MM-DD' | null
    }

    // FormData 조립 (JSON은 propertyRequest / 이미지는 images)
    const files = np.imageFiles ?? [] // [File, File, ...]
    const fd = new FormData()
    // propertyRequest (JSON) 먼저 추가
    fd.append(
      'propertyRequest',
      new Blob(
        [
          JSON.stringify({
            ...propertyRequest,
            // 여기서는 imgRepresentList를 비워두고, 아래에서 별도 필드로 보냄
          }),
        ],
        { type: 'application/json' },
      ),
    )
    // 파일과 대표사진 여부를 순서대로 매칭해서 FormData에 추가
    files.forEach(
      file => fd.append('images', file), // 파일 순서 대로
    )
    console.log(propertyRequest)
    // 매물 등록 요청 전송 (성공 시에만 페이지 이동)
    const res = await api.postNewProperty(fd)

    if (res.success) {
      // 성공했을 때에만 페이지 이동
      router.push({ name: 'donePage' })
    } else {
      alert('매물 등록에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  } catch (err) {
    console.error('매물 등록 에러:', err)
    alert('매물 등록 중 오류가 발생했습니다.')
  } finally {
    loading.value = false
  }
}

const handlePrevClick = () => {
  propertyStore.updateNewProperty('description', text.value.trimStart()) // trimStart(): 모든 선행 공백 문자를 제거
  router.push({ name: 'moveDatePage' })
}

const handleNextClick = async () => {
  propertyStore.updateNewProperty('description', text.value.trimStart())

  if (propertyStore.getNewProperty.description !== '') {
    console.log(propertyStore.getNewProperty)
    console.log(propertyStore.getNewProperty.description)
  }

  // 스토어 최신 반영 보장
  await nextTick()

  // 저장 완료 후 매물 등록 요청
  await handleSubmit()
}
</script>

<template>
  <div class="LastPage">
    <div class="last-container">
      <div class="desc-field">
        <div class="counter">
          <strong>{{ count }}</strong
          ><span class="total">/{{ maxLen }}</span>
        </div>

        <textarea
          v-model="text"
          :maxlength="maxLen"
          placeholder="설명을 입력하세요"
          rows="8"
          class="desc-textarea"
        />
      </div>
    </div>
    <div class="button-wrapper">
      <Buttons
        type="default"
        label="이전"
        @click="handlePrevClick"
        class="prevBtn"
      />
      <Buttons
        type="default"
        label="다음"
        @click="handleNextClick"
        class="nextBtn"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.LastPage {
  position: relative;
  width: 100%;
  height: 90%;
}

.last-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70%;
}

.desc-field {
  position: relative;
  margin: 1rem 0;
}

/* 카운터 */
.counter {
  position: absolute;
  top: -10px;
  right: 10px;
  background: var(--white);
  padding: 0 rem(6px);
  font-size: rem(14px);
  line-height: 1;
}

.counter strong {
  color: #111;
  font-weight: var(--font-weight-bold);
}

.counter .total {
  color: #c0c4cc;
  margin-left: rem(2px);
}

/* 텍스트 영역 */
.desc-textarea {
  width: 100%;
  min-height: rem(260px);
  padding: 0.8rem 1rem;
  border-radius: 1rem;
  outline: none;
  font-size: 1rem;
  color: var(--title-text);
  resize: none;
  box-sizing: border-box;
  caret-color: var(--primary-color);
}

/* placeholder 색상 */
.desc-textarea::placeholder {
  color: var(--sub-title-text);
}

/* 텍스트 입력 부분을 클릭했을 때, 주위 그림자 표시 */
.desc-textarea:focus {
  box-shadow: 0 0 0 3px rgba(29, 120, 255, 0.15);
}

.button-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 2rem;
  padding-top: 4rem;
}

.prevBtn,
.nextBtn {
  width: 100%;
  height: rem(50px);
  margin-bottom: 5rem;
}
</style>
