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
      {
        path: 'photo',
        component: () => import('@/pages/propertyAdd/PhotoPage.vue'),
        name: 'photoPage',
        meta: {
          title: '사진으로 매력적인 매물을 보여주세요',
          subTitle: '다양한 사진은 임차인으로부터 연락 올 확률이 높아져요!',
          totalPage: 8,
          page: 1,
        },
      },
      {
        path: 'room-direction',
        component: () => import('@/pages/propertyAdd/RoomDirectionPage.vue'),
        name: 'roomDirectionPage',
        meta: {
          title: '매물의 방향을 알려주세요',
          subTitle: '거실 / 주실 기준',
          totalPage: 8,
          page: 2,
        },
      },
      {
        path: 'room-detail',
        component: () => import('@/pages/propertyAdd/RoomDetailPage.vue'),
        name: 'roomDetailPage',
        meta: {
          title: '매물 정보를 입력해주세요',
          subTitle: '',
          totalPage: 8,
          page: 3,
        },
      },
      {
        path: 'management',
        component: () => import('@/pages/propertyAdd/ManagementPage.vue'),
        name: 'managementPage',
        meta: {
          title: '관리비를 입력해주세요',
          subTitle: '',
          totalPage: 8,
          page: 4,
        },
      },
      {
        path: 'other-info',
        component: () => import('@/pages/propertyAdd/OtherInfoPage.vue'),
        name: 'otherInfoPage',
        meta: {
          title: '기타 정보를 입력해주세요',
          subTitle: '',
          totalPage: 8,
          page: 5,
        },
      },
      {
        path: 'option',
        component: () => import('@/pages/propertyAdd/OptionPage.vue'),
        name: 'optionPage',
        meta: {
          title: '내부 옵션을 선택해주세요',
          subTitle: '',
          totalPage: 8,
          page: 6,
        },
      },
      {
        path: 'move/date',
        component: () => import('@/pages/propertyAdd/MoveDatePage.vue'),
        name: 'moveDatePage',
        meta: {
          title: '입주는 언제부터 가능한가요?',
          subTitle: '입주 가능일을 선택해 주세요',
          totalPage: 8,
          page: 7,
        },
      },
      {
        path: 'last',
        component: () => import('@/pages/propertyAdd/LastPage.vue'),
        name: 'lastPage',
        meta: {
          title: '이제 마지막입니다!',
          subTitle:
            '매물의 특징과 장점을 자세히 적어주세요. \n매물에서의 경험을 공유하면 더 많은 연락을 받을 수 있어요.',
          totalPage: 8,
          page: 8,
        },
      },
    ],
  },
  {
    path: '/done',
    component: () => import('@/pages/propertyAdd/PropertyAddDonePage.vue'),
    name: 'donePage',
  },
]
