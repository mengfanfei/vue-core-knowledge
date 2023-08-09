import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/pages/index/index.vue')
  },
  {
    path: '/canvas',
    name: 'Canvas',
    component: () => import('@/pages/canvas/index.vue')
  },
  {
    path: '/canvas/babysbreath',
    name: 'Babysbreatn',
    component: () => import('@/pages/canvas/babysbreath.vue')
  },
  {
    path: '/canvas/retroSnaker',
    name: 'RetroSnaker',
    component: () => import('@/pages/canvas/retroSnaker.vue')
  },
  {
    path: '/canvas/particle',
    name: 'RetroSnaker',
    component: () => import('@/pages/canvas/particle.vue')
  },
  {
    path: '/BDmap',
    name: 'BDmap',
    component: () => import('@/pages/BDmap/index.vue')
  },
  {
    path: '/threejs/firstThree',
    name: 'FirstThree',
    component: () => import('@/pages/ThreeJs/firstThree.vue')
  }
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

export default router