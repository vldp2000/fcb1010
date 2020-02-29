import Vue from 'vue'
import VueRouter from 'vue-router'
import GigControl from '@/components/GigControlPanel'
import Songs from '@/components/SongsPanel'
import Instruments from '@/components/InstrumentsPanel'
import InstrumentBank from '@/components/InstrumentBankPanel'
import About from '@/components/About'
import Gigs from '@/components/GigPanel'

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
    path: '/instrumentBanks',
    name: 'instrumentBanks',
    component: InstrumentBank
  },
  {
    path: '/gigs',
    name: 'gigs',
    component: Gigs
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '*',
    redirect: '/gigcontrol'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
