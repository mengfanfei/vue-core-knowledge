<template>
  <div id="three7" ref="three7Ref"></div>
</template>
<script setup lang="ts">
import { AmbientLight, Color, DirectionalLight, DirectionalLightHelper, GridHelper, Mesh, MeshPhysicalMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, ref } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
let three7Ref = ref<InstanceType<typeof HTMLElement> | null>(null)
// 创建场景
const scene = new Scene()
// 创建相机
const camera = new PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 2000)
// 设置相机位置
camera.position.set(0, 2, 6)
// 创建渲染器
const renderer = new WebGLRenderer({
  antialias: true // 抗锯齿
})
// 设置渲染器生成canvas 宽高
renderer.setSize(window.innerWidth, window.innerHeight)
// 设置背景
renderer.setClearColor('#000')
scene.background = new Color('#ccc')

// 添加网格地面
const gridHelper = new GridHelper(50, 50)
gridHelper.material.opacity = 0.2
gridHelper.material.transparent = true
scene.add(gridHelper)

// 添加控制器
const controls = new OrbitControls(camera, renderer.domElement)

// 添加汽车模型
const gtlfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/gltf/')
gtlfLoader.setDRACOLoader(dracoLoader)

let wheels = []
let carBody, frontCar, hoodCar, backCar, glassCar

// 车身材质
const carBodyMaterial = new MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0.1
})
// 前脸材质
const frontCarMaterial = new MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0.1
})
// 引擎盖材质
const hoodtCarMaterial = new MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0.1
})
// 轮毂材质
const wheelMaterial = new MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1,
  roughness: 0.1
})
// 挡风玻璃材质
const glassMaterial = new MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0.1,
  transmission: 1,
  transparent: true
})

gtlfLoader.load('/glb/bmw01.glb', (gltf) => {
  const bmw = gltf.scene
  scene.add(bmw)
  bmw.traverse((child) => {
    if(child.type === 'Mesh') {
      if (child.name.includes('轮毂')) {
        (child as Mesh).material = wheelMaterial
        wheels.push(child)
      }
      if (child.name.includes('Mesh002')) {
        (child as Mesh).material = carBodyMaterial
        carBody = child
      }
      if (child.name.includes('前脸')) {
        (child as Mesh).material = frontCarMaterial
        frontCar = child
      }
      if (child.name.includes('引擎盖_1')) {
        (child as Mesh).material = hoodtCarMaterial
        hoodCar = child
      }
      if (child.name.includes('挡风玻璃')) {
        (child as Mesh).material = glassMaterial
        glassCar = child
      }
    }
  })
})

// 添加灯光
const light1 = new DirectionalLight(0xffffff, 5)
light1.position.set(0,0,5)
scene.add(light1)
const light2 = new DirectionalLight(0xffffff, 5)
light2.position.set(0,5,0)
scene.add(light2)
const light3 = new DirectionalLight(0xffffff, 5)
light3.position.set(5,0,0)
scene.add(light3)
const light4 = new DirectionalLight(0xffffff, 5)
light4.position.set(0,0,-5)
scene.add(light4)
const light5 = new DirectionalLight(0xffffff, 5)
light5.position.set(-5,0,0)
scene.add(light5)



const render = () => {
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(render)
}

// dom加载完成后将canvas添加到dom中
onMounted(() => {
  three7Ref.value?.appendChild(renderer.domElement)
  render()
})
</script>
