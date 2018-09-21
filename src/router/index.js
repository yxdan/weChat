import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: resolve => require(['@/pages/index'], resolve)
    }, {
      path: '/teaching_service/index',
      component: resolve => require(['@/pages/teaching_service/index'], resolve)
    }, {
      path: '/teaching_service/catalog',
      component: resolve => require(['@/pages/teaching_service/catalog'], resolve)
    }, {
      path: '/teaching_service/detail',
      component: resolve => require(['@/pages/teaching_service/detail'], resolve)
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
