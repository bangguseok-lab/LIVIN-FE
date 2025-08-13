<script setup>
import { useChecklistStore } from '@/stores/checklist'
import { defineProps, onMounted, ref, computed } from 'vue'
import api from '../../api/checklist'
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

const modalState = ref('list') // 'list', 'confirm', 'options'
const selectedChecklistId = ref(null)
const selectedChecklistTitle = ref('')
const checklistItems = ref([])
const checkedOptions = ref({}) // { itemId: boolean } - isChecked 값들을 저장
const currentGroupIndex = ref(0) // 현재 표시되고 있는 그룹의 인덱스

const selectChecklist = async (id, title) => {
  console.log('=== selectChecklist 함수 시작 ===')
  console.log('전달받은 매개변수:', { id, title })
  console.log('매개변수 타입:', {
    idType: typeof id,
    titleType: typeof title,
    idValue: id,
    titleValue: title,
  })

  // id가 undefined인 경우 원본 객체에서 찾아보기
  if (id === undefined || id === null) {
    console.log('ID가 undefined/null입니다. 원본 객체에서 찾아보기...')
    const originalItem = checklist.checklists.find(item => item.title === title)
    if (originalItem) {
      console.log('원본 객체에서 찾은 아이템:', originalItem)
      console.log('원본 객체의 키들:', Object.keys(originalItem))
      id =
        originalItem.id || originalItem.checklistId || originalItem.checklist_id
      console.log('수정된 ID:', id)
    }
  }

  selectedChecklistId.value = id
  selectedChecklistTitle.value = title
  currentGroupIndex.value = 0 // 그룹 인덱스 초기화

  try {
    console.log('API 요청 시작:', `/properties/checklist/${id}/items`)
    const items = await api.getChecklistItems(id)
    console.log('API 응답 받음:', items)

    if (!items || !Array.isArray(items)) {
      console.error('API 응답이 올바르지 않습니다:', items)
      alert('체크리스트 데이터를 가져올 수 없습니다.')
      return
    }

    // API 응답 구조 분석
    console.log('첫 번째 아이템 구조:', items[0])
    console.log('첫 번째 아이템 키들:', Object.keys(items[0]))

    checklistItems.value = items
    // 선택된 옵션 초기화 - isChecked 값 사용
    checkedOptions.value = {}
    items.forEach((item, index) => {
      // keyword가 있으면 keyword 사용, 없으면 title 사용
      const itemTitle = item.keyword || item.title || item.name || '제목 없음'
      const itemId = item.id || item.itemId || item.checklistItemId
      const isChecked = item.isChecked || item.checked || false

      console.log(`아이템 ${index} 설정:`, {
        itemId,
        itemTitle,
        원본isChecked: item.isChecked,
        원본checked: item.checked,
        최종isChecked: isChecked,
        원본아이템: item,
      })

      // checkedOptions에 설정
      checkedOptions.value[itemId] = isChecked

      // 원본 아이템의 isChecked 값도 명시적으로 설정
      if ('isChecked' in item) {
        item.isChecked = Boolean(isChecked)
      }
      if ('checked' in item) {
        item.checked = Boolean(isChecked)
      }
    })

    console.log('체크리스트 아이템 설정 완료:', checklistItems.value)
    console.log('선택된 옵션 상태:', checkedOptions.value)

    // 상태 동기화 확인
    console.log('=== 상태 동기화 확인 ===')
    items.forEach((item, index) => {
      const itemId = item.id || item.itemId || item.checklistItemId
      console.log(`아이템 ${index} 동기화 상태:`, {
        itemId,
        원본isChecked: item.isChecked,
        원본checked: item.checked,
        checkedOptions값: checkedOptions.value[itemId],
        동기화여부: item.isChecked === checkedOptions.value[itemId],
      })
    })
    modalState.value = 'options'
  } catch (error) {
    console.error('체크리스트 아이템을 가져오는데 실패했습니다.', error)
    console.error('에러 상세:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    })

    // 500 에러인 경우 특별한 메시지 제공
    if (error.response?.status === 500) {
      alert(
        `서버 오류가 발생했습니다.\n\n체크리스트 ID: ${id}\n제목: ${title}\n\n잠시 후 다시 시도해주세요.`,
      )
    } else {
      alert(`체크리스트 아이템을 가져오는데 실패했습니다: ${error.message}`)
    }

    // 에러 발생 시 목록 화면으로 돌아가기
    modalState.value = 'list'
  }
}

const confirmApplyChecklist = async () => {
  const payload = {
    checklistId: selectedChecklistId.value,
    propertyId: props.propertyId,
  }
  try {
    await api.propretiesApplyChecklist(payload)
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

const goBackToList = () => {
  modalState.value = 'list'
}

const updateItemState = (item, newValue) => {
  console.log('=== updateItemState 함수 시작 ===')
  const itemId = item.id || item.itemId || item.checklistItemId

  console.log('아이템 상태 업데이트:', {
    item,
    itemId,
    새로운상태: newValue,
    이전isChecked: item.isChecked,
    이전checked: item.checked,
  })

  // 원본 아이템의 isChecked 또는 checked 필드 업데이트
  if ('isChecked' in item) {
    console.log(`item.isChecked 변경: ${item.isChecked} → ${newValue}`)
    item.isChecked = newValue
  }
  if ('checked' in item) {
    console.log(`item.checked 변경: ${item.checked} → ${newValue}`)
    item.checked = newValue
  }

  // checkedOptions도 동기화
  checkedOptions.value[itemId] = newValue

  console.log('업데이트 완료:', {
    itemId,
    새로운상태: newValue,
    업데이트된아이템: item,
    checkedOptions_업데이트후: checkedOptions.value[itemId],
    동기화여부: item.isChecked === checkedOptions.value[itemId],
  })

  console.log('=== updateItemState 함수 완료 ===')
}

const saveOptions = async () => {
  try {
    // 선택된 옵션들을 백엔드로 전송
    const selectedItemIds = Object.keys(checkedOptions.value)
      .filter(id => checkedOptions.value[id])
      .map(id => parseInt(id))

    // 업데이트된 아이템들의 전체 정보 수집
    const updatedItems = checklistItems.value.map(item => {
      const itemId = item.id || item.itemId || item.checklistItemId
      return {
        ...item,
        isChecked: checkedOptions.value[itemId] || false,
        checked: checkedOptions.value[itemId] || false,
      }
    })

    console.log('저장할 데이터:', {
      selectedItemIds,
      updatedItems,
      checkedOptions: checkedOptions.value,
    })

    // TODO: 백엔드 API 엔드포인트에 맞춰 저장 로직 구현
    // const response = await api.updateChecklistItems(selectedChecklistId.value, updatedItems)

    alert('옵션이 저장되었습니다.')
    modalState.value = 'list'
  } catch (error) {
    console.error('옵션 저장에 실패했습니다.', error)
    alert('옵션 저장에 실패했습니다.')
  }
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

const retryLoadChecklists = () => {
  checklist.loadChecklists()
}

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

onMounted(async () => {
  try {
    console.log('체크리스트 목록 요청 시작')

    // 스토어의 메서드 사용
    await checklist.loadChecklists()

    // 직접 API 호출도 시도해보기
    const directResponse = await api.getChecklistTitles()
    console.log('직접 API 응답 전체:', directResponse)
    console.log('직접 API 응답 data:', directResponse?.data)
    console.log('직접 API 응답 data.data:', directResponse?.data?.data)

    // 스토어의 checklists 확인
    console.log('스토어 checklists:', checklist.checklists)

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

    // 각 체크리스트 아이템의 구조 상세 분석
    console.log('최종 체크리스트 목록:', checklist.checklists)
    if (checklist.checklists && checklist.checklists.length > 0) {
      console.log('첫 번째 체크리스트 상세 구조:')
      console.log('전체 객체:', checklist.checklists[0])
      console.log('객체 키들:', Object.keys(checklist.checklists[0]))
      console.log('id 값:', checklist.checklists[0].id)
      console.log('checklistId 값:', checklist.checklists[0].checklistId)
      console.log('title 값:', checklist.checklists[0].title)
    }
  } catch (error) {
    console.error('체크리스트 목록을 가져오는데 실패했습니다:', error)
    console.error('에러 상세:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    })
    checklist.checklists = []
  }
})
</script>
<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div v-if="modalState === 'list'" class="modal-screen">
        <div class="modal-header">
          <h2 class="modal-title">확인하고 싶은 리스트를 선택하세요</h2>
          <p class="modal-subtitle">누르면 해당 체크리스트를 볼 수 있어요</p>
        </div>
        <div class="modal-body">
          <template
            v-if="checklist.checklists && checklist.checklists.length > 0"
          >
            <button
              class="checklist-button"
              v-for="item in checklist.checklists"
              :key="item.id || item.checklistId || item.checklist_id"
              @click="
                () => {
                  console.log('버튼 클릭된 아이템:', item)
                  console.log(
                    '전달할 ID:',
                    item.id || item.checklistId || item.checklist_id,
                  )
                  console.log('전달할 제목:', item.title)
                  selectChecklist(
                    item.id || item.checklistId || item.checklist_id,
                    item.title,
                  )
                }
              "
            >
              {{ item.title }}
              <small v-if="item.id || item.checklistId || item.checklist_id">
                (ID: {{ item.id || item.checklistId || item.checklist_id }})
              </small>
            </button>
          </template>
          <div v-else class="no-checklist">
            <p>등록된 체크리스트가 없습니다.</p>
            <p>디버깅 정보:</p>
            <p>
              checklist.checklists: {{ JSON.stringify(checklist.checklists) }}
            </p>
            <p>checklist.loading: {{ checklist.loading }}</p>
            <p>checklist.error: {{ checklist.error }}</p>

            <!-- 체크리스트가 있지만 길이가 0인 경우 상세 분석 -->
            <div
              v-if="checklist.checklists && checklist.checklists.length === 0"
            >
              <p><strong>체크리스트 배열이 비어있습니다.</strong></p>
            </div>

            <!-- 체크리스트가 있는 경우 각 아이템의 구조 분석 -->
            <div v-if="checklist.checklists && checklist.checklists.length > 0">
              <p><strong>체크리스트 아이템 구조 분석:</strong></p>
              <div
                v-for="(item, index) in checklist.checklists"
                :key="index"
                class="debug-item"
              >
                <p>
                  <strong>아이템 {{ index + 1 }}:</strong>
                </p>
                <p>전체 객체: {{ JSON.stringify(item) }}</p>
                <p>객체 키들: {{ Object.keys(item) }}</p>
                <p>id: {{ item.id }}</p>
                <p>checklistId: {{ item.checklistId }}</p>
                <p>checklist_id: {{ item.checklist_id }}</p>
                <p>title: {{ item.title }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 에러 발생 시 안내 메시지 -->
        <div v-if="checklist.error" class="error-message">
          <p>체크리스트 로딩 중 오류가 발생했습니다.</p>
          <button @click="retryLoadChecklists" class="retry-button">
            다시 시도
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

      <div v-else-if="modalState === 'options'" class="modal-screen">
        <div class="modal-options-header">
          <h2 class="modal-options-title">{{ selectedChecklistTitle }}</h2>
          <button class="apply-another-btn" @click="goBackToList">
            다른 체크리스트 적용하기
          </button>
          <p class="modal-options-subtitle">확인을 마친 항목에 체크하세요</p>
        </div>

        <div class="modal-options-body">
          <button
            v-if="groupedItems.length > 1"
            @click="prevGroup"
            :disabled="currentGroupIndex === 0"
            class="nav-button prev-button"
          >
            ‹
          </button>

          <div class="carousel-content-wrapper">
            <div class="option-group">
              <div class="option-grid">
                <div
                  v-for="item in groupedItems[currentGroupIndex]"
                  :key="item.id || item.itemId || item.checklistItemId"
                  class="option-button-container"
                >
                  <Buttons
                    class="sm"
                    type="sm"
                    :is-checked="item.isChecked || item.checked || false"
                    @update:is-checked="
                      newValue => updateItemState(item, newValue)
                    "
                  >
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
              <span
                v-for="(dot, index) in groupedItems.length"
                :key="index"
                :class="['dot', { active: currentGroupIndex === index }]"
                @click="goToGroup(index)"
              ></span>
            </div>
          </div>

          <button
            v-if="groupedItems.length > 1"
            @click="nextGroup"
            :disabled="currentGroupIndex === groupedItems.length - 1"
            class="nav-button next-button"
          >
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
  background-color: var(--primary-color, #1e90ff); // 파란색
  color: #fff;
}
.confirm-button.no {
  background-color: #e0e0e0; // 회색
  color: #555;
}

// 옵션 모달 스타일
.modal-options-header {
  text-align: center;
  margin-bottom: rem(24px);
  position: relative;
}

.modal-options-title {
  font-size: rem(28px); // 글자 크기를 더 키움
  font-weight: bold;
  margin-bottom: rem(8px);
  color: #333;
  text-align: left; // 좌측 정렬로 변경
}

.apply-another-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  color: var(--primary-color, #1e90ff);
  font-size: rem(14px);
  cursor: pointer;
  text-decoration: underline;
}

.modal-options-subtitle {
  font-size: rem(14px);
  color: #999;
  margin: 0;
  margin-top: rem(16px); // 제목과의 간격을 늘림
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
  color: white; // 흰색 글자로 변경
  text-align: center;
  line-height: 1.2;
  font-weight: 600; // 글자 굵기 늘림
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
  background: #1e90ff; // 단순한 파란색 배경
  color: white;
  border: none;
  border-radius: 50%;
  width: rem(32px); // 크기를 약간 줄여서 더 깔끔하게
  height: rem(32px);
  font-size: rem(16px); // 화살표 크기도 적절하게 조정
  font-weight: normal; // 굵기를 normal로 변경하여 더 깔끔하게
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
    transform: scale(1.05) translateY(-50%); // 호버 시에도 중앙 정렬 유지, 스케일 효과 줄임
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
</style>
