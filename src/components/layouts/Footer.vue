<template>
  <footer class="footer">
    <div class="footer-top">
      <img
        src="@/assets/images/landing/logo-footer.png"
        alt="LIV!N 로고"
        class="footer-logo"
      />
    </div>
    <div class="footer-bottom">
      <div class="footer-links">
        <a href="/" class="footer-link">서비스 이용약관</a>
        <a href="/" class="footer-link">개인정보 처리방침</a>
      </div>
      <div class="footer-right">© 2025. LIVIN. All rights reserved.</div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  bottom: 0; // 하단 정렬
  left: 0;
  right: 0; // 전체 너비 기준 가운데로
  margin: 0 auto;
  height: rem(70px);
  max-width: rem(600px);
  min-width: rem(100px);
  width: 100%;
  background-color: var(--whitish);
  font-size: rem(10px);
  color: var(--black);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: rem(1px);
}

.footer-top {
  display: flex;
  // justify-content: flex-start;
  justify-content: center;
  // justify-content: flex-end;
}

.footer-logo {
  height: rem(40px);
  width: auto;
  display: block;
  padding: 0 0 0 0;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 rem(10px);
}

.footer-links {
  display: flex;
  gap: rem(12px);
}

.footer-link {
  text-decoration: none;
  color: var(--black);
}

.footer-link:hover {
  text-decoration: underline;
}
</style>
