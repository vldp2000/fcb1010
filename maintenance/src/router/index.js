import Vue from 'vue'
import VueRouter from 'vue-router'
import GigControl from '@/components/GigControlPanel'
import Songs from '@/components/SongsPanel'
import Instruments from '@/components/InstrumentsPanel'
import Presets from '@/components/PresetsPanel'
import InstrumentBank from '@/components/InstrumentBankPanel'
import SongPrograms from '@/components/SongProgramsPanel'
import About from '@/components/About'
import Gigs from '@/components/GigPanel'
import Preset from '@/components/globals/PresetControl'
import GigSongPanel from '@/components/GigSongPanel'

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
    path: '/',
    name: 'home',
    component: GigControl
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/preset',
    name: 'preset',
    component: Preset
  },
  {
    path: '/test',
    name: 'test',
    component: GigSongPanel
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
