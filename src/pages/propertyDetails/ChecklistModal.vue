<script setup>
import { useChecklistStore } from '@/stores/checklist'
import { defineProps, onMounted, ref, computed } from 'vue'
import checklistAPI from '../../api/checklist'
import Buttons from '@/components/common/buttons/Buttons.vue'

const props = defineProps({
  propertyId: {
    type: Number,
    required: true,
  },
})

const checklist = useChecklistStore()
const emit = defineEmits(['close'])
const close = () => {
  emit('close')
}

// --- 상태 변수 수정 ---
const modalState = ref('loading') // 'loading', 'list', 'applyConfirm', 'replaceConfirm', 'options'
const templateToApply = ref(null) // 사용자가 선택한 템플릿을 임시 저장
const selectedChecklistId = ref(null) // 현재 보고있는 개인화 체크리스트의 ID
const selectedChecklistTitle = ref('')
const checklistItems = ref([])
const checkedOptions = ref({}) // { itemId: boolean } - isChecked 값들을 저장
const currentGroupIndex = ref(0) // 현재 표시되고 있는 그룹의 인덱스

// 제목에서 '(매물명)' 부분을 제거하는 함수
const formatDisplayTitle = title => {
  if (!title) return ''
  // '(' 문자를 기준으로 문자열을 나누고, 첫 번째 부분의 양쪽 공백을 제거하여 반환
  return title.split('(')[0].trim()
}

// 매물 페이지 진입 시 실행되는 메인 함수
const initializePropertyChecklist = async () => {
  modalState.value = 'loading'
  try {
    console.log('=== initializePropertyChecklist 시작 ===')

    // 템플릿 목록을 가장 먼저 불러오도록 구현
    // 어떤 화면으로 이동하든 목록 데이터가 항상 준비되어 있는 상태 (그렇지 않을 경우, '다른 목록 적용하기' 버튼 클릭 시 빈 목록 출력)
    await loadTemplateChecklists()

    console.log('매물 ID:', props.propertyId)

    // 이 매물에 이미 생성된 개인화 체크리스트가 있는지 조회
    const response = await checklistAPI.getPersonalizedChecklistForProperty(
      props.propertyId,
    )
    console.log('개인화 체크리스트 조회 결과:', response)

    // response가 존재하고, 안에 items 배열이 있는지 확인
    if (response && response.items && response.items.length > 0) {
      // 있으면, 응답 객체 전체를 setup 함수로 넘겨준다
      console.log('기존 개인화 체크리스트를 발견했습니다.', response)
      setupOptionsScreen(response)
    } else {
      // 없으면, 템플릿 선택 화면으로 전환
      console.log(
        '개인화 체크리스트가 없습니다. 템플릿 목록 화면으로 이동합니다.',
      )
      modalState.value = 'list'
    }
  } catch (error) {
    console.error('체크리스트 초기화 중 에러 발생:', error)
    alert('체크리스트 정보를 가져오는 데 실패했습니다.')
    close()
  }
}

// 템플릿 체크리스트 목록 로딩
const loadTemplateChecklists = async () => {
  try {
    console.log('템플릿 체크리스트 목록 로딩 시작')

    // 스토어의 메서드 사용
    await checklist.loadChecklists()

    // 직접 API 호출 시도
    const directResponse = await checklistAPI.getChecklistTitles()
    console.log('직접 API 응답 전체:', directResponse)

    // 스토어에 데이터가 없으면 직접 설정
    if (!checklist.checklists || checklist.checklists.length === 0) {
      console.log('스토어에 데이터가 없어 직접 설정')
      if (directResponse?.data?.data) {
        checklist.checklists = directResponse.data.data
      } else if (directResponse?.data) {
        checklist.checklists = directResponse.data
      } else {
        checklist.checklists = directResponse || []
      }
    }

    console.log('최종 템플릿 체크리스트 목록:', checklist.checklists)
  } catch (error) {
    console.error('템플릿 체크리스트 목록을 가져오는데 실패했습니다:', error)
    checklist.checklists = []
  }
}

// 옵션 화면을 설정하는 공통 함수
const setupOptionsScreen = checklistData => {
  console.log('=== setupOptionsScreen 시작 ===')
  console.log('설정할 체크리스트 데이터:', checklistData)

  // API 응답에서 직접 제목과 ID, 아이템 목록을 설정
  selectedChecklistId.value = checklistData.checklistId
  selectedChecklistTitle.value = checklistData.title
  checklistItems.value = checklistData.items

  // isChecked 상태 초기화
  checkedOptions.value = checklistData.items.reduce((acc, item) => {
    const itemId = item.checklistItemId || item.id || item.itemId
    if (itemId) {
      const isChecked = item.isChecked || item.checked || false
      acc[itemId] = isChecked
      console.log(`[DEBUG] checkedOptions 초기화: ${itemId} = ${isChecked}`)
    }
    return acc
  }, {})

  console.log('[DEBUG] 초기화된 checkedOptions:', checkedOptions.value)
  currentGroupIndex.value = 0
  modalState.value = 'options' // 옵션 화면으로 전환
}

// 사용자가 목록에서 템플릿을 클릭하면, 먼저 확인창을 띄움
const selectTemplate = template => {
  console.log('=== selectTemplate 함수 시작 ===')
  console.log('선택된 템플릿:', template)

  templateToApply.value = template
  modalState.value = 'applyConfirm'
}

// '아니오'를 눌렀을 때 목록으로 돌아감
const cancelApply = () => {
  templateToApply.value = null
  modalState.value = 'list'
}

// '예'를 눌렀을 때 복제 로직 실행
const confirmAndClone = async () => {
  if (!templateToApply.value) return

  try {
    console.log('=== confirmAndClone 시작 ===')
    console.log('적용할 템플릿:', templateToApply.value)

    // 체크리스트 ID 추출 (여러 가능한 필드명 시도)
    const sourceChecklistId =
      templateToApply.value.id ||
      templateToApply.value.checklistId ||
      templateToApply.value.checklist_id

    if (!sourceChecklistId) {
      console.error(
        '템플릿 체크리스트 ID를 찾을 수 없습니다:',
        templateToApply.value,
      )
      alert('템플릿 체크리스트 ID를 찾을 수 없습니다.')
      return
    }

    console.log('소스 체크리스트 ID:', sourceChecklistId)

    // 선택한 템플릿으로 '복제 생성' API 호출
    const response = await checklistAPI.cloneChecklistForProperty(
      props.propertyId,
      sourceChecklistId,
    )
    console.log('복제 생성 API 응답:', response)

    const newChecklistId = response.newChecklistId || response.id

    if (!newChecklistId) {
      throw new Error('복제된 체크리스트 ID를 받지 못했습니다.')
    }

    console.log('새로 생성된 체크리스트 ID:', newChecklistId)

    // 생성 성공 후, 생성된 체크리스트 정보를 다시 조회하여 화면에 표시
    await initializePropertyChecklist()
  } catch (error) {
    console.error('체크리스트 복제 및 적용에 실패했습니다.', error)
    alert('체크리스트를 적용하는 데 실패했습니다: ' + error.message)
  } finally {
    templateToApply.value = null
  }
}

// 기존 selectChecklist 함수를 selectTemplate으로 대체
const selectChecklist = title => {
  console.log('=== selectChecklist 함수 시작 ===')
  console.log('전달받은 제목:', title)

  // 체크리스트 제목으로 해당 체크리스트 찾기
  const selectedChecklist = checklist.checklists.find(
    item => item.title === title,
  )

  if (!selectedChecklist) {
    console.error('선택된 체크리스트를 찾을 수 없습니다:', title)
    alert('체크리스트를 찾을 수 없습니다.')
    return
  }

  console.log('선택된 체크리스트:', selectedChecklist)

  // 템플릿 선택 확인창으로 이동
  selectTemplate(selectedChecklist)
}

// 옵션 상태 변경
const updateItemState = (item, newValue) => {
  const itemId = item.checklistItemId || item.id || item.itemId

  console.log('=== updateItemState 함수 시작 ===')
  console.log(`[DEBUG] 전달받은 매개변수:`, { item, newValue })
  console.log(`[DEBUG] itemId: ${itemId}`)
  console.log(`[DEBUG] newValue 타입: ${typeof newValue}, 값: ${newValue}`)

  // checkedOptions 객체에서 해당 itemId의 상태만 업데이트
  if (itemId) {
    const oldValue = checkedOptions.value[itemId]
    checkedOptions.value[itemId] = newValue
    console.log(
      `[DEBUG] checkedOptions[${itemId}] 업데이트: ${oldValue} → ${newValue}`,
    )

    // 값이 실제로 변경되었는지 확인
    if (oldValue !== newValue) {
      console.log(`[DEBUG] ✅ 값이 성공적으로 변경되었습니다!`)
    } else {
      console.log(`[DEBUG] ⚠️ 값이 변경되지 않았습니다.`)
    }
  } else {
    console.error(`[DEBUG] ❌ itemId를 찾을 수 없습니다:`, item)
  }

  // 원본 아이템 배열도 업데이트 (UI 동기화를 위해)
  const itemToUpdate = checklistItems.value.find(
    i => (i.checklistItemId || i.id || i.itemId) === itemId,
  )
  if (itemToUpdate) {
    const oldIsChecked = itemToUpdate.isChecked
    const oldChecked = itemToUpdate.checked
    itemToUpdate.isChecked = newValue
    itemToUpdate.checked = newValue
    console.log(`[DEBUG] 원본 아이템 업데이트:`, {
      itemId,
      oldIsChecked,
      oldChecked,
      newIsChecked: itemToUpdate.isChecked,
      newChecked: itemToUpdate.checked,
    })
  } else {
    console.error(`[DEBUG] ❌ 원본 아이템을 찾을 수 없습니다:`, itemId)
  }

  console.log('=== updateItemState 함수 완료 ===')
}

// 변경된 옵션을 저장하는 함수
const saveOptions = async () => {
  try {
    console.log('=== saveOptions 함수 시작 ===')
    console.log(
      '[DEBUG] 현재 checkedOptions 상태:',
      JSON.stringify(checkedOptions.value),
    )

    // checkedOptions 객체를 기반으로 백엔드에 보낼 payload 생성
    const payload = Object.keys(checkedOptions.value).map(itemId => {
      const payloadItem = {
        checklistItemId: parseInt(itemId),
        isChecked: checkedOptions.value[itemId],
      }
      console.log(`[DEBUG] payload 아이템 생성:`, payloadItem)
      return payloadItem
    })

    console.log('[DEBUG] 백엔드로 보낼 최종 payload:', JSON.stringify(payload))
    console.log('[DEBUG] selectedChecklistId:', selectedChecklistId.value)
    console.log('[DEBUG] propertyId:', props.propertyId)

    // 수정된 '업데이트' API 호출 - propertyId 포함
    await checklistAPI.updateChecklistItemsWithProperty(
      props.propertyId,
      selectedChecklistId.value,
      payload,
    )

    alert('옵션이 성공적으로 저장되었습니다.')
    close() // 저장 후 모달 닫기
  } catch (error) {
    console.error('옵션 저장에 실패했습니다.', error)
    alert(
      '옵션 저장에 실패했습니다: ' +
      (error.response?.data?.message || error.message),
    )
  }
}

// 기존 함수들 (UI 관련)
const confirmApplyChecklist = async () => {
  const payload = {
    checklistId: selectedChecklistId.value,
    propertyId: props.propertyId,
  }
  try {
    await checklistAPI.propretiesApplyChecklist(payload)
    alert('체크리스트가 성공적으로 적용되었습니다.')
    close()
  } catch (error) {
    console.error('체크리스트 적용에 실패했습니다.', error)
    alert('체크리스트 적용에 실패했습니다.')
  }
}

const cancelApplyChecklist = () => {
  modalState.value = 'list'
}

// '다른 체크리스트 적용하기' 버튼을 누르면 확인창을 띄움
const promptToReplace = () => {
  modalState.value = 'replaceConfirm'
}

// '예'를 눌렀을 때 목록으로 이동
const confirmReplace = () => {
  modalState.value = 'list'
}

// '아니오'를 눌렀을 때 옵션 화면에 머무름
const cancelReplace = () => {
  modalState.value = 'options'
}

// 아이템들을 9개씩 그룹화
const groupedItems = computed(() => {
  const groups = []
  for (let i = 0; i < checklistItems.value.length; i += 9) {
    groups.push(checklistItems.value.slice(i, i + 9))
  }
  console.log('그룹화된 아이템들:', groups)
  return groups
})

// 그룹 간 전환을 위한 내비게이션 함수들
const nextGroup = () => {
  if (currentGroupIndex.value < groupedItems.value.length - 1) {
    currentGroupIndex.value++
  }
}

const prevGroup = () => {
  if (currentGroupIndex.value > 0) {
    currentGroupIndex.value--
  }
}

const goToGroup = groupIndex => {
  if (groupIndex >= 0 && groupIndex < groupedItems.value.length) {
    currentGroupIndex.value = groupIndex
  }
}

// 컴포넌트가 마운트될 때 메인 로직 실행
onMounted(() => {
  initializePropertyChecklist()
})
</script>
<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div v-if="modalState === 'loading'" class="modal-screen">
        <div class="modal-header">
          <h2 class="modal-title">체크리스트 로딩 중...</h2>
          <p class="modal-subtitle">매물 정보를 불러오고 있습니다.</p>
        </div>
        <div class="modal-body">
          <div class="loading-spinner"></div>
          <p>체크리스트 정보를 가져오는 데 시간이 걸릴 수 있습니다.</p>
        </div>
      </div>

      <div v-else-if="modalState === 'list'" class="modal-screen">
        <div class="modal-header">
          <h2 class="modal-title">체크리스트 선택</h2>
          <p class="modal-subtitle">적용할 체크리스트를 선택해주세요</p>
        </div>

        <div class="modal-body">
          <button v-for="checklist in checklist.checklists" :key="checklist.id"
            @click="selectChecklist(checklist.title)" class="checklist-button">
            {{ formatDisplayTitle(checklist.title) }}
          </button>
        </div>
      </div>

      <div v-else-if="modalState === 'confirm'" class="modal-screen">
        <div class="modal-confirm-header">
          <h2 class="modal-confirm-title">이 체크리스트를 적용하시겠어요?</h2>
          <p class="modal-confirm-subtitle">
            나중에 다시 체크리스트를 변경할 수 있어요
          </p>
        </div>
        <div class="modal-confirm-body">
          <button class="confirm-button yes" @click="confirmApplyChecklist">
            예
          </button>
          <button class="confirm-button no" @click="cancelApplyChecklist">
            아니오
          </button>
        </div>
      </div>

      <div v-else-if="modalState === 'applyConfirm'" class="modal-screen">
        <div class="modal-confirm-header">
          <h2 class="modal-confirm-title">
            {{ templateToApply?.title }}(으)로 적용해 볼까요?
          </h2>
          <p class="modal-confirm-subtitle">
            선택한 체크리스트는 변경하실 수 있어요!
          </p>
        </div>
        <div class="modal-confirm-body">
          <button class="confirm-button yes" @click="confirmAndClone">
            예
          </button>
          <button class="confirm-button no" @click="cancelApply">아니오</button>
        </div>
      </div>

      <div v-else-if="modalState === 'replaceConfirm'" class="modal-screen">
        <div class="modal-confirm-header">
          <h2 class="modal-confirm-title">
            정말 다른 체크리스트로 적용하시겠어요?
          </h2>
          <p class="modal-confirm-subtitle">
            이 경우에 기존에 생성하신 체크리스트 옵션 정보는 사라지게 돼요!
          </p>
        </div>
        <div class="modal-confirm-body">
          <button class="confirm-button yes" @click="confirmReplace">예</button>
          <button class="confirm-button no" @click="cancelReplace">
            아니오
          </button>
        </div>
      </div>

      <div v-else-if="modalState === 'options'" class="modal-screen">
        <div class="modal-options-header">
          <h2 class="modal-options-title">
            {{ formatDisplayTitle(selectedChecklistTitle) }}
          </h2>
          <button class="apply-another-btn" @click="promptToReplace">
            다른 체크리스트 적용하기
          </button>
          <p class="modal-options-subtitle">확인을 마친 항목에 체크하세요</p>
        </div>

        <div class="modal-options-body">
          <button v-if="groupedItems.length > 1" @click="prevGroup" :disabled="currentGroupIndex === 0"
            class="nav-button prev-button">
            ‹
          </button>

          <div class="carousel-content-wrapper">
            <div class="option-group">
              <div class="option-grid">
                <div v-for="item in groupedItems[currentGroupIndex]"
                  :key="item.id || item.itemId || item.checklistItemId" class="option-button-container">
                  <Buttons class="sm" type="sm" :is-checked="checkedOptions[
                    item.id || item.itemId || item.checklistItemId
                    ] || false
                    " @update:is-checked="
                      newValue => updateItemState(item, newValue)
                    ">
                    <div class="option-text">
                      {{
                        item.keyword || item.title || item.name || '제목 없음'
                      }}
                    </div>
                  </Buttons>
                </div>
              </div>
            </div>

            <div v-if="groupedItems.length > 1" class="pagination-dots">
              <span v-for="(dot, index) in groupedItems.length" :key="index"
                :class="['dot', { active: currentGroupIndex === index }]" @click="goToGroup(index)"></span>
            </div>
          </div>

          <button v-if="groupedItems.length > 1" @click="nextGroup"
            :disabled="currentGroupIndex === groupedItems.length - 1" class="nav-button next-button">
            ›
          </button>
        </div>

        <div class="modal-options-footer">
          <button class="save-button" @click="saveOptions">저장</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #f7f7f7;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  padding: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  position: relative; // 슬라이더 버튼의 절대 위치 기준점
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: rem(24px);
  text-align: center;
}

.modal-title {
  font-size: rem(20px);
  font-weight: bold;
  margin: 0 0 rem(8px) 0;
  color: #333;
}

.modal-subtitle {
  font-size: rem(14px);
  color: #999;
  margin: 0;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: rem(12px);
}

.checklist-button {
  width: 100%;
  padding: rem(16px);
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: rem(8px);
  font-size: rem(16px);
  color: #555;
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
    border-color: #ccc;
  }
}

// 확인 모달 화면 스타일
.modal-confirm-header {
  text-align: center;
  margin-bottom: rem(32px);
}

.modal-confirm-title {
  font-size: rem(20px);
  font-weight: bold;
  margin-bottom: rem(8px);
}

.modal-confirm-subtitle {
  font-size: rem(14px);
  color: #999;
}

.modal-confirm-body {
  display: flex;
  justify-content: space-between;
  gap: rem(12px);
}

.confirm-button {
  flex: 1;
  padding: rem(16px);
  border: none;
  border-radius: rem(8px);
  font-size: rem(16px);
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

.confirm-button.yes {
  background-color: var(--primary-color, #1e90ff);
  color: #fff;
}

.confirm-button.no {
  background-color: #e0e0e0;
  color: #555;
}

// 옵션 모달 스타일
.modal-options-header {
  text-align: center;
  margin-bottom: rem(24px);
  position: relative;
}

.modal-options-title {
  margin-top: .3rem;
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: rem(28px);
  font-weight: bold;
  margin-bottom: rem(8px);
  color: #333;
  text-align: left;
}

.apply-another-btn {
  position: absolute;
  top: rem(-30px);
  right: 0;
  background: none;
  border: none;
  color: var(--primary-color, #1e90ff);
  font-size: 0.7rem;
  cursor: pointer;
  text-decoration: underline;
}

.modal-options-subtitle {
  font-size: rem(14px);
  color: #999;
  margin: 0;
  margin-top: rem(16px);
}

.modal-options-body {
  // 위치 속성 제거, flex 속성과 패딩만 유지
  flex: 1;
  margin-bottom: rem(24px);
  padding: 0;
  display: flex;
  flex-direction: column;
}

.carousel-content-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: rem(10px) 0;
}

.option-group {
  display: flex;
  justify-content: center;
  width: 100%; // 부모 너비를 꽉 채우도록 설정
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: rem(12px);
  margin-bottom: rem(16px);
  width: 100%; // 부모 너비를 꽉 채우도록 설정
  max-width: rem(340px); // 그리드의 최대 너비를 약간 줄여 좌우 여백 확보
  justify-content: center; // 그리드 내 아이템들을 중앙 정렬
}

.option-button-container {
  display: flex;
  justify-content: center;

  .sm {
    transition: all 0.2s ease; // 부드러운 전환 효과

    &:hover {
      transform: scale(1.02); // 호버 시 약간의 스케일 효과
    }
  }
}

.option-text {
  font-size: rem(14px);
  color: white;
  text-align: center;
  line-height: 1.2;
  font-weight: 600;
}

.pagination-dots {
  display: flex;
  justify-content: center;
  gap: rem(8px);
  margin-top: rem(16px);
}

.dot {
  width: rem(8px);
  height: rem(8px);
  border-radius: 50%;
  background-color: #ccc;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #999;
  }
}

.dot.active {
  background-color: var(--primary-color, #1e90ff);
}

.modal-options-footer {
  display: flex;
  justify-content: center;
}

.save-button {
  width: 100%;
  padding: rem(16px);
  background-color: var(--primary-color, #1e90ff);
  color: white;
  border: none;
  border-radius: rem(8px);
  font-size: rem(16px);
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

// 네비게이션 버튼 절대 위치 설정
.nav-button {
  background: #1e90ff;
  color: white;
  border: none;
  border-radius: 50%;
  width: rem(32px);
  height: rem(32px);
  font-size: rem(16px);
  font-weight: normal;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease; // 부드러운 전환 효과
  flex-shrink: 0;

  // 새로운 절대 위치 설정
  position: absolute;
  top: 50%;
  transform: translateY(-50%); // 수직 중앙 정렬
  z-index: 10;

  &:hover:not(:disabled) {
    background: #0066cc; // 호버 시 더 진한 파란색
    transform: scale(1.05) translateY(-50%);
  }

  &:disabled {
    background: #cccccc; // 비활성화 시 회색
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.nav-button.prev-button {
  left: rem(16px); // modal-content의 좌측 가장자리 기준으로 위치
}

.nav-button.next-button {
  right: rem(16px); // modal-content의 우측 가장자리 기준으로 위치
}

// 다른 버튼들이 이 스타일을 상속받지 않도록 설정
.confirm-button,
.save-button {
  position: relative;
}

.error-message {
  text-align: center;
  color: #ff0000;
  margin-top: rem(20px);
  padding: rem(10px);
  background-color: #ffebee;
  border-radius: rem(8px);
  border: 1px solid #ffcdd2;
}

.retry-button {
  margin-top: rem(10px);
  padding: rem(8px) rem(16px);
  background-color: var(--primary-color, #1e90ff);
  color: white;
  border: none;
  border-radius: rem(8px);
  font-size: rem(14px);
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

// 로딩 스피너 스타일
.loading-spinner {
  width: rem(40px);
  height: rem(40px);
  border: rem(4px) solid #f3f3f3;
  border-top: rem(4px) solid var(--primary-color, #1e90ff);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto rem(20px);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
