export default [
  {
    path: '/mypage',
    name: 'mypage',
    component: () => import('@/pages/myPage/MyPage.vue'),
  },
  {
    path: '/mypage/deposit',
    name: 'DepositInput',
    component: () => import('@/pages/myPage/DepositInputPage.vue'),
  },
]
