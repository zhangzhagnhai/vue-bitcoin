const path = require('path')

var api_base = process.env.NODE_ENV === 'production' ? 'http://localhost' : 'http://btcmonitor.eshanren.com'//btcmonitor.eshanren.com
module.exports = {
  build: {
    env: 'production',
    outputIndex: path.resolve(__dirname, '../public/index.html'),
    assetsRoot: path.resolve(__dirname, '../public'),
    assetsSubDirectory: 'dist',
    assetsPublicPath: '/',
    productionSouceMap: false,
    proxyTable: {
      '/api':{
        target:api_base,
        changeOrigin: false,
        secure: false,
        pathRewrite: {
          '/api': ""
        }
      },
    }
  },
  dev: {
    env: 'development',
    port: 8081,
    autoOpenBrowser: false,
    assetsSubDirectory: 'dist',
    assetsPublicPath: '/',
    proxyTable: {
      '/api':{
        target:api_base,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': "/api"
        }
      },
      '/login':{
        target:api_base,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/login': "/login"
        }
      },
      '/admin':{
        target:api_base,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/admin': "/admin"
        }
      },
    }
  }
}
