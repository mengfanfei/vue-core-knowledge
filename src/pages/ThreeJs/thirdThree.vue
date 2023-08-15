<template>
  <div id="thirdThree"></div>
</template>

<script setup lang="ts">
import { AmbientLight, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, TextureLoader, WebGLRenderer } from 'three'
import { onMounted } from 'vue'
import caoImg from '@/assets/imgs/cao.jpeg'

/**
 * 场景: 场景能够让你在什么地方，摆放什么东西来交给three.js来渲染，这是你放置物体、灯光和摄像机的地方
 */
const scene = new Scene()
/**
 * 相机
 * PerspectiveCamera: 透视相机，模拟人眼所看到的景象
 */
const camera = new PerspectiveCamera(100, window.innerWidth/window.innerHeight, 0.1, 1500)
camera.position.set(8, 1, 12)
/**
 * 渲染器
 */
const renderer = new WebGLRenderer({
  antialias: true,//是否抗锯齿
    alpha: true,//canvas是否包含alpha (透明度)。默认为false
})
renderer.setSize(window.innerWidth, window.innerHeight)
/**
 * 平面缓冲几何体（草地）
 */
const floor = new PlaneGeometry(window.innerWidth, window.innerHeight)
const floorTexture = new TextureLoader().load(caoImg)
const material = new MeshBasicMaterial({map: floorTexture})
const floorPlane = new Mesh(floor, material)
scene.add(floorPlane)

/**
 * 环境光
 */
const light = new AmbientLight(0x404040, 3)
scene.add(light)

const animate = () => {
  window.requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

onMounted(() => {
  const element = document.getElementById('thirdThree')
  element!.appendChild(renderer.domElement)
  animate()
})
</script>

<style scoped>

</style>