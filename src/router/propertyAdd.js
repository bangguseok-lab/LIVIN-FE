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
          totalPage: 7,
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
          totalPage: 7,
          page: 2,
        },
      },
      {
        path: 'number',
        component: () => import('@/pages/propertyAdd/AddPropertyNumPage.vue'),
        name: 'propertyNum',
        meta: {
          title: '부동산 고유번호를 입력해주세요',
          subTitle: '등록할 매물의 부동산 고유번호를 입력해주세요',
          totalPage: 7,
          page: 3,
        },
      },
      {
        path: 'number/confirm',
        component: () =>
          import('@/pages/propertyAdd/PropertyNumConfirmPage.vue'),
        name: 'propertyNumberConfirm',
        meta: {
          title: '부동산 고유번호 조회가 완료되었습니다',
          subTitle: '부동산 정보와 회원정보가 일치하는지 확인해주세요',
          totalPage: 7,
          page: 4,
        },
      },
      {
        path: 'type',
        component: () => import('@/pages/propertyAdd/PropertyTypePage.vue'),
        name: 'propertyType',
        meta: {
          title: '거래 유형을 선택해주세요',
          subTitle: '',
          totalPage: 7,
          page: 5,
        },
      },
      {
        path: 'wolse',
        component: () => import('@/pages/propertyAdd/WolsePage.vue'),
        name: 'wolsePage',
        meta: {
          title: '월세 정보를 입력해주세요',
          subTitle: '',
          totalPage: 7,
          page: 6,
        },
      },
      {
        path: 'jeonse',
        component: () => import('@/pages/propertyAdd/JeonsePage.vue'),
        name: 'jeonsePage',
        meta: {
          title: '전세 정보를 입력해주세요',
          subTitle: '',
          totalPage: 7,
          page: 6,
        },
      },
      {
        path: 'risk-analysis',
        component: () => import('@/pages/propertyAdd/RiskAnalysisDonePage.vue'),
        name: 'riskAnalysisDone',
        meta: {
          title: '위험도 분석이 완료되었습니다',
          subTitle: '이제 매물을 등록하러 가볼까요?',
          totalPage: 7,
          page: 7,
        },
      },
    ],
  },
]
