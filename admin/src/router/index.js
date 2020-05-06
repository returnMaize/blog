import Vue from 'vue'
import VueRouter from 'vue-router'

import AdminMain from '@/views/AdminMain'
import CategoryCreate from '@/views/category/CategoryCreate'
import CategoryList from '@/views/category/CategoryList'
import AuthorCreate from '@/views/author/AuthorCreate'
import AuthorList from '@/views/author/AuthorList'
import BgAdd from '@/views/bg/BgAdd'
import BgList from '@/views/bg/BgList'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: AdminMain,
    children: [
      { path: 'category/create', component: CategoryCreate },
      { path: 'category/edit/:id', component: CategoryCreate, props: true },
      { path: 'category/list', component: CategoryList },
      { path: 'author/create', component: AuthorCreate },
      { path: 'author/edit/:id', component: AuthorCreate, props: true },
      { path: 'author/list', component: AuthorList },
      { path: 'bg/add', component: BgAdd },
      { path: 'bg/edit/:id', component: BgAdd, props: true },
      { path: 'bg/list', component: BgList },
    ],
  },
]

const router = new VueRouter({
  routes,
})

export default router
