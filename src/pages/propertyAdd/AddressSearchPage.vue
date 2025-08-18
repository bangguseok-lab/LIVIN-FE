<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/property'
import Buttons from '@/components/common/buttons/Buttons.vue'
import { VueDaumPostcode } from 'vue-daum-postcode'

const router = useRouter()
const propertyStore = usePropertyStore()

const postcode = ref('')
const address = ref('')
const detailAddress = ref('')
const extraAddress = ref('')
const propertyName = ref('')
const isPostcodeVisible = ref(false) // iframe 표시 여부

// 본번/부번 추출 헬퍼
function extractBuildingNo(addr) {
  // 주소 끝의 "숫자" 또는 "숫자-숫자"만 추출 (도로명 끝의 본번·부번)
  const m = addr.match(/(\d+)(?:-(\d+))?$/)
  return {
    buildingNo: m?.[1] ?? '0',
    buildingSubNo: m?.[2] ?? '0',
  }
}

// 주소 선택 시 동작할 콜백
const handleComplete = data => {
  let addr = ''
  let extraAddr = ''
  // 주소 설정
  // 검색된 기본 주소 타입: R(도로명), J(지번)
  if (data.userSelectedType === 'R') {
    // userSelectedType: 검색 결과에서 사용자가 선택한 주소의 타입
    addr = data.roadAddress

    // 도로명 주소일 때 본번/부번 추출
    const { buildingNo, buildingSubNo } = extractBuildingNo(addr)
    propertyStore.updateNewProperty('buildingNo', buildingNo)
    propertyStore.updateNewProperty('buildingSubNo', buildingSubNo)
  } else {
    addr = data.jibunAddress
    // 지번 선택 시 본번/부번 개념 없음 → 0 처리
    extraAddress.value = ''
    propertyStore.updateNewProperty('buildingNo', '0')
    propertyStore.updateNewProperty('buildingSubNo', '0')
  }

  // 참고항목 설정 (도로명일 때만)
  if (data.userSelectedType === 'R') {
    if (data.bname && /[동|로|가]$/g.test(data.bname)) {
      extraAddr += data.bname
    }
    if (data.buildingName && data.apartment === 'Y') {
      extraAddr += (extraAddr !== '' ? ', ' : '') + data.buildingName
      propertyName.value = data.buildingName
    }
    if (extraAddr !== '') {
      extraAddr = ` (${extraAddr})`
    }
    extraAddress.value = extraAddr
  } else {
    extraAddress.value = ''
  }

  // 입력 필드에 데이터 반영
  postcode.value = data.zonecode // 우편번호
  address.value = addr // 검색된 도로명 주소

  // 상세주소 필드로 포커스 이동
  setTimeout(() => {
    document.getElementById('detailAddress')?.focus()
  }, 100)

  // 주소 선택 완료 시 우편 번호창 숨기기
  isPostcodeVisible.value = false
}

// "우편번호 찾기" 버튼 클릭 시 iframe(주소 검색창) 보이게 설정
const openPostcode = () => {
  isPostcodeVisible.value = true
}

// '다음' 버튼 클릭했을 때 실행되는 함수
const handleClick = () => {
  // propertyStore에 매물 정보 등록
  propertyStore.updateNewProperty('postcode', postcode.value)
  propertyStore.updateNewProperty('address', address.value)
  propertyStore.updateNewProperty('detailAddress', detailAddress.value)
  propertyStore.updateNewProperty('extraAddress', extraAddress.value)
  propertyStore.updateNewProperty('name', propertyName.value)
  if (
    propertyStore.getNewProperty.postcode !== '' &&
    propertyStore.getNewProperty.address !== '' &&
    propertyStore.getNewProperty.detailAddress !== '' &&
    propertyStore.getNewProperty.extraAddress !== '' &&
    propertyStore.getNewProperty.name !== ''
  ) {
    router.push({ name: 'addressConfirm' })
  } else {
    alert('주소를 모두 입력해주세요')
  }
}

// 주소를 다시 입력하기 위해 돌아왔을 때, 원래 입력된 값 보이도록 처리
onMounted(() => {
  if (!propertyStore) {
    if (propertyStore.getNewProperty.postcode) {
      postcode.value = propertyStore.getNewProperty.postcode
    }

    if (propertyStore.getNewProperty.address) {
      address.value = propertyStore.getNewProperty.address
    }

    if (propertyStore.getNewProperty.detailAddress) {
      detailAddress.value = propertyStore.getNewProperty.detailAddress
    }

    if (propertyStore.getNewProperty.extraAddress) {
      extraAddress.value = propertyStore.getNewProperty.extraAddress
    }
  }
})
</script>

<template>
  <div class="AddressSearchPage">
    <div class="address-search-container">
      <div class="address-search-wrapper">
        <div class="postCode-box">
          <input
            type="text"
            id="postCode"
            placeholder="우편번호"
            v-model="postcode"
            readonly
          />
          <input
            type="button"
            id="findAddress-btn"
            @click="openPostcode"
            value="우편번호 찾기"
          />
        </div>
        <div class="address-box">
          <input
            type="text"
            id="address"
            placeholder="주소"
            v-model="address"
            readonly
          />
        </div>
        <div class="detailAddress-box">
          <input
            type="text"
            id="detailAddress"
            placeholder="상세주소"
            v-model="detailAddress"
          />
          <input
            type="text"
            id="extraAddress"
            placeholder="참고항목"
            v-model="extraAddress"
            readonly
          />
        </div>
      </div>
      <!-- 페이지 내에 보여지는 iframe 방식으로 구현 -->
      <div v-if="isPostcodeVisible" class="postcode-layer">
        <VueDaumPostcode
          :q="''"
          :animation="true"
          :no-auto-mapping="true"
          :auto-close="false"
          :width="'100%'"
          :height="'100%'"
          @complete="handleComplete"
        />
        <button class="close-btn" @click="isPostcodeVisible = false">x</button>
      </div>
    </div>

    <!-- 다음 경로가 있으면 버튼 활성화 -->
    <Buttons type="default" label="다음" @click="handleClick" class="nextBtn" />
  </div>
</template>

<style scoped lang="scss">
.AddressSearchPage {
  position: relative;
  width: 100%;
  height: 90%;
}

.address-search-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85%;
}

.address-search-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.postCode-box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  width: 100%;
}

#postCode {
  flex-grow: 2;
  margin: 0.2rem 0;
  font-size: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-color: #dbdbdb #d2d2d2 #d0d0d0 #d2d2d3;
  box-shadow: inset 0.1rem 0.1rem 0.15rem rgba(0, 0, 0, 0.1);
  vertical-align: middle;
  line-height: 1.25rem;
  outline: 0;
}

#findAddress-btn {
  flex-grow: 1;
  margin-left: 2rem;
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  margin-left: 1rem;
  border: 1px solid #ccc;
  border-color: #dbdbdb #d2d2d2 #b2b2b2 #d2d2d3;
  cursor: pointer;
  color: #464646;
  border-radius: 0.2rem;
  vertical-align: middle;
  font-size: 1rem;
  line-height: 1.25rem;
  background-image: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#fff),
    to(#f2f2f2)
  );
  background-image: -moz-linear-gradient(top, #fff, #f2f2f2);
  background-image: -o-gradient(top, #fff, #f2f2f2);
  background-image: linear-gradient(top, #fff, #f2f2f2);
}

.address-box {
  display: flex;
  width: 100%;
  margin-bottom: 1rem;
}

#address,
#detailAddress,
#extraAddress {
  margin: 0.2rem 0;
  font-size: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-color: #dbdbdb #d2d2d2 #d0d0d0 #d2d2d3;
  box-shadow: inset 0.1rem 0.1rem 0.15rem rgba(0, 0, 0, 0.1);
  vertical-align: middle;
  line-height: 1.25rem;
  outline: 0;
}

#address {
  width: 100%;
}

.detailAddress-box {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

#detailAddress {
  flex-grow: 1;
}

#extraAddress {
  flex-grow: 1;
  margin-left: 1rem;
}

@media (max-width: rem(450px)) {
  #postCode {
    width: 60%;
    font-size: rem(14px);
  }

  #findAddress-btn {
    width: 30%;
    padding: 0.2rem 0.7rem;
    margin-left: 0.5rem;
    font-size: rem(14px);
  }

  #detailAddress {
    width: 50%;
    font-size: rem(14px);
  }

  #extraAddress {
    width: 50%;
    margin-left: 0.5rem;
    font-size: rem(14px);
  }
}

.postcode-layer {
  position: relative;
  width: 100%;
  margin-top: 1rem;
  border: 1px solid #ccc;
}

.close-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: rem(20px);
  height: rem(20px);
  top: 0;
  right: 0;
  background-color: #ccc;
  color: white;
  border: none;
  cursor: pointer;
}

.nextBtn {
  width: 100%;
  height: rem(50px);
  margin-bottom: 5rem;
}
</style>
