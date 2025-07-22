<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import HomeIcon from '@/assets/icons/navbar/home-icon.svg'
import SearchPropertyIcon from '@/assets/icons/navbar/search-property-icon.svg'
import ChecklistIcon from '@/assets/icons/navbar/checklist-icon.svg'
import FavoriteIcon from '@/assets/icons/navbar/favorite-icon.svg'
import MypageIcon from '@/assets/icons/navbar/mypage-icon.svg'

import HomeIconActive from '@/assets/icons/navbar/home-icon-active.svg'
import SearchPropertyIconActive from '@/assets/icons/navbar/search-property-icon-active.svg'
import ChecklistIconActive from '@/assets/icons/navbar/checklist-icon-active.svg'
import FavoriteIconActive from '@/assets/icons/navbar/favorite-icon-active.svg'
import MypageIconActive from '@/assets/icons/navbar/mypage-icon-active.svg'

const route = useRoute()
const navMenus = [
  {
    path: '/',
    icon: HomeIcon,
    activeIcon: HomeIconActive,
    alt: '홈 아이콘',
  },
  {
    path: '/search',
    icon: SearchPropertyIcon,
    activeIcon: SearchPropertyIconActive,
    alt: '매물보기 아이콘',
  },
  {
    path: '/checklist',
    icon: ChecklistIcon,
    activeIcon: ChecklistIconActive,
    alt: '체크리스트 아이콘',
  },
  {
    path: '/favorite',
    icon: FavoriteIcon,
    activeIcon: FavoriteIconActive,
    alt: '찜 아이콘',
  },
  {
    path: '/mypage',
    icon: MypageIcon,
    activeIcon: MypageIconActive,
    alt: '마이페이지 아이콘',
  },
]

//현재 출력되는 페이지가 어디인지
//경로에 따라 활성화된 메뉴 표시
const isActive = computed(() => menu => {
  if (menu.path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(menu.path)
})
</script>

<template>
  <div class="nav-wrap">
    <div class="Navbar">
      <div class="nav-box">
        <router-link v-for="menu in navMenus" :key="menu.path" :to="menu.path" class="icon-box"
          :class="{ active: isActive(menu) }">
          <img :src="isActive(menu) ? menu.activeIcon : menu.icon" :alt="menu.alt" class="mt-2" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/utils/_pxToRem.scss' as *;

// .nav-wrap {
//   position: fixed;
//   bottom: 0;
//   left: 0;
//   z-index: 100;
//   width: 100%;
//   display: flex;
//   justify-content: center;
// }
.nav-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  display: flex;
  justify-content: center;
  // background-color: #ffffff;
}

.Navbar {
  width: 100%;
  height: rem(63px);
  display: flex;
  justify-content: center;
  z-index: 100;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  max-width: rem(600px);
  min-width: rem(100px);
  background-color: white;
}

.nav-box {
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-box {
  width: rem(40px);
  height: rem(40px);
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;

  &.active {
    background-color: rgba(23, 125, 250, 0.1);
    border-radius: rem(8px);
    transition: all 0.2s ease-in-out;
  }
}
</style>
