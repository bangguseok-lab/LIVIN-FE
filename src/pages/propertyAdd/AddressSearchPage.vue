<script setup>
import { ref } from 'vue'
import { VueDaumPostcode } from 'vue-daum-postcode'


const postcode = ref('')
const address = ref('')
const detailAddress = ref('')
const extraAddress = ref('')
const isPostcodeVisible = ref(false) // iframe 표시 여부

// 주소 선택 시 동작할 콜백
const handleComplete = (data) => {
  let addr = ''
  let extraAddr = ''

  // 주소 설정
  // 검색된 기본 주소 타입: R(도로명), J(지번)
  if (data.userSelectedType === 'R') {    // userSelectedType: 검색 결과에서 사용자가 선택한 주소의 타입
    addr = data.roadAddress
    console.log(addr) // 경북 경산시 압량읍 압독4로 12
  } else {
    addr = data.jibunAddress
  }

  // 참고항목 설정 (도로명일 때만)
  if (data.userSelectedType === 'R') {
    if (data.bname && /[동|로|가]$/g.test(data.bname)) {
      extraAddr += data.bname
    }
    if (data.buildingName && data.apartment === 'Y') {
      extraAddr += (extraAddr !== '' ? ', ' : '') + data.buildingName
    }
    if (extraAddr !== '') {
      extraAddr = ` (${extraAddr})`
    }
    extraAddress.value = extraAddr
  } else {
    extraAddress.value = ''
  }

  // 입력 필드에 데이터 반영
  postcode.value = data.zonecode  // 우편번호
  address.value = addr            // 검색된 도로명 주소

  // 상세주소 필드로 포커스 이동
  setTimeout(() => {
    document.getElementById('sample3_detailAddress')?.focus()
  }, 100)

  // 주소 선택 완료 시 우편 번호창 숨기기
  isPostcodeVisible.value = false
}

// "우편번호 찾기" 버튼 클릭 시 iframe(주소 검색창) 보이게 설정
const openPostcode = () => {
  isPostcodeVisible.value = true
}
</script>

<template>
  <div class="AddressSearchPage">
    <div class="address-search-wrapper">
      <div class="postCode-box">
        <input type="text" id="postCode" placeholder="우편번호" v-model="postcode" readonly>
        <input type="button" id="findAddress-btn" @click="openPostcode" value="우편번호 찾기" />
      </div>
      <div class="address-box">
        <input type="text" id="address" placeholder="주소" v-model="address" readonly />
      </div>
      <div class="detailAddress-box">
        <input type="text" id="detailAddress" placeholder="상세주소" v-model="detailAddress" />
        <input type="text" id="extraAddress" placeholder="참고항목" v-model="extraAddress" readonly />
      </div>
    </div>

    <!-- 페이지 내에 보여지는 iframe 방식으로 구현 -->
    <div v-if="isPostcodeVisible" class="postcode-layer">
      <VueDaumPostcode :q="''" :animation="true" :no-auto-mapping="true" :auto-close="false" :width="'100%'"
        :height="'100%'" @complete="handleComplete" />
      <button class="close-btn" @click="isPostcodeVisible = false">x</button>
    </div>
  </div>
</template>



<style scoped lang="scss">
.AddressSearchPage {
  position: relative;
  width: 100%;
  height: 90%;
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
}

#postCode {
  flex-grow: 2;
  margin: .2em 0;
  font-size: 1em;
  padding: .5em;
  border: 1px solid #ccc;
  border-color: #dbdbdb #d2d2d2 #d0d0d0 #d2d2d3;
  box-shadow: inset .1em .1em .15em rgba(0, 0, 0, .1);
  vertical-align: middle;
  line-height: 1.25em;
  outline: 0;
}

#findAddress-btn {
  flex-grow: 1;
  margin-left: 2rem;
  display: inline-block;
  padding: .5em 1em;
  margin: .2em .15em;
  border: 1px solid #ccc;
  border-color: #dbdbdb #d2d2d2 #b2b2b2 #d2d2d3;
  cursor: pointer;
  color: #464646;
  border-radius: .2em;
  vertical-align: middle;
  font-size: 1em;
  line-height: 1.25em;
  background-image: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#f2f2f2));
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
  margin: .2em 0;
  font-size: 1em;
  padding: .5em;
  border: 1px solid #ccc;
  border-color: #dbdbdb #d2d2d2 #d0d0d0 #d2d2d3;
  box-shadow: inset .1em .1em .15em rgba(0, 0, 0, .1);
  vertical-align: middle;
  line-height: 1.25em;
  outline: 0;
}

#address {
  width: 100%;
}

.detailAddress-box {
  display: flex;
  justify-content: space-between;
}

#detailAddress {
  flex-grow: 1;
}

#extraAddress {
  flex-grow: 1;
  margin-left: 1rem;
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
</style>
