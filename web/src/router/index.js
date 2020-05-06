import Vue from 'vue'
import VueRouter from 'vue-router'

import WebMain from '@/views/WebMain'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: WebMain,
  },
]

const router = new VueRouter({
  routes,
})

export default router
