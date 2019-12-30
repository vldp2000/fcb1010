import Vue from 'vue'
import VueRouter from 'vue-router'
import GigControl from '@/components/GigControlPanel'
import Songs from '@/components/SongsPanel'
import Instruments from '@/components/InstrumentsPanel'
import Presets from '@/components/PresetsPanel'
import InstrumentBank from '@/components/InstrumentBankPanel'
import SongPrograms from '@/components/SongProgramsPanel'

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
    path: '/songPrograms',
    name: 'songPrograms',
    component: SongPrograms
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
    component: InstrumentBank
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
