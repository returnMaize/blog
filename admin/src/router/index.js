import Vue from 'vue'
import VueRouter from 'vue-router'

import AdminMain from '@/views/AdminMain'

import CategoryCreate from '@/views/category/CategoryCreate'
import CategoryList from '@/views/category/CategoryList'

import AuthorCreate from '@/views/author/AuthorCreate'
import AuthorList from '@/views/author/AuthorList'

import BgAdd from '@/views/bg/BgAdd'
import BgList from '@/views/bg/BgList'

import MusicAdd from '@/views/music/MusicAdd'
import MusicList from '@/views/music/MusicList'

import BlogAdd from '@/views/blog/BlogAdd'
import BlogList from '@/views/blog/BlogList'

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

      { path: 'music/add', component: MusicAdd },
      { path: 'music/edit/:id', component: MusicAdd, props: true },
      { path: 'music/list', component: MusicList },

      { path: 'blog/add', component: BlogAdd },
      { path: 'blog/edit/:id', component: BlogAdd, props: true },
      { path: 'blog/list', component: BlogList },
    ],
  },
]

const router = new VueRouter({
  routes,
})

export default router
