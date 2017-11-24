import axios from 'axios'
import qs from 'qs'

axios.interceptors.request.use((config) => {
    if(config.method  === 'post'){
        config.data = qs.stringify(config.data);
    }
    return config;
})

axios.defaults.timeout = 5000;

/*请求超时*/
axios.defaults.retry = 1;
axios.defaults.retryDelay = 1000;

axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
  var config = err.config;
  // If config does not exist or the retry option is not set, reject
  if(!config || !config.retry) return Promise.reject(err);

  // Set the variable for keeping track of the retry count
  config.__retryCount = config.__retryCount || 0;

  // Check if we've maxed out the total number of retries
  if(config.__retryCount >= config.retry) {
    // Reject with the error
    return Promise.reject(err);
  }

  // Increase the retry count
  config.__retryCount += 1;

  // Create new promise to handle exponential backoff
  var backoff = new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, config.retryDelay || 1);
  });


  if(config.method=='post'){
    var tempArray=config.data.split("&");
    config.data= {
    }
    for(var i=0;i<tempArray.length;i++){
      var argArray=tempArray[i].split("=")
      config.data[argArray[0]]=decodeURI(argArray[1])
    }
  }else if(config.method=='get'){
    config.params = config.data
  }
  // Return the promise in which recalls axios to retry the request
  return backoff.then(function() {
    return axios(config);
  });
});

const httpPlugin = {}

httpPlugin.install = function install(Vue, config = {}) {
  if (httpPlugin.install.installed) return
  httpPlugin.install.installed = true

  const vueInstance = Vue

  Object.assign(axios.defaults, config)

  vueInstance.$http = axios

  vueInstance.prototype.$http = axios
}

if (window.Vue) {
  window.Vue.use(httpPlugin)
}

export default httpPlugin
