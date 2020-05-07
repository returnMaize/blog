import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

import './assets/scss/reset.css'
import './assets/scss/index.scss'

import { http } from './api/http'

Vue.prototype.$http = http

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
