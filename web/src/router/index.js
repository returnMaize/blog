import Vue from 'vue'
import VueRouter from 'vue-router'

import WebMain from '@/views/WebMain'
import WebHome from '@/views/home/WebHome'
import HomeBlog from '@/views/home/components/HomeBlog'
import HomePicture from '@/views/home/components/HomePicture'
import HomeMessageBoard from '@/views/home/components/HomeMessageBoard'
import HomeAboutMe from '@/views/home/components/HomeAboutMe'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: WebMain,
    children: [
      {
        path: '',
        component: WebHome,
        children: [
          { path: '', component: HomeBlog, props: true },
          { path: 'blog', component: HomeBlog, props: true },
          { path: 'picture', component: HomePicture },
          { path: 'message/board', component: HomeMessageBoard },
          { path: 'about/me', component: HomeAboutMe },
        ],
      },
    ],
  },
]

const router = new VueRouter({
  routes,
})

export default router
