import Vue from 'vue'
import Vuex from 'vuex'
import app from './module/app'
import address from './module/address'
import login from './module/login'
import object from './module/object'
import vis from './module/vis'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    address,
    login,
    object,
    vis
  },
})

export default store
