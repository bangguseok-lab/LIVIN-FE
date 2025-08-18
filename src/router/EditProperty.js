const editPropertyRoutes = [
  {
    path: '/manage/edit/:id',
    name: 'editProperty',
    component: () => import('@/pages/myPage/EditProperty.vue'),
  },
]

export default editPropertyRoutes
