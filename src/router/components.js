// router/dev.js
import ButtonsView from '../components/common/buttons/ButtonsView.vue'
import FiltersView from '@/components/filters/FilterView.vue'
import InputsView from '@/components/common/input/InputsView.vue'
import ImageBoxTest from '@/components/common/imagebox/ImageBoxTest.vue'
import PropertyCardView from '@/components/cards/PropertyCardView.vue'

const devRoutes = [
  { path: '/testButton', name: 'testButton', component: ButtonsView },
  { path: '/testFilter', name: 'testFilters', component: FiltersView },

  {
    path: '/testPropertyCard',
    name: 'testPropertyCard',
    component: PropertyCardView,
  },
  // 다른 테스트 컴포넌트들도 여기에 추가 가능
  { path: '/testInput', name: 'testInput', component: InputsView },

  {
    path: '/test/image-box',
    name: 'ImageBoxTest',
    component: ImageBoxTest,
  },
]

export default devRoutes
