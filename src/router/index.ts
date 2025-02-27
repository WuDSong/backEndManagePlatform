import { createRouter, createWebHistory } from 'vue-router'
import Layout from "@/layout/Index.vue"
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Layout
    }
  ],
})

export default router
