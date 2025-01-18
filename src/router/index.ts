import { createRouter, createWebHistory } from 'vue-router'
import SearchView from '@/views/SearchView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/search'
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    }
  ]
})

export default router
