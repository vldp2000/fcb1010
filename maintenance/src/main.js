import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from '@/store/store'
import vuetify from './plugins/vuetify'
import CustomPanel from '@/components/globals/CustomPanel'
// import { sync } from 'vuex-router-sync'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
// import VueCircleSlider from 'vue-circle-slider'
import VueSvgGauge from 'vue-svg-gauge'

Vue.component('CustomPanel', CustomPanel)
Vue.config.productionTip = false
// Vue.use(VueCircleSlider)
Vue.use(VueSvgGauge)
// sync(store, router)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
