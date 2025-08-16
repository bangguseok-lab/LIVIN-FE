<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 공통 아이콘
import HomeIcon from '@/assets/icons/navbar/home-icon.svg'
import HomeIconActive from '@/assets/icons/navbar/home-icon-active.svg'
import MypageIcon from '@/assets/icons/navbar/mypage-icon.svg'
import MypageIconActive from '@/assets/icons/navbar/mypage-icon-active.svg'

// TENANT 아이콘
import SearchPropertyIcon from '@/assets/icons/navbar/search-property-icon.svg'
import SearchPropertyIconActive from '@/assets/icons/navbar/search-property-icon-active.svg'
import ChecklistIcon from '@/assets/icons/navbar/checklist-icon.svg'
import ChecklistIconActive from '@/assets/icons/navbar/checklist-icon-active.svg'
import FavoriteIcon from '@/assets/icons/navbar/favorite-icon.svg'
import FavoriteIconActive from '@/assets/icons/navbar/favorite-icon-active.svg'

// LANDLORD 아이콘
import RegisterIcon from '@/assets/icons/navbar/register-property-icon.svg'
import RegisterIconActive from '@/assets/icons/navbar/register-property-icon-active.svg'
import ManageIcon from '@/assets/icons/navbar/manage-property-icon.svg'
import ManageIconActive from '@/assets/icons/navbar/manage-property-icon-active.svg'

const route = useRoute()
const userStore = useUserStore()

// 역할 확인
const role = computed(
  () =>
    userStore.userInfo?.data?.role ?? // {success, message, data: {...}} 구조 대응
    userStore.userInfo?.role ?? // 혹시 다른 곳에서 평평하게 넣은 경우도 커버
    sessionStorage.getItem('role'),
)

// TENANT 메뉴
const tenantMenus = [
  {
    path: '/home',
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

// LANDLORD 메뉴
const landlordMenus = [
  {
    path: '/home',
    icon: HomeIcon,
    activeIcon: HomeIconActive,
    alt: '홈 아이콘',
  },
  {
    path: '/property/create',
    icon: RegisterIcon,
    activeIcon: RegisterIconActive,
    alt: '매물 등록 아이콘',
  },
  {
    path: '/propertymanage',
    icon: ManageIcon,
    activeIcon: ManageIconActive,
    alt: '매물 관리 아이콘',
  },
  {
    path: '/mypage',
    icon: MypageIcon,
    activeIcon: MypageIconActive,
    alt: '마이페이지 아이콘',
  },
]

// 보여줄 메뉴
const navMenus = computed(() =>
  role.value === 'LANDLORD' ? landlordMenus : tenantMenus,
)

// 활성 메뉴 체크
const isActive = computed(
  () => menu =>
    menu.path === '/' ? route.path === '/' : route.path.startsWith(menu.path),
)
</script>

<template>
  <div class="nav-wrap">
    <div class="Navbar">
      <div class="nav-box">
        <router-link
          v-for="menu in navMenus"
          :key="menu.path"
          :to="menu.path"
          class="icon-box"
          :class="{ active: isActive(menu) }"
        >
          <img
            :src="isActive(menu) ? menu.activeIcon : menu.icon"
            :alt="menu.alt"
            class="mt-2"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/utils/_pxToRem.scss' as *;

.nav-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  display: flex;
  justify-content: center;
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
