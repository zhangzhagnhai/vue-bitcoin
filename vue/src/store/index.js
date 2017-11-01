import Vue from 'vue'
import Vuex from 'vuex'
import app from './module/app'
import address from './module/address'
import login from './module/login'
import object from './module/object'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    address,
    login,
    object
  },
})

export default store
