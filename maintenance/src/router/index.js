import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Test from '@/components/Test'
import Songs from '@/components/Songs/Index'
import Instruments from '@/components/InstrumentsPanel'
import Presets from '@/components/PresetsPanel'
import InstrumentBankComponent from '@/components/InstrumentBankPanel'

Vue.use(VueRouter)

const routes = [
  {
    path: '/hello',
    name: 'hello',
    component: HelloWorld
  },
  {
    path: '/test',
    name: 'test',
    component: Test
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
    component: HelloWorld
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
