<template>
  <div id="three5"></div>
</template>

<script setup lang="ts">
import { AmbientLight, AxesHelper, CircleGeometry, DirectionalLight, DoubleSide, Mesh, MeshBasicMaterial, MeshLambertMaterial, PerspectiveCamera, PlaneGeometry, RepeatWrapping, Scene, SphereGeometry, TextureLoader, WebGLRenderer } from 'three';
import cizhuanImg from '@/assets/imgs/瓷砖.jpg'
import { onMounted } from 'vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { text } from 'd3';
// 场景
const scene = new Scene()
// 球状几何体
// const geometry = new SphereGeometry(50)
// 矩形几何体
const geometry = new PlaneGeometry(2000, 1000)
// 圆形平面几何体
// const geometry = new CircleGeometry(50, 100)
// 创建纹理贴图加载器
const textureLoader = new TextureLoader()
// 加载图像返回一个纹理对象
const texture = textureLoader.load(cizhuanImg)
texture.wrapS = RepeatWrapping
texture.wrapT = RepeatWrapping
texture.repeat.set(30,15)
// 创建材质
const material = new MeshBasicMaterial({
  map: texture,
  // side: DoubleSide
})
// 创建模型
const mesh = new Mesh(geometry, material)
mesh.rotateX(-Math.PI/2)
// 将模型添加到场景中
scene.add(mesh)

// 光源设置
const directionalLight = new DirectionalLight(0xffffff, 1)
directionalLight.position.set(100, 60, 50)
scene.add(directionalLight)
const ambient = new AmbientLight(0xffffff, 1)
scene.add(ambient)

// 创建相机
const camera = new PerspectiveCamera(30, window.innerWidth/window.innerHeight, 1, 3000)
camera.position.set(0, 333, 285)
camera.lookAt(0,0,0)

// 渲染器
const renderer = new WebGLRenderer({
  antialias: true // 开启优化锯齿
})
renderer.setSize(window.innerWidth, window.innerHeight)
// 不同硬件设备的屏幕的设备像素比window.devicePixelRatio值可能不同
// console.log('查看当前屏幕设备像素比',window.devicePixelRatio);

// 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
renderer.setPixelRatio(window.devicePixelRatio);

renderer.setClearColor(0x000000, 1); //设置背景颜色

// 渲染循环
function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

onMounted(() => {
  const element = document.getElementById('three5')
  element?.appendChild(renderer.domElement)
  render()
})
// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)
// 辅助观察的坐标系
const axesHelper = new AxesHelper(100)
scene.add(axesHelper)

// 画布随窗口变化
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})
</script>

<style scoped>

</style>