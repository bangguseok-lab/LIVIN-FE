// router/dev.js
import ButtonsView from '../components/common/buttons/ButtonsView.vue'
import PanelsView from '@/components/panels/PanelsView.vue'

const devRoutes = [
  { path: '/testButton', name: 'testButton', component: ButtonsView },
  { path: '/testPanel', name: 'testPanel', component: PanelsView },
  // 다른 테스트 컴포넌트들도 여기에 추가 가능
]

export default devRoutes
