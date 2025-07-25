<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Buttons from '@/components/common/buttons/Buttons.vue';
import Inputs from '@/components/common/input/Inputs.vue';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

const store = useAuthStore()

const route = useRoute()
const router = useRouter()

defineProps({
  title: String,
  subTitle: String,
  placeholder: String,
  page: Number,
  type: String,
})

// 경로에 따라 필요한 컴포넌트 보이도록 결정하는 함수
const isShow = computed(() => {
  const path = route.path;

  if (path.endsWith('/role')) {
    return 'showRoleBtn'
  }

  if (path.endsWith('/profile')) {
    return 'showProfileImg'
  }

  if (path.endsWith('/done')) {
    return 'showDone'
  }

  return 'showInput'
})

// 임대인, 임차인 값을 결정하는 변수
const tenantBtn = ref(false)
const landlordBtn = ref(false)

// 임차인 버튼 클릭 시 임대인 버튼 비활성화 하는 함수
const onTenantClick = () => {
  tenantBtn.value = true
  landlordBtn.value = false
}

// 임대인 버튼 클릭 시 임차인 버튼 비활성화 하는 함수
const onLandlordClick = () => {
  tenantBtn.value = false
  landlordBtn.value = true
}

const inputValue = ref('')      // 입력창에 입력되는 값을 저장하는 변수
const errorMessage = ref('')    // 입력값에 따른 에러 메시지를 보여줄 변수
const inputName = ref('name');  // 입력창의 이름을 저장하는 변수

// 유효성 검사 함수
const isKorean = (text) => /^[가-힣]{2,}$/.test(text)
const isValidPhone = (text) => {
  const pattern = /^01[016789]-\d{4}-\d{4}$/;
  return pattern.test(text) && text.length === 13
};
const isValidNickname = (text) => /^[a-zA-Z가-힣0-9]{2,12}$/.test(text)

// Inputs 컴포넌트에서 emit으로 넘긴 값(=입력값)을 받아 inputValue에 저장
const handleInput = ({ value }) => {
  inputValue.value = value
}

// 전화번호 에러 메시지 컨트롤
const handleError = (msg) => {
  errorMessage.value = msg
}

// 다음 경로 지정하는 함수
const nextPath = {
  name: 'nickname',
  nickname: 'phone',
  phone: 'birth',
  birth: 'role',
  role: 'profile',
  profile: 'done',
};

const getNextRoute = (currPath) => {
  return `/auth/signup/${nextPath[currPath]}?providerId=${store.providerId}`;
};

const profileList = [1, 2, 3, 4, 5, 6]  // 이미지 번호 배열
const selectedProfile = ref(null)       // 선택된 프로필 번호

// 선택된 이미지 번호를 지정하는 함수
const selectProfile = (num) => {
  selectedProfile.value = num
}

// 경로별 유효성 검사에 맞추어 보일 에러 메시지와 다음 경로를 지정하는 함수
const handleInputClick = () => {
  const path = route.path;

  errorMessage.value = '' // 에러 메시지 초기화

  if (path.endsWith('/name')) {
    inputName.value = 'name'
    if (!inputValue.value) {
      errorMessage.value = '이름을 입력해주세요.'
      return  // 잘못된 이벤트 실행을 막기 위해서 모든 곳에 추가함
    } else {
      if (!isKorean(inputValue.value)) {
        errorMessage.value = '한글 2자 이상 입력해주세요.'
        return
      } else {
        store.setName(inputValue.value);
        inputValue.value = '' // 입력값 초기화
        router.push(getNextRoute(inputName.value))
        return
      }
    }
  }
  if (path.endsWith('/nickname')) {
    inputName.value = 'nickname'
    if (!inputValue.value) {
      errorMessage.value = '닉네임을 입력해주세요.'
      return
    } else {
      if (!isValidNickname(inputValue.value)) {
        errorMessage.value = '닉네임은 특수문자 제외 2~12자여야 합니다.'
        return
      } else {
        store.setNickname(inputValue.value);
        inputValue.value = ''
        router.push(getNextRoute(inputName.value))
        return
      }
    }
  }
  if (path.endsWith('/phone')) {
    inputName.value = 'phone'
    if (!inputValue.value) {
      errorMessage.value = '전화번호를 입력해주세요.'
      return
    } else {
      if (!isValidPhone(inputValue.value)) {
        errorMessage.value = '올바른 전화번호 형식이 아닙니다.'
        return
      } else {
        store.setPhone(inputValue.value);   // 010-1234-5678 형식으로 저장
        inputValue.value = ''
        router.push(getNextRoute(inputName.value))
        return
      }
    }
  }
  if (path.endsWith('/birth')) {
    inputName.value = 'birth'
    if (!inputValue.value) {
      errorMessage.value = '생년월일을 선택해주세요.'
    } else {
      store.setBirth(inputValue.value);   // 1999-01-01 형식으로 저장
      inputValue.value = ''
      router.push(getNextRoute(inputName.value))
      return
    }
  }
  if (path.endsWith('/role')) {
    inputName.value = 'role'
    if (!tenantBtn.value && !landlordBtn.value) {
      alert('임차인 또는 임대인 역할을 선택해주세요.')
      return
    } else {
      if (tenantBtn.value && confirm('집을 구하시는게 맞나요?')) {
        store.setRole('TENANT')  // 피니아에 임차인 역할을 저장하는 코드
        router.push(getNextRoute(inputName.value))
      }
      if (landlordBtn.value && confirm('집을 빌려주실건가요?')) {
        store.setRole('LANDLORD')
        router.push(getNextRoute(inputName.value))
      }
    }
  }
  if (path.endsWith('/profile')) {
    inputName.value = 'profile'
    if (selectedProfile.value !== null) {
      store.setProfile(selectedProfile.value) // 이미지 번호 스토어에 저장
      router.push('/auth/signup/done')
    } else {
      alert('프로필 이미지를 선택해주세요.')
    }
  }
}


const handleSubmit = async () => {
  try {
    const payload = {
      name: store.name,
      nickname: store.nickname,
      phone: store.phone,
      birthDate: store.birthDate,
      role: store.role,
      profileImage: store.profileImage,
    }

    const provider = sessionStorage.getItem('provider');
    const providerId = store.providerId

    // encodeURIComponent() : 특수문자 처리 위함
    const response = await axios.post(
      `/api/${provider}/register?providerId=${encodeURIComponent(providerId)}`,
      payload
    )

    const token = response.headers['authorization'] || response.headers['Authorization']

    if (token) {
      // sessionStorage.setItem('accessToken', token)
      // 토큰을 세션 스토리지에 저장 후 /home으로 이동
      router.push('/home')
    } else {
      console.error('Authorization 헤더가 없습니다.')
    }
  } catch (error) {
    console.error('회원가입 실패:', error)
  }
}

// 페이지가 마운트될 때, providerId를 스토어에 저장
onMounted(() => {
  const providerId = route.query.providerId
  if (providerId) {
    store.setProviderId(providerId)
  }
})
</script>

<template>
  <div class="SignupLayout">
    <div class="signup-page-number" v-if="isShow !== 'showDone'">{{ page }}<span class="total-page"> / 6</span></div>
    <div class="signup-title-wrapper" v-if="isShow !== 'showDone'">
      <p class="signup-title-text">{{ title }}</p>
      <p class="signup-sub-title-text">{{ subTitle }}</p>

      <!-- 입력창 (이름, 닉네임, 전화번호, 생년월일) -->
      <Inputs v-if="isShow === 'showInput'" :placeholder="placeholder" :type="type" :name="inputName"
        :modelValue="inputValue" @input="handleInput" @error="handleError" />

      <!-- 에러 메시지 보이는 곳 -->
      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

      <!-- 역할(임대인, 임차인) 선택하는 버튼 -->
      <div v-if="isShow === 'showRoleBtn'" class="btn-role-box">
        <Buttons v-model:is-active="tenantBtn" :type="type" class="tenantBtn" @click="onTenantClick">
          <div class="role-text">임차인</div>
          <div class="role-description-text">집을 구해요</div>
        </Buttons>
        <Buttons v-model:is-active="landlordBtn" :type="type" @click="onLandlordClick">
          <div class="role-text">임대인</div>
          <div class="role-description-text">집을 빌려줘요</div>
        </Buttons>
      </div>

      <!-- 프로필 이미지 선택하는 부분 -->
      <div v-if="isShow === 'showProfileImg'" class="profile-img-box grid-container">
        <div v-for="num in profileList" :key="num" class="profile-img-item"
          :class="{ selected: selectedProfile === num }" @click="selectProfile(num)">
          <img :src='`/src/assets/images/profile/test-${num}.svg`' :alt="`profile-${num}`" />
        </div>
      </div>
      <!-- 주소가 있으면 버튼 활성화 -->
      <Buttons type="default" label="다음" @click="handleInputClick" class="nextBtn" />
    </div>
    <div class="signup-done-wrapper" v-if="isShow === 'showDone'">
      <p>{{ title }}</p>
      <p>{{ subTitle }}</p>
      <img src='@/assets/images/login/livin-character.svg' alt="메인캐릭터" class="character">
      <Buttons type="default" label="시작하기" @click="handleSubmit" class="doneBtn" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.SignupLayout {
  position: relative;
  width: 100%;
  height: 90%;
}

.signup-page-number {
  font-size: rem(13px);
  font-weight: var(--font-weight-semibold);
  color: var(--title-text);
}

.total-page {
  font-weight: var(--font-weight-semibold);
  color: var(--sub-title-text);
}

.signup-title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: rem(21px);
}

.signup-title-text {
  font-size: var(--title-size);
  font-weight: var(--font-weight-semibold);
  color: var(--title-text);
  margin-bottom: 0;
}

.signup-sub-title-text {
  font-size: var(--sub-title-size);
  font-weight: var(--font-weight-regular);
  color: var(--sub-title-text);
  margin-bottom: rem(34px);
}

.btn-role-box {
  display: flex;
  width: 100%;
}

.tenantBtn {
  margin-right: rem(42px);
}

.error-text {
  color: red;
  font-size: rem(14px);
  margin-top: rem(8px);
  padding-left: rem(6.5px);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: rem(6px);
  width: 100%;
}

.profile-img-item {
  width: rem(170px);
  border: rem(4px) solid transparent;
  border-radius: rem(8px);
  padding: rem(4px);
  cursor: pointer;
  transition: border 0.3s ease;
}

.profile-img-item>img {
  width: 100%;
}

.profile-img-item.selected {
  border-color: var(--primary-color);
}

.signup-done-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: rem(100px);

  font-size: var(--sub-title-size);
  font-weight: var(--font-weight-regular);
  color: var(--sub-title-text);
}

.signup-done-wrapper>p:nth-child(1) {
  font-size: var(--title-size);
  font-weight: var(--font-weight-semibold);
  color: var(--title-text);
}

.character {
  position: relative;
  right: rem(-145px);
  top: rem(60px);
  width: 65%;
}

.nextBtn {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: rem(50px);
}

.doneBtn {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: rem(50px);
  font-size: 1rem;
}
</style>
