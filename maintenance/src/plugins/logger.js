import Vue from 'vue'
import VueLogger from 'vuejs-logger'

const isProduction = process.env.NODE_ENV === 'production'
const options = {
  isEnabled: true,
  logLevel: isProduction ? 'error' : 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true
}
Vue.use(VueLogger, options)

export default ({
  app,
  store
}, inject) => {
  console.debug('Initializing Logger', options)
  VueLogger.install(Vue, options)
  app['$log'] = Vue.$log
  store['$log'] = Vue.$log
}
