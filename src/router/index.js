import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'jfr',
      component: () => import('../views/JfrView.vue'),
    },
  ],
})

export default router
