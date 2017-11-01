import {
	LOGIN,
	LOGINOUT,
} from '../types.js'

const state = {
	account: null,
}

const mutations ={
  [LOGIN]: (state, data) => {
  	localStorage.account = data;
    state.account = data;
  },

  [LOGINOUT]: (state, data) =>{
    localStorage.removeItem('account');
    state.account = null;
  }

}

export default {
	state,
	mutations,
}