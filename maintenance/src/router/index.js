import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Test from '@/components/Test'
import Songs from '@/components/Songs/Index'

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
    path: '/home',
    name: 'home',
    component: HelloWorld
  },
  {
    path: '/songs',
    name: 'songs',
    component: Songs
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
