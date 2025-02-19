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
    path: '/canvas/screenshot',
    name: 'Screenshot',
    component: () => import('@/pages/canvas/screenshot.vue')
  },
  {
    path: '/BDmap',
    name: 'BDmap',
    component: () => import('@/pages/BDmap/index.vue')
  },
  {
    path: '/threejs/three1',
    name: 'FirstThree',
    component: () => import('@/pages/ThreeJs/firstThree.vue')
  },
  {
    path: '/threejs/three2',
    name: 'SecondThree',
    component: () => import('@/pages/ThreeJs/secondThree.vue')
  },
  {
    path: '/threejs/three3',
    name: 'ThirdThree',
    component: () => import('@/pages/ThreeJs/thirdThree.vue')
  },
  {
    path: '/threejs/three4',
    name: 'FourThree',
    component: () => import('@/pages/ThreeJs/fourThree.vue')
  },
  {
    path: '/threejs/three5',
    name: 'three5',
    component: () => import('@/pages/ThreeJs/three5.vue')
  },
  {
    path: '/threejs/three6',
    name: 'three6',
    component: () => import('@/pages/ThreeJs/three6.vue')
  },
  {
    path: '/threejs/three7',
    name: 'three7',
    component: () => import('@/pages/ThreeJs/three7.vue')
  },
  {
    path: '/threejs/three8',
    name: 'three8',
    component: () => import('@/pages/ThreeJs/three8.vue')
  },
  {
    path: '/threejs/three9',
    name: 'three9',
    component: () => import('@/pages/ThreeJs/three9.vue')
  },
  {
    path: '/threejs/car',
    name: 'car',
    component: () => import('@/pages/ThreeJs/car.vue')
  },
  {
    path: '/threejs/map',
    name: 'map',
    component: () => import('@/pages/ThreeJs/map.vue')
  },
  {
    path: '/videoLive/flvjs',
    name: 'flvjs',
    component: () => import('@/pages/videoLive/flvjs.vue')
  },
  {
    path: '/charts/echarts',
    name: 'echarts',
    component: () => import('@/pages/charts/echarts.vue')
  },
  {
    path: '/charts/echarts-map',
    name: 'echartsMap',
    component: () => import('@/pages/charts/echarts-map.vue')
  },
  {
    path: '/tauri/index',
    name: 'tauriIndex',
    component: () => import('@/pages/tauri/index.vue')
  },
  {
    path: '/bdMap/index',
    name: 'bdMapIndex',
    component: () => import('@/pages/BDmap/index.vue')
  },
  {
    path: '/socket/chat',
    name: 'Chat',
    component: () => import('@/pages/socket/index.vue')
  }
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

export default router
