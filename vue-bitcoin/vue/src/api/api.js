//  import axios from 'axios'

// axios.defaults.timeout = 5000;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// //axios.defaults.baseURL = 'http://localhost:4000/';

// export function postFetch(url, params) {
//   return new Promise((resolve, reject) => {
//     axios.post(url, params)
//       .then(response => {
//           resolve(response.data);
//       }, err => {
//           reject(err);
//       })
//       .catch((error) => {
//          reject(error)
//      })
//   })
// }

// export function getFetch(url){
// 	return new Promise((resolve, reject) => {
// 		axios.get(url)
// 		.then(response =>{
// 			resolve(response.data)
// 			console.log(response.data)
// 		}, err =>{
// 			reject(err)
// 		})
// 		.catch((error) =>{
// 			reject(error)
// 		})
// 	})
// }

// export default{
// 	//地址总数
// 	totalAddress(){
// 		return getFetch('http://localhost:9090/address')
// 	}


// }

