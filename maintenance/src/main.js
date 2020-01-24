import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from '@/store/store'
import vuetify from './plugins/vuetify'
import CustomPanel from '@/components/globals/CustomPanel'
import CustomKnob from '@/components/globals/CustomKnob'
import PresetControl from '@/components/globals/PresetControl'
import CustomTextInput from '@/components/globals/CustomTextInput'
// import { sync } from 'vuex-router-sync'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VueSvgGauge from 'vue-svg-gauge'
import Vue2TouchEvents from 'vue2-touch-events'

Vue.component('CustomPanel', CustomPanel)
Vue.component('CustomKnob', CustomKnob)
Vue.component('PresetControl', PresetControl)
Vue.component('CustomTextInput', CustomTextInput)

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

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
