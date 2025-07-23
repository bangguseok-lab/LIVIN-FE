import { createRouter, createWebHistory } from 'vue-router'
import landingPage from '../pages/landing/Landing.vue'
import authRoutes from './auth'
import checklistRoutes from './checklist'
import contentRoutes from './content'
import landingRoutes from './landing'
import homeRoutes from './home'
import myPageRoutes from './myPage'
import propertyAddRoutes from './propertyAdd'
import propertyFavRoutes from './propertyFav'
import propertySearchRoutes from './propertySearch'
import componentsRoutes from './components'
import propertyManageRoutes from './propertyManage'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'landing', component: landingPage },
    ...authRoutes,
    ...checklistRoutes,
    ...contentRoutes,
    ...landingRoutes,
    ...homeRoutes,
    ...myPageRoutes,
    ...propertyAddRoutes,
    ...propertyFavRoutes,
    ...propertySearchRoutes,
    ...componentsRoutes,
    ...propertyManageRoutes,
  ],
})

export default router
