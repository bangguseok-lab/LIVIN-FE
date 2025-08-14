<script setup>
import { useRouter } from 'vue-router';
import Buttons from '@/components/common/buttons/Buttons.vue';
import { usePropertyStore } from '@/stores/property';
import { onMounted, ref } from 'vue';

const router = useRouter()
const propertyStore = usePropertyStore()

const exclusiveArea = ref('')   // 전용면적
const supplyArea = ref('')      // 공급면적
const roomCnt = ref('')         // 방 개수
const bathRoomCnt = ref('')     // 욕실 개수
const floor = ref('')           // 층
const isDuplex = ref(false)     // 복층 여부


const inputExclusiveArea = (e) => {
  // 소수점 한 개만 허용: 12.34 형태
  let v = e.target.value
    .replace(/[^\d.]/g, '')     // 숫자/점 이외 제거
    .replace(/^(\d*\.\d*?)\.+/g, '$1') // 점 두 번 이상 금지
    .replace(/^0+(\d)/, '$1')   // 선행 0 정리 (원하면 유지해도 됨)

  e.target.value = v
  exclusiveArea.value = v
}

const inputSupplyArea = (e) => {
  let v = e.target.value
    .replace(/[^\d.]/g, '')     // 숫자/점 이외 제거
    .replace(/^(\d*\.\d*?)\.+/g, '$1') // 점 두 번 이상 금지
    .replace(/^0+(\d)/, '$1')   // 선행 0 정리 (원하면 유지해도 됨)

  e.target.value = v
  supplyArea.value = v
}


const handlePrevClick = () => {
  if (exclusiveArea.value !== '' && supplyArea.value !== '' && roomCnt.value > 0 && bathRoomCnt.value > 0 && floor.value !== '') {
    propertyStore.updateNewProperty('exclusiveArea', exclusiveArea.value)
    propertyStore.updateNewProperty('supplyArea', supplyArea.value)
    propertyStore.updateNewProperty('roomCnt', roomCnt.value)
    propertyStore.updateNewProperty('bathRoomCnt', bathRoomCnt.value)
    propertyStore.updateNewProperty('floor', floor.value)
    propertyStore.updateNewProperty('isDuplex', isDuplex.value)
  }
  router.push({ name: "roomDirectionPage" })
}

const handleNextClick = () => {
  if (exclusiveArea.value !== '' && supplyArea.value !== '' && roomCnt.value > 0 && bathRoomCnt.value > 0 && floor.value !== '') {
    propertyStore.updateNewProperty('exclusiveArea', exclusiveArea.value)
    propertyStore.updateNewProperty('supplyArea', supplyArea.value)
    propertyStore.updateNewProperty('roomCnt', roomCnt.value)
    propertyStore.updateNewProperty('bathRoomCnt', bathRoomCnt.value)
    propertyStore.updateNewProperty('floor', floor.value)
    propertyStore.updateNewProperty('isDuplex', isDuplex.value)

    router.push({ name: "managementPage" })
  } else {
    alert('모든 항목을 입력해주세요')
  }
}

onMounted(() => {
  // 위험도 분석에서 층, 면적 정보를 받아오는 경우
  exclusiveArea.value = propertyStore.getNewProperty?.exclusiveArea ?? ''
  supplyArea.value = propertyStore.getNewProperty?.supplyArea ?? ''
  roomCnt.value = propertyStore.getNewProperty?.roomCnt ?? ''
  bathRoomCnt.value = propertyStore.getNewProperty?.bathRoomCnt ?? ''
  floor.value = propertyStore.getNewProperty?.floor ?? ''
  isDuplex.value = propertyStore.getNewProperty?.isDuplex ?? false

})
</script>

<template>
  <div class="RoomDetailPage">
    <div class="roomDetail-container">
      <section class="detail-wrapper">
        <div class="title">면적</div>
        <div class="area-wrapper">
          <div class="area-input-wrapper">
            <div class="input-label">전용면적</div>
            <div class="input-field">
              <div class="input-group area-input">
                <input type="text" inputmode="numeric" placeholder="면적을 입력하세요" id="exclusiveArea"
                  @input="inputExclusiveArea" v-model="exclusiveArea" />
                <span class="unit">㎡</span>
              </div>
            </div>
          </div>
          <div class="area-input-wrapper">
            <div class="input-label">공급면적</div>
            <div class="input-field">
              <div class="input-group">
                <input type="text" inputmode="numeric" placeholder="면적을 입력하세요" id="supplyArea" @input="inputSupplyArea"
                  v-model="supplyArea" />
                <span class="unit">㎡</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="detail-wrapper">
        <div class="title">방 / 욕실</div>
        <div class="room-count-wrapper">
          <div class="room-count-box">
            <div class="input-label">방 개수</div>
            <div class="count-input-field">
              <div class="input-group">
                <input type="number" inputmode="numeric" placeholder="0" id="roomcount" v-model="roomCnt" />
                <span class="unit">개</span>
              </div>
            </div>
          </div>
          <div class="room-count-box">
            <div class="input-label">욕실 개수</div>
            <div class="count-input-field">
              <div class="input-group">
                <input type="number" inputmode="numeric" placeholder="0" id="bathroomcount" v-model="bathRoomCnt" />
                <span class="unit">개</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="detail-wrapper">
        <div class="title">층</div>
        <div class="duplex-wrapper">
          <div class="area-input-wrapper">
            <div class="input-label">층수</div>
            <div class="input-field">
              <div class="input-group">
                <input type="number" inputmode="numeric" placeholder="매물의 층을 입력하세요" id="floor" v-model="floor" />
                <span class="unit">층</span>
              </div>
            </div>
          </div>
          <div class="duplex-button-wrapper">
            <div class="input-label">복층 여부</div>
            <div class="input-field">
              <Buttons v-model:is-active="isDuplex" type="floor" label="복층입니다" />
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
.RoomDetailPage {
  position: relative;
  width: 100%;
  height: 90%;
}

.roomDetail-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  // height: 70%;
}

.detail-wrapper {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  margin-bottom: 1rem;
  border-top: .2rem solid var(--whitish);
  // border-bottom: .2rem solid var(--whitish);
}

.title {
  font-size: 1.2rem;
  font-weight: var(--font-weight-bold);
  color: var(--title-text);
}

.area-wrapper {
  margin-top: 1rem;
}

// 방 / 욕실 개수 section
.room-count-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  column-gap: 1rem;
  margin-top: 1rem;
}

.room-count-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.room-count-box>.input-label {
  margin-bottom: .4rem;
  padding-left: .2rem;
}

// 복층 여부 section
.duplex-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: .4rem;
  margin-top: 1rem;
}

.duplex-button-wrapper {
  display: flex;
  align-items: center;
}

.duplex-button-wrapper>.input-label {
  width: 20%;
}

.duplex-button-wrapper>.input-field>.Buttons:deep(.btn-floor) {
  width: 100%;
}

.duplex-button-wrapper>.input-field>.Buttons:deep(.btn-floor):hover {
  cursor: pointer;
  border: .1rem solid var(--primary-color);
  color: var(--primary-color);
}

// 입력창 관련 스타일
.area-input-wrapper {
  display: grid;
  grid-template-columns: 4rem 1fr;
  align-items: center;
  gap: .6rem;
  margin-bottom: .6rem;
}

.input-label {
  font-size: 1rem;
  font-weight: var(--font-weight-bold);
  color: var(--title-text);
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
  font-size: .8rem;
  font-weight: var(--font-weight-medium);
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
  font-weight: var(--font-weight-medium);
  font-size: 1rem;
  color: #9ca3af;
  pointer-events: none; // 클릭 비활성화
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

@media (max-width: 375px) {
  .detail-wrapper {
    display: flex;
    flex-direction: column;
    padding: 1.6rem;
    border-top: .2rem solid var(--whitish);
    // border-bottom: .2rem solid var(--whitish);
  }

  .title {
    font-size: 1rem;
    font-weight: var(--font-weight-bold);
    color: var(--title-text);
  }

  .input-label {
    font-size: .8rem;
    font-weight: var(--font-weight-bold);
    color: var(--title-text);
  }

  .input-field {
    width: 100%;
  }

  .input-group input {
    width: 100%;
    height: 2rem;
    padding-right: 3.25rem;
    padding-left: .875rem;
    border: 0; // 만원 글씨랑 겹쳐서 무테로 적용
    background: transparent;
    font-size: 0.875rem;
    outline: none;
    transition: border-color .15s, box-shadow .15s;
  }

  .input-group input::placeholder {
    font-size: .6rem;
    font-weight: var(--font-weight-medium);
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
    font-weight: var(--font-weight-semibold);
    font-size: .6rem;
    color: #9ca3af;
    pointer-events: none; // 클릭 비활성화
  }

  .duplex-button-wrapper>.input-label {
    width: 40%;
  }

  .duplex-button-wrapper>.input-field>.Buttons:deep(.btn-floor):hover {
    cursor: pointer;
    border: .1rem solid var(--primary-color);
    color: var(--primary-color);
  }
}
</style>
