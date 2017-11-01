import {
  objectUpdate
} from '../types.js'

const state = {
  update:false
}

const actions = {

}

const mutations = {
/*  setUpdateFlag(state, payload){
    console.log(state.update)
    state.update=payload.flag
    console.log(payload)
  },*/

  [objectUpdate]: (state, data) => {
    state.update = data;
  },
}

export default {
  //namespaced: true,
  state,
  actions,
  mutations,
}
