import Vue from 'vue'
import vuexStore from 'store'
import router from 'config/router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import filters from 'service/filter'
import plugins from 'plugins'
import Layout from 'components/layout/Layout'

import 'assets/icon/iconfont.js'
import 'assets/styles/reset.styl'
import 'assets/styles/functional.styl'

import 'assets/css/root.css'
import 'assets/css/netcss.css'
import 'assets/css/vis.min.css'

Object.keys(plugins).forEach(key => Vue.use(plugins[key]))
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

Vue.use(ElementUI)

new Vue({
  ...Layout,
  router,
  store: vuexStore,
}).$mount('#app')
