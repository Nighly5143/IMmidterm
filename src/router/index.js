import { createRouter, createWebHistory } from 'vue-router'
import Expense from '../Expense.vue'
import Income from '../Income.vue'
import Summary from '../Summary.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Expense
    },
    {
      path: '/income',
      name: 'income',
      component: Income
    },
    {
      path: '/summary',
      name: 'summary',
      component: Summary
    }
  ]
})

export default router
