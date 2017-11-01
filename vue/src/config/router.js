import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'
import { LOGIN } from '../store/types.js'


Vue.use(VueRouter)
// 页面刷新时，重新赋值token
if (window.localStorage.getItem('account')) {
   store.commit(LOGIN, window.localStorage.getItem('account'))
}

const router = new VueRouter({
  //mode: 'history',
  scrollBehaviors(to, from, savedPosition) {
    let position = savedPosition

    if (!position) {
      position = { x: 0, y: 0 }
    }

    return position
  },
  routes: [
    {
      name:'login',
      path:'/loginpage',
      component: r  => require.ensure([], () => r(require('views/login')), 'login'),

    },
    {
      path: '/',
      redirect: '/loginpage'
    },
    {
      path: '/',
      component: r => require.ensure([], () => r(require('views/home')), '1st-screen'),
      children: [
        { name: 'homepage',
          path: 'homepage',
          component: r => require.ensure([], () => r(require('views/homePage')), '1st-screen'),
          meta: { requireAuth : true },
        },
        { name: 'address',
          path: 'address',
          component: r => require.ensure([], () => r(require('views/addressPage')), 'addressPage'),
          meta: { requireAuth : true },

        },
        { name: 'addressdetails',
          path: 'addressdetails',
          component: r => require.ensure([], () => r(require('views/addressdetails')), 'addressdetails'),
          meta: { requireAuth : true },
        },
        { name: 'addressCharts',
          path: 'addressCharts',
          component: r => require.ensure([], () => r(require('views/addressCharts')), 'addressCharts'),
          meta: { requireAuth : true },

        },
        { name: 'tradedetails',
          path: 'tradedetails',
          component: r => require.ensure([], () => r(require('views/tradeDetails')), 'tradeDetails'),
          meta: { requireAuth : true },

        },
        {
          name: 'object',
          path: 'object',
          component: r => require.ensure([], () => r(require('views/objectPage')), 'objectManage'),
          meta: { requireAuth : true },

        },
        {
          name: 'objectdetails',
          path: 'objectdetails',
          component: r => require.ensure([], () => r(require('views/objectDetails')), 'objectDetails'),
          meta: { requireAuth : true },
        },
        {
          name: 'objectCharts',
          path: 'objectCharts',
          component: r => require.ensure([], () => r(require('views/objectCharts')), 'objectCharts'),
          meta: { requireAuth : true },
        },
        {
          name: 'relation',
          path: 'relation',
          component: r => require.ensure([], () => r(require('views/relationPage')), 'relationPage'),
          meta: { requireAuth : true },
        }
      ]

    },
    {
      name: '404',
      path: '*',
      component: r => require.ensure([], () => r(require('views/404')), '404'),
    },
  ],
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(r => r.meta.requireAuth)) {
        if (store.state.login.account) {
            next();
        }
        else {
          next({
              path: '/loginpage',
              query: {redirect: to.fullPath}
          })
        }
    }
    else {
        next();
    }
})

export default router
