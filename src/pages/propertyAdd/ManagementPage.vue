<script setup>
import { useRouter } from 'vue-router';
import Buttons from '@/components/common/buttons/Buttons.vue';
import { usePropertyStore } from '@/stores/property';
import { onMounted, ref, watch } from 'vue';

const router = useRouter()
const propertyStore = usePropertyStore()

// 선택된 관리 항목 리스트
const selectedItems = ref([])

// "관리비 없음" 체크
const isNoManagement = ref(false)

// 버튼별 상태
const waterBtn = ref(false)
const powerBtn = ref(false)
const internetBtn = ref(false)
const gasBtn = ref(false)
const cleanBtn = ref(false)
const tvBtn = ref(false)
const parkingBtn = ref(false)
const heatingBtn = ref(false)
const elevatorBtn = ref(false)

// 항목명과 버튼 상태를 매핑
const itemsMap = [
  { label: '수도료', state: waterBtn },
  { label: '전기료', state: powerBtn },
  { label: '인터넷비', state: internetBtn },
  { label: '가스비', state: gasBtn },
  { label: '청소비', state: cleanBtn },
  { label: 'TV', state: tvBtn },
  { label: '주차비', state: parkingBtn },
  { label: '난방비', state: heatingBtn },
  { label: '승강기 유지비', state: elevatorBtn },
]

// 숫자만 입력 허용
const onFeeInput = (item, e) => {
  const value = e.target.value.replace(/[^\d]/g, '')
  item.managementFee = value
}

// "쓴 만큼" 클릭 시 관리비 금액을 '쓴 만큼'으로 저장
const onToggleUsed = (item) => {
  if (item.used) item.managementFee = '쓴 만큼'
}

// 각 버튼 상태 변화를 감지해서 selectedItems에 반영
itemsMap.forEach(({ label, state }) => {
  watch(state, (newVal) => {
    if (newVal) {
      // 선택 시 추가 (중복 방지)
      if (!selectedItems.value.find(item => item.managementType === label)) {
        isNoManagement.value = false  // 관리비 없음 해제
        selectedItems.value.push({
          managementType: label,
          managementFee: '',
          used: false
        })
      }
    } else {
      // 해제 시 제거
      selectedItems.value = selectedItems.value.filter(item => item.managementType !== label)
      // 선택된 항목이 하나도 없으면, 관리비 없음 활성화
      if (selectedItems.value.length === 0) {
        isNoManagement.value = true
      }
    }
  })
})

// "관리비 없음" 체크 → 전체 초기화
watch(isNoManagement, (noMgmt) => {
  if (noMgmt) {
    // 모두 해제
    itemsMap.forEach(m => (m.state.value = false))
    selectedItems.value = []
  }
})

// 저장용 변환 함수 (Next에서만 사용)
const buildManagementList = () => {
  if (isNoManagement.value || selectedItems.value.length === 0) {
    return [{ managementType: '관리비 없음', managementFee: '0' }]
  }
  return selectedItems.value.map(({ managementType, managementFee, used }) => ({
    managementType,
    managementFee: used ? '쓴 만큼' : String(managementFee ?? '').trim(),
  }))
}

// 페이지 재진입 시 스토어에서 선택해뒀던 값 가져오기
onMounted(() => {
  isNoManagement.value = !!propertyStore.getNewProperty?.noManagement
  const saved = propertyStore.getNewProperty?.managementList ?? []

  if (saved.length > 0) {
    // 저장되었던 값이 관리비 없음이었던 경우 처리
    if (saved[0].managementType === '관리비 없음') {
      selectedItems.value = [{ managementType: '관리비 없음', managementFee: '0' }]
      isNoManagement.value = true
    } else {
      // 그 외 관리비 항목이 저장되었던 경우 처리
      selectedItems.value = saved.map(({ managementType, managementFee }) => ({
        managementType,
        managementFee: managementFee === '쓴 만큼' ? '' : String(managementFee ?? ''),
        used: managementFee === '쓴 만큼',
      }))
      itemsMap.forEach(({ label, state }) => {
        state.value = selectedItems.value.some(i => i.managementType === label)
      })
      isNoManagement.value = false
    }
  } else {
    if (!isNoManagement.value) isNoManagement.value = true
  }
})

const handlePrevClick = () => {  // 관리비 없음이 아닌 경우 필수 검증
  if (!isNoManagement.value) {
    const invalidItem = selectedItems.value.find(item => !item.used && (!item.managementFee || item.managementFee.trim() === ''))
    if (invalidItem) {
      alert(`${invalidItem.managementType} 금액을 입력해주세요`)
      return
    }
  }

  // 스토어에 저장
  propertyStore.updateNewProperty('managementList', buildManagementList())

  router.push({ name: "roomDetailPage" })
}

const handleNextClick = () => {
  // 관리비 없음이 아닌 경우 필수 검증
  if (!isNoManagement.value) {
    const invalidItem = selectedItems.value.find(item => !item.used && (!item.managementFee || item.managementFee.trim() === ''))
    if (invalidItem) {
      alert(`${invalidItem.managementType} 금액을 입력해주세요`)
      return
    }
  }

  // 스토어에 저장
  propertyStore.updateNewProperty('managementList', buildManagementList())

  router.push({ name: "otherInfoPage" })
}
</script>

<template>
  <div class="ManagementPage">
    <div class="management-container">
      <section class="no-managemet">
        <input type="checkbox" name="noManagement" id="noManagement" v-model="isNoManagement"> <label for="noManagement"
          class="used-label">관리비 없음</label>
      </section>
      <section class="include-items">
        <div class="management-item-wrapper">
          <p class="management-title">관리비에 포함된 항목</p>
          <div class="management-item-btn-wrapper">
            <Buttons type=xs label="수도료" v-model:is-active="waterBtn" class="management-item-btn" />
            <Buttons type=xs label="전기료" v-model:is-active="powerBtn" class="management-item-btn" />
            <Buttons type=xs label="인터넷비" v-model:is-active="internetBtn" class="management-item-btn" />
            <Buttons type=xs label="가스비" v-model:is-active="gasBtn" class="management-item-btn" />
            <Buttons type=xs label="청소비" v-model:is-active="cleanBtn" class="management-item-btn" />
            <Buttons type=xs label="TV" v-model:is-active="tvBtn" class="management-item-btn" />
            <Buttons type=xs label="주차비" v-model:is-active="parkingBtn" class="management-item-btn" />
            <Buttons type=xs label="난방비" v-model:is-active="heatingBtn" class="management-item-btn" />
            <Buttons type=xs label="승강기 유지비" v-model:is-active="elevatorBtn" class="management-item-btn" />
          </div>
        </div>
        <div class="management-detail-wrapper">
          <p class="management-detail-title">관리비 사용료 상세</p>
          <div v-if="selectedItems.length === 0" class="no-item-text">
            관리비에 포함된 항목을 선택해주세요!
          </div>
          <div class="management-input-container">
            <div class="management-input-wrapper" v-for="(item, idx) in selectedItems" :key="item.managementType">
              <div class="input-label">
                {{ item.managementType }}
                <div class="used-checkbox-wrapper">
                  <input type="checkbox" :id="`used-${idx}`" v-model="item.used" class="used-checkbox"
                    @change="onToggleUsed(item)" />
                  <label :for="`used-${idx}`" class="used-label">쓴 만큼</label>
                </div>
              </div>
              <div class="input-field">
                <div class="input-group">
                  <input type="text" v-model="item.managementFee" inputmode="numeric"
                    :placeholder="item.used ? '사용량에 따라 계산' : '금액(만원)을 입력하세요'" id="wolseDeposit"
                    @input="onFeeInput(item, $event)" :disabled="item.used" />
                  <span class="unit" v-if="!item.used">만원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="button-wrapper">
      <Buttons type="default" label="이전" @click="handlePrevClick" class="prevBtn" />
      <Buttons type="default" label="다음" @click="handleNextClick" class="nextBtn" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ManagementPage {
  position: relative;
  width: 100%;
  height: 90%;
}

.management-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.no-managemet {
  width: 100%;
  border-bottom: 1px solid var(--grey);
  margin-bottom: 1.5rem;
}


// 포함된 관리비 항목 부분
.include-items {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.management-item-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;

  margin-bottom: 2rem;
}

.management-title {
  font-size: 1.2rem;
  font-weight: var(--font-weight-semibold);
  color: var(--title-text);
}

.management-item-btn-wrapper {

  display: grid;
  grid-template-columns: repeat(5, 1fr);
  row-gap: 1rem;
  width: 100%;
  column-gap: 0.5rem;
}

.management-item-btn {
  width: 100%;
}

.management-item-btn:deep(.button) {
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: var(--font-weight-medium);

}


// 관리비 사용료 상세 부분
.management-detail-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1rem;
}

.management-detail-title {
  font-size: 1.2rem;
  font-weight: var(--font-weight-semibold);
  color: var(--title-text);
}


// 입력란
.management-input-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 2rem;
  row-gap: 1.5rem;
}

.no-item-text {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 15rem;
  font-size: 1.1rem;
  font-weight: var(--font-weight-semibold);
  color: var(--primary-color);
}

.management-input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: .2rem;
  margin-bottom: .9rem;
}


.input-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-weight: var(--font-weight-semibold);
}

.used-checkbox {
  margin-left: 1rem;
}

.used-label {
  margin-left: .4rem;
}

.used-label:hover {
  cursor: pointer;
}

.input-field {
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


// 이전, 다음 버튼 부분
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
