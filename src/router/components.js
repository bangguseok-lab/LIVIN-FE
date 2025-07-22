// router/dev.js
import ButtonsView from '../components/common/buttons/ButtonsView.vue'

const devRoutes = [
  { path: '/testButton', name: 'testButton', component: ButtonsView },

  // 다른 테스트 컴포넌트들도 여기에 추가 가능
]

export default devRoutes
