import api from '../../api/api.js'
import {
	TOTAL_ADDRESS,
	LIST_ADDRESS,
} from '../types.js'

const state = {
	total:'',
	adresslist:'',
}

const actions = {
	// async getTotalAddress({
	// 	commit,
	// 	state
	// }){
	// 	let res = await api.totalAddress()
	// 	commit(TOTAL_ADDRESS, res)

	// }

	getTotalAddress({commit}){
		console.log({commit})
		api.totalAddress().then(res =>{
			console.log(api.totalAddress())
      commit(TOTAL_ADDRESS, res)
		})
	}
}

const mutations = {
	[TOTAL_ADDRESS](state, res){
		state.total = res.data
	},
	[LIST_ADDRESS](state, res){
		state.adresslist = res.data
	}
}

export default {
  //namespaced: true,
  state,
  actions,
  mutations,
}
