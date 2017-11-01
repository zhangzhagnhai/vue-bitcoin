import axios from 'axios'
import qs from 'qs'

axios.interceptors.request.use((config) => {
    if(config.method  === 'post'){
        config.data = qs.stringify(config.data);
    }
    return config;
})

axios.defaults.timeout = 5000;

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
