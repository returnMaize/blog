import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

Vue.config.productionTip = false

import './assets/scss/reset.css'
import './assets/scss/index.scss'

import http from './http'
Vue.prototype.$http = http

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
