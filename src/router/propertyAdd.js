export default [
  {
    path: '/property/create',
    name: 'propertyAdd',
    component: () => import('@/pages/propertyAdd/PropertyAdd.vue'),
    redirect: '/property/create/address',
    children: [
      {
        path: 'address',
        component: () => import('@/pages/propertyAdd/AddressSearchPage.vue'),
        name: 'addressSearch',
        meta: {
          title: '주소를 입력해주세요',
          subTitle: '등록할 매물의 주소를 입력해주세요',
          totalPage: 6,
          page: 1,
        },
      },
      {
        path: 'address/confirm',
        component: () => import('@/pages/propertyAdd/AddressConfirmPage.vue'),
        name: 'addressConfirm',
        meta: {
          title: '주소 조회가 완료되었습니다',
          subTitle: '상세 주소가 맞는지 확인해주세요',
          totalPage: 6,
          page: 2,
        },
      },
      {
        path: 'property/number',
        component: () => import('@/pages/propertyAdd/AddPropertyNumPage.vue'),
        name: 'propertyNum',
        meta: {
          title: '부동산 고유번호를 입력해주세요',
          subTitle: '등록할 매물의 부동산 고유번호를 입력해주세요',
          totalPage: 6,
          page: 3,
        },
      },
    ],
  },
]
