<script setup>
const handleKakaoLogin = () => {
  sessionStorage.setItem('provider', 'kakao')
  // window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=5d9abb9b194736dcef213fc877a7a3c6&redirect_uri=http://localhost:5173/kakao/callback`
  window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=5d9abb9b194736dcef213fc877a7a3c6&redirect_uri=https://livin-fe.vercel.app/kakao/callback`
}

const handleNaverLogin = () => {
  sessionStorage.setItem('provider', 'naver')
  window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=V2i2T0pvAb9NtEW2yzbS&redirect_uri=https://livin-fe.vercel.app/naver/callback&state=random_state`
  // window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=V2i2T0pvAb9NtEW2yzbS&redirect_uri=http://localhost:5173/naver/callback&state=random_state`
}
</script>

<template>
  <div class="LoginPage">
    <div class="main-text-container">
      <p>
        <span class="main-text-bold">나만의 공간</span>을 위한 모든
        <span class="main-text-bold">준비</span>,
      </p>
      <p>
        <img
          src="@/assets/images/login/login-logo.svg"
          alt="로고"
          id="logo"
        /><span id="logo-text">에서</span>
      </p>
      <p>지금 시작해보세요!</p>
    </div>
    <div class="character-container">
      <img
        src="@/assets/images/login/livin-character.svg"
        alt="메인캐릭터"
        id="character"
      />
    </div>
    <div class="social-login-container">
      <img
        src="@/assets/images/login/kakao-login.svg"
        alt="카카오 로그인"
        @click="handleKakaoLogin"
      />
      <img
        src="@/assets/images/login/naver-login.svg"
        alt="네이버 로그인"
        @click="handleNaverLogin"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.LoginPage {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  height: 100vh;
  padding: 1.5rem;
  background-color: var(--primary-color);
  color: white;
  overflow-y: scroll;
  overflow-x: hidden;
  /* 스크롤바 숨기기 */
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE 10+ */
}

.LoginPage::-webkit-scrollbar {
  display: none;
  /* Chrome/Safari */
}

.main-text-container {
  position: relative;
  padding-top: rem(80px);
  margin-left: rem(45px);
  height: rem(192px);
}

.main-text-container > p {
  margin-bottom: 0;
  font-size: rem(24px);
  font-weight: var(--font-weight-light);
}

.main-text-container p:nth-child(2) {
  position: absolute;
  top: rem(114px);
  left: rem(28.8px);
}

.main-text-container p:nth-child(3) {
  position: absolute;
  top: rem(168px);
}

.main-text-bold {
  font-weight: var(--font-weight-bold);
}

#logo {
  width: 70%;
  position: relative;
  top: rem(-3px);
  left: rem(-41.6px);

  opacity: 0;
  transform: translateY(30px);
  /* 아래에서 시작 */
  animation: logoUp 0.8s ease-out forwards;
  animation-delay: 0.2s;
  /* 살짝 딜레이 줄 수도 있음 */
}

/* 애니메이션 키프레임 정의 */
@keyframes logoUp {
  to {
    opacity: 1;
    transform: translateY(0);
    /* 원래 위치로 */
  }
}

#logo-text {
  position: relative;
  left: -3rem;
  top: -0.02rem;
}

.character-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

#character {
  width: 80%;
  position: relative;
  top: rem(2px);
  right: rem(-125px);
}

.social-login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.social-login-container > img {
  width: 80%;
  cursor: pointer;
}

.social-login-container img:nth-child(1) {
  margin-bottom: 1rem;
}

@media (max-width: 375px) {
  .main-text-container {
    position: relative;
    padding-top: rem(50px);
    margin-left: rem(15px);
    height: rem(172px);
  }

  .main-text-container > p {
    margin-bottom: 0;
    font-size: rem(20px);
    font-weight: var(--font-weight-light);
  }

  .main-text-container p:nth-child(2) {
    position: absolute;
    top: rem(74px);
    left: rem(24.8px);
  }

  .main-text-container p:nth-child(3) {
    position: absolute;
    top: rem(128px);
  }

  #character {
    width: 100%;
    position: relative;
    top: rem(2px);
    right: rem(-85px);
  }
}
</style>
