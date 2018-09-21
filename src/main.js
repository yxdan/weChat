// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import api from './api/index.js'
import utils from '@/utils/index.js'
import infiniteScroll from 'vue-infinite-scroll'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.config.productionTip = false

Vue.prototype.$api = api
Vue.prototype.$utils = utils

Vue.use({VueRouter, Mint, infiniteScroll})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
