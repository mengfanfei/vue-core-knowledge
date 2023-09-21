<script setup lang="ts">
import {onMounted, ref} from "vue";
import {AmbientLight, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min.js";

const mapRef = ref<HTMLDivElement | null>(null);

// 创建场景
const scene = new Scene();

// 创建相机
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// 渲染器
const renderer = new WebGLRenderer({
  // alpha: true, // 透明
  antialias: true // 抗锯齿
});

// 控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置渲染器参数
const setRendererParams = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
}

// 设置控制器参数
const setControlsParams = () => {
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
}

// 添加灯光
const addLight = () => {
  // 环境光
  const ambientLight = new AmbientLight(0xd4e7fd, 4)
  scene.add(ambientLight)
  // 平行光
  const light = new DirectionalLight(0xe8eaeb, 0.2)
  light.position.set(0, 10, 5)
  const light2 = light.clone()
  light2.position.set(0, 10, -5)
  const light3 = light.clone()
  light3.position.set(5, 10, 0)
  const light4 = light.clone()
  light4.position.set(-5, 10, 0)
  // 添加到场景
  scene.add(light, light2, light3, light4)
}

// 将画布挂在到DOM上
const addCanvas = () => {
  mapRef.value?.appendChild(renderer.domElement)
}

// 渲染
const render = () => {
  renderer.render(scene, camera)
}

// 动画
const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  render()
}

// 监听窗口大小变化
const handleResize = () => {
  setRendererParams()
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  render()
}

// 设置gui
const setGUI = () => {
  const gui = new GUI()
  // gui.add(controls, 'enableRotate').name('旋转')
  // gui.add(controls, 'enableZoom').name('缩放')
  // gui.add(controls, 'enablePan').name('平移')
  gui.add(controls, 'enableDamping').name('阻尼')
  gui.add(controls, 'dampingFactor', 0, 0.99).name('阻尼系数')
  gui.add(controls, 'minDistance', 0, 100).name('最小距离')
  gui.add(controls, 'maxDistance', 0, 100).name('最大距离')
}

onMounted(() => {
  // 初始化渲染器参数
  setRendererParams()
  // 初始化控制器参数
  setControlsParams()
  // 添加灯光
  addLight()
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
  // 初始化gui
  setGUI()
  // 初始化画布
  addCanvas()
  // 渲染,动画
  animate()

})
</script>

<template>
  <div ref="mapRef"></div>
</template>

<style scoped>

</style>