export default [
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('../pages/auth/LoginPage.vue'),
  },
  {
    path: '/kakao/callback',
    name: 'kakaoCallback',
    component: () => import('@/pages/auth/KakaoCallback.vue'),
  },
  {
    path: '/naver/callback',
    name: 'naverCallback',
    component: () => import('@/pages/auth/NaverCallback.vue'),
  },
  {
    path: '/auth/signup',
    name: 'signup',
    component: () => import('../pages/auth/SignupPage.vue'),
    redirect: '/auth/signup/name',
    children: [
      {
        path: 'name',
        component: () => import('../components/layouts/SignupLayout.vue'),
        name: 'signupName',
        props: {
          title: '이름을 입력해주세요',
          subTitle: '원활한 리빈 사용을 위해 실명이 필요해요',
          placeholder: '이름을 입력하세요',
          page: 1,
          type: 'text',
        },
      },
      {
        path: 'nickname',
        component: () => import('../components/layouts/SignupLayout.vue'),
        name: 'signupNickname',
        props: {
          title: '닉네임을 정해주세요',
          subTitle: '리빈에서 사용될 이름이에요',
          placeholder: '닉네임을 입력하세요',
          page: 2,
          type: 'text',
        },
      },
      {
        path: 'phone',
        component: () => import('../components/layouts/SignupLayout.vue'),
        name: 'signupPhone',
        props: {
          title: '연락처를 알려주세요',
          subTitle: '계약 연결을 위해 실제로 연락 가능한 번호가 필요해요',
          placeholder: '연락처를 입력하세요',
          page: 3,
          type: 'tel',
        },
      },
      {
        path: 'birth',
        component: () => import('../components/layouts/SignupLayout.vue'),
        name: 'signupBirth',
        props: {
          title: '생일을 알려주세요',
          subTitle: '날짜를 선택해주세요',
          placeholder: '날짜를 선택하세요',
          page: 4,
          type: 'date',
        },
      },
      {
        path: 'role',
        component: () => import('../components/layouts/SignupLayout.vue'),
        name: 'signupRole',
        props: {
          title: '집을 구하시나요, 빌려주시나요?',
          subTitle: '어떤 목적으로 리빈을 사용하는지 알려주세요',
          placeholder: '',
          page: 5,
          type: 'role',
        },
      },
      {
        path: 'profile',
        component: () => import('../components/layouts/SignupLayout.vue'),
        name: 'signupProfile',
        props: {
          title: '원하는 이미지를 골라주세요',
          subTitle: '프로필에 사용될 이미지에요',
          placeholder: '',
          page: 6,
          type: 'profile',
        },
      },
      {
        path: 'done',
        component: () => import('../components/layouts/SignupLayout.vue'),
        name: 'signupDone',
        props: {
          title: '회원가입이 완료되었어요!',
          subTitle: '리빈과 함께 안전한 집 구하기, 시작해봐요',
          placeholder: '',
          page: null,
          type: 'done',
        },
      },
    ],
  },
  // {
  //   path: '/auth/signup/done',
  //   name: 'signupDone',
  //   component: () => import('../pages/auth/LoginPage.vue'),
  // },
]
