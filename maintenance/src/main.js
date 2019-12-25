import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from '@/store/store'
import vuetify from './plugins/vuetify'
import Vpanel from '@/components/globals/Vpanel'

Vue.config.productionTip = false
Vue.component('Vpanel', Vpanel)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
