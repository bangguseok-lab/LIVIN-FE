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
import propertyDetailsRoutes from './propertyDetails'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/landing',
    },
    { path: '/landing', name: 'landing', component: landingPage },
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
    ...propertyDetailsRoutes,
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0, behavior: 'smooth' }
    }
  },
})

export default router
