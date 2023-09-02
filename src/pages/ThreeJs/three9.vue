<template>
  <div ref="three9Ref"></div>
</template>

<script setup lang="ts">
import { AmbientLight, AxesHelper, DirectionalLight, EquirectangularReflectionMapping, Mesh, MeshPhongMaterial, MeshStandardMaterial, PCFSoftShadowMap, PerspectiveCamera, Scene, TextureLoader, WebGLRenderer, sRGBEncoding } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { onMounted, ref } from 'vue';

const three9Ref = ref<HTMLElement | null>(null)

// 创建场景
const scene = new Scene()
// 创建相机
const camera = new PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 200)
// 创建渲染器
const renderer = new WebGLRenderer({
  antialias: true // 抗锯齿
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true // 开启阴影
renderer.shadowMap.type = PCFSoftShadowMap // 阴影类型
renderer.shadowMap.needsUpdate = true // 更新阴影

// 创建环境光
const light = new AmbientLight(0xffffff, 1)
scene.add(light)
// 创建平行光
const directionalLight = new DirectionalLight(0xffffff, 1)
directionalLight.position.set(200, 200, 200)
scene.add(directionalLight)

// 加载dracoLoader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/gltf/')

// 加载模型
const loader = new GLTFLoader()
loader.load('/phoneModel/手机.glb', (gltf) => {
  console.log(gltf)
  gltf.scene.traverse((child: any) => {
    if (child.isMesh) {
      child.material = material
    }
  })
  scene.add(gltf.scene)
})

// 创建纹理
const textureLoader = new TextureLoader()
const textureBaseColor = textureLoader.load('/phoneModel/basecolor.png')
const textureNormal = textureLoader.load('/phoneModel/normal.png')
const textureMetallic = textureLoader.load('/phoneModel/metallic.png')
const textureRoughness = textureLoader.load('/phoneModel/roughness.png')

// 创建材质
const material = new MeshStandardMaterial({
  map: textureBaseColor,
  normalMap: textureNormal,
  metalnessMap: textureMetallic,
  roughnessMap: textureRoughness,
})

// 创建控制器
const controls = new OrbitControls(camera, renderer.domElement)

// 创建辅助坐标系
const axesHelper = new AxesHelper(100)
// 添加坐标
scene.add(axesHelper)


// 创建渲染函数
const render = () => {
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(render)
}

onMounted(() => {
  three9Ref.value?.appendChild(renderer.domElement)
  // 渲染
  render()
})



// 监听窗口变化
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.render(scene, camera)
})
</script>

<style scoped>

</style>