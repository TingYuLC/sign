import Vue from 'vue'
import Router from 'vue-router'
const Sign = () => import('@/components/Sign')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Sign',
      component: Sign
    }
  ]
})
