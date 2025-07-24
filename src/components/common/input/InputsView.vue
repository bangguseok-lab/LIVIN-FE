<script setup>
import { ref } from 'vue'
// import { useRoute } from 'vue-router'

import Inputs from './Inputs.vue';
import Buttons from '../buttons/Buttons.vue';

// const route = useRoute()
const nameInputValue = ref('')
const nicknameInputValue = ref('')
const phoneInputValue = ref('')

const nameErrMsg = ref('')
const nicknameErrMsg = ref('')
const phoneErrMsg = ref('')

const nameOkBtn = ref(false)
const nicknameOkBtn = ref(false)
const phoneOkBtn = ref(false)

// 유효성 검사 함수
const isKorean = (text) => /^[가-힣]{2,}$/.test(text)
const isValidPhone = (text) => /^01[016789]-\d{3,4}-\d{4}$/.test(text)
const isValidNickname = (text) => /^[a-zA-Z가-힣0-9]{2,12}$/.test(text)

// 경로별 유효성 검사 에러 메시지
// const errorMessage = computed(() => {
//   if (route.path.endsWith('/name')) {
//     if (!inputValue.value) return '이름을 입력해주세요.'
//     if (!isKorean(inputValue.value)) return '한글 2자 이상 입력해주세요.'
//   }

//     if (!inputValue.value) return '닉네임을 입력해주세요.'
//     if (!isValidNickname(inputValue.value)) return '닉네임은 특수문자 제외 2~12자여야 합니다.'

//   return ''
// })

const handleInput = ({ name, value }) => {
  if (name === 'name') {
    nameInputValue.value = value
    nameErrMsg.value = ''
  } else if (name === 'nickname') {
    nicknameInputValue.value = value
    nicknameErrMsg.value = ''
  } else if (name === 'phone') {
    phoneInputValue.value = value
    phoneErrMsg.value = ''
  }
}

const handleInputClick = (inputName) => {
  if (inputName === 'name') {
    if (!nameInputValue.value) {
      nameErrMsg.value = '이름을 입력해주세요.'
    } else {
      if (!isKorean(nameInputValue.value))
        nameErrMsg.value = '한글 2자 이상 입력해주세요.'
    }
  } else if (inputName === 'nickname') {
    if (!nicknameInputValue.value) {
      nicknameErrMsg.value = '닉네임을 입력해주세요.'
    } else {
      if (!isValidNickname(nicknameInputValue.value))
        nicknameErrMsg.value = '닉네임은 특수문자 제외 2~12자여야 합니다.'
    }
  } else if (inputName === 'phone') {
    console.log(phoneInputValue.value)
    if (!phoneInputValue.value) {
      phoneErrMsg.value = '전화번호를 입력해주세요.'
    } else {
      if (!isValidPhone(phoneInputValue.value)) {
        phoneErrMsg.value = '올바른 전화번호 형식이 아닙니다.'
      }
    }
  }
}

</script>

<template>
  <div class="InputsView">
    <h1>입력창 모음</h1>
    <br>
    <div class="signup-box">
      <div class="input-wrapper">
        <p>이름 입력 창</p>
        <div class="input-box">
          <Inputs placeholder="이름을 입력해주세요" type="text" name="name" v-model:value="nameInputValue"
            @input="handleInput" />
          <Buttons type="md" label="완료" v-model:is-active="nameOkBtn" @click="handleInputClick('name')" />
        </div>
        <p v-if="nameErrMsg" class="error-text">{{ nameErrMsg }}</p>
      </div>
      <div class="input-wrapper">
        <p>닉네임 입력 창</p>
        <div class="input-box">
          <Inputs placeholder="닉네임을 입력해주세요" type="text" name="nickname" v-model:value="nicknameInputValue"
            @input="handleInput" />
          <Buttons type="md" label="완료" v-model:is-active="nicknameOkBtn" @click="handleInputClick('nickname')" />
        </div>
        <p v-if="nicknameErrMsg" class="error-text">{{ nicknameErrMsg }}</p>
      </div>
      <div class="input-wrapper">
        <p>전화번호 입력 창</p>
        <div class="input-box">
          <Inputs placeholder="전화번호를 입력해주세요" type="tel" name="phone" v-model:value="phoneInputValue"
            @input="handleInput" />
          <Buttons type="md" label="완료" v-model:is-active="phoneOkBtn" @click="handleInputClick('phone')" />
        </div>
        <p v-if="phoneErrMsg" class="error-text">{{ phoneErrMsg }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.InputsView {
  display: flex;
  flex-direction: column;
  padding: 4rem 2rem 0;
  width: 100%;
}

.signup-box {
  display: flex;
  flex-direction: column;
}

.input-wrapper {
  margin-top: 2rem;
}

.input-box {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

#okBtn {
  height: rem(50px);
}

.error-text {
  color: red;
  font-size: 14px;
  margin-top: 4px;
}
</style>
