import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import Store from './store'
import vuetify from './plugins/vuetify'

import VueSocketIOExt from 'vue-socket.io-extended'
// import socket from './store/socket-instance'
import io from 'socket.io-client'

import CustomPanel from '@/components/globals/CustomPanel'
// import CustomKnob from '@/components/globals/CustomKnob'
import MyKnob from '@/components/globals/MyKnob'

import PresetControl from '@/components/globals/PresetControl'
import CustomTextInput from '@/components/globals/CustomTextInput'
// import { sync } from 'vuex-router-sync'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VueSvgGauge from 'vue-svg-gauge'
import Vue2TouchEvents from 'vue2-touch-events'

Vue.component('CustomPanel', CustomPanel)
// Vue.component('CustomKnob', CustomKnob)
Vue.component('PresetControl', PresetControl)
Vue.component('CustomTextInput', CustomTextInput)
Vue.component('MyKnob', MyKnob)

const store = Store

const config = require('@/config/config')
const socket = io(`${config.messageURL}`)
Vue.use(VueSocketIOExt, socket, { store })

Vue.config.productionTip = false

Vue.use(VueSvgGauge)
// Vue.use(Vue2TouchEvents)
Vue.use(Vue2TouchEvents, {
  disableClick: false,
  touchClass: '',
  tapTolerance: 10,
  touchHoldTolerance: 400,
  swipeTolerance: 30,
  longTapTimeInterval: 400
})

export default new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
