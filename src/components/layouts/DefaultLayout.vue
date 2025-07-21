<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './Header.vue'
import Navbar from './Navbar.vue'
const route = useRoute()
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
  <div class="DefaultLayout"></div>
  <div class="layout-wrapper">
    <!-- 예: 공통 헤더 -->
    <Header v-if="showHeader" v-bind="checkHeaderType" />
    <!-- 라우트 페이지가 들어갈 자리 -->
    <slot />

    <!-- 예: 공통 푸터 -->
    <!-- <Footer /> -->
    <Navbar v-if="showNav" />
  </div>
</template>

<style scoped>
.DefaultLayout {
}
</style>
