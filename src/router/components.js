// router/dev.js
import ButtonsView from '../components/common/buttons/ButtonsView.vue'
import FiltersView from '@/components/filters/FilterView.vue'
import InputsView from '@/components/common/input/InputsView.vue'

const devRoutes = [
  { path: '/testButton', name: 'testButton', component: ButtonsView },
  { path: '/testFilter', name: 'testFilters', component: FiltersView },

  // 다른 테스트 컴포넌트들도 여기에 추가 가능
  { path: '/testInput', name: 'testInput', component: InputsView },
]

export default devRoutes
