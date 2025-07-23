<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './Header.vue'
import Navbar from './Navbar.vue'
const route = useRoute()

//경로 관련한 것들은 추후에 변경 예정
//아직 확실히 모든경로에 대한 설정이 정해지지 않아 임의로 설정

//랜딩페이지, 로그인페이지에서는 헤더가 보이지 않도록
const pathHide = ['landing', 'login']

//아이콘 색이 파란색인 router 설정 이름(수정 가능)
const pathBlue = [
  'join',
  'propertiesCreate',
  'favorite',
  'propertiesManagement',
  'propertiesSearch',
  'checklist',
  'checkPropertyList',
]
//아이콘 색이 하얀색인 router 설정 이름(수정 가능)
const pathWhite = ['mypage', 'checklistDetail', 'checklistEdit']

//네비바가 보이는 경로
const visableNav = [
  'home',
  'propertiesSearch',
  'propertiesManagement',
  'favorite',
  'checklist',
  'checkPropertyList',
  'mypage',
]

const showHeader = computed(() => !pathHide.includes(route.name))
const showNav = computed(() => visableNav.includes(route.name))
const checkHeaderType = computed(() => {
  let iconColor = 'blue'
  let headerType = 'together'
  if (route.name === 'home') {
    headerType = 'alone-logo'
    iconColor = 'white'
  } else if (pathBlue.includes(route.name)) {
    headerType = 'together'
  } else if (pathWhite.includes(route.name)) {
    headerType = 'together'
    iconColor = 'white'
  }

  return {
    icon: iconColor,
    type: headerType,
  }
})
</script>

<template>
  <div class="layout-wrapper">
    <!-- 공통 헤더 -->
    <Header v-if="showHeader" v-bind="checkHeaderType" />

    <!-- 라우트 페이지가 들어갈 자리 -->
    <div class="slot-container">
      <slot />
    </div>

    <!-- 공통 푸터 -->
    <Navbar v-if="showNav" />
  </div>
</template>

<style scoped lang="scss">
.layout-wrapper {
  margin: 0 auto;
  max-width: rem(600px);
  width: 100%;
  height: 100%;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.slot-container {
  display: flex;
  max-width: rem(600px);
  min-height: 100vh;
  justify-content: center;
  width: 100%;
}
</style>
