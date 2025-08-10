<script setup>
import Buttons from '@/components/common/buttons/Buttons.vue';
import router from '@/router';
import { usePropertyStore } from '@/stores/property';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';

// 매물 등록에 사용하려고 둔 스토어
const propertyStore = usePropertyStore()
// 회원 정보 가져올 스토어
const userStore = useUserStore()

const inputAddress = ref('');
const inputPropertyNum = ref('');

const serverUserName = ref('');
const serverUserBirth = ref('');
const serverUserPhoneNum = ref('');

// 이 고유번호가 아니에요 클릭 시 이전 페이지로 이동
const handleClickNoPropertyNum = () => {
  router.push({ name: 'propertyNum' })
}

// 다음 페이지로 이동
const handleClick = () => {
  router.push({ name: 'propertyNumConfirm' })
}

onMounted(async () => {
  // 입력 받은 주소 가져오기
  inputAddress.value = propertyStore.getNewProperty.address + " " + propertyStore.getNewProperty.detailAddress + propertyStore.getNewProperty.extraAddress;
  // 입력 받은 부동산 고유번호 가져오기
  inputPropertyNum.value = propertyStore.getNewProperty.propertyNum
  // 가입된 회원정보 가져오기
  await userStore.fetchUserInfo()
  serverUserName.value = userStore.userInfo.data.name
  serverUserBirth.value = userStore.userInfo.data.birthDate[0] + '.' + userStore.userInfo.data.birthDate[1] + '.' + userStore.userInfo.data.birthDate[2]
  serverUserPhoneNum.value = userStore.userInfo.data.phone
})
</script>

<template>
  <div class="PropertyNumConfirmPage">
    <div class="propertyNumberConfirm-container">
      <p class="inputAddress-text">입력 받은 주소: {{ inputAddress }}</p>
      <div class="propertyNumberConfirm-info-wrapper">
        <div class="propertyNum-title-wrapper">{{ inputPropertyNum }}<span id="no-propertyNum-text"
            @click="handleClickNoPropertyNum">이 고유번호가 아니에요</span></div>
        <div class="propertyNum-content-wrapper">
          <div>
            <div class="propertyNum-content-text"><span class="content-text">이름</span>배영현</div>
          </div>
          <div>
            <div class="propertyNum-content-text"><span class="content-text">생년월일</span><span
                id="birth-text">2001.01.01</span></div>
          </div>
          <div>
            <div class="propertyNum-content-text"><span class="content-text">연락처</span><span
                id="phone-text">010-4538-0387</span></div>
          </div>
        </div>
      </div>
      <div class="propertyNumberConfirm-info-wrapper">
        <div class="propertyNum-title-wrapper">Livin 회원 정보</div>
        <div class="propertyNum-content-wrapper">
          <div>
            <div class="propertyNum-content-text"><span class="content-text">이름</span>{{ serverUserName }}</div>
          </div>
          <div>
            <div class="propertyNum-content-text"><span class="content-text">생년월일</span><span
                id="birth-text">{{ serverUserBirth }}</span></div>
          </div>
          <div>
            <div class="propertyNum-content-text"><span class="content-text">연락처</span><span
                id="phone-text">{{ serverUserPhoneNum }}</span></div>
          </div>
        </div>
      </div>
    </div>
    <Buttons type="default" label="다음" @click="handleClick" class="nextBtn" />
  </div>
</template>

<style scoped lang="scss">
.PropertyNumConfirmPage {
  position: relative;
  width: 100%;
  height: 90%;
}

.propertyNumberConfirm-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.inputAddress-text {
  color: var(--sub-title-text);
  font-size: .8rem;
}

.propertyNumberConfirm-info-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 3.5rem 2rem;
  margin-bottom: 1rem;
  border-top: 1px solid var(--grey);
  border-bottom: 1px solid var(--grey);
}

.propertyNum-title-wrapper {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: var(--font-weight-semibold);
  color: var(--title-text);
  margin-bottom: 1rem;
}

#no-propertyNum-text {
  margin-left: 2rem;
  font-size: .7rem;
  color: var(--primary-color);
  text-decoration-line: underline;
}

#no-propertyNum-text:hover {
  cursor: pointer;
}

.propertyNum-content-text {
  display: flex;
  justify-content: flex-start;
  margin-bottom: .4rem;
  color: var(--grey);
  font-size: .9rem;
}

.content-text {
  margin-right: 5rem;
  color: var(--sub-title-text);
  font-weight: var(--font-weight-semibold);
}

#birth-text {
  position: absolute;
  left: 8.5rem;
}

#phone-text {
  position: absolute;
  left: 8.5rem;
}

@media (max-width: 375px) {

  .inputAddress-text {
    color: var(--sub-title-text);
    font-size: .6rem;
  }

  .propertyNum-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: .8rem;
    font-weight: var(--font-weight-regular);
    color: var(--title-text);
    margin-bottom: 1rem;
  }

  #no-propertyNum-text {
    margin-left: .5rem;
    font-size: .6rem;
  }
}

.nextBtn {
  width: 100%;
  height: rem(50px);
  margin: 5rem 0;
}
</style>
