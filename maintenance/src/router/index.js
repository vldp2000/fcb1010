import Vue from 'vue'
import VueRouter from 'vue-router'
import GigControl from '@/components/GigControlPanel'
import Songs from '@/components/SongsPanel'
import Instruments from '@/components/InstrumentsPanel'
import Presets from '@/components/PresetsPanel'
import InstrumentBankComponent from '@/components/InstrumentBankPanel'

Vue.use(VueRouter)

const routes = [
  {
    path: '/gigcontrol',
    name: 'gigcontrol',
    component: GigControl
  },
  {
    path: '/songs',
    name: 'songs',
    component: Songs
  },
  {
    path: '/instruments',
    name: 'instruments',
    component: Instruments
  },
  {
    path: '/presets',
    name: 'presets',
    component: Presets
  },
  {
    path: '/instrumentBank',
    name: 'instrumentBank',
    component: InstrumentBankComponent
  },
  {
    path: '/',
    name: 'home',
    component: GigControl
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
