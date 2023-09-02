<template>
  <div ref="three9Ref"></div>
</template>

<script setup lang="ts">
import { AmbientLight, DirectionalLight, DoubleSide, Mesh, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, Scene, TextureLoader, WebGLRenderer } from 'three';
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
// renderer.shadowMap.enabled = true // 开启阴影
// renderer.shadowMap.type = PCFSoftShadowMap // 阴影类型
// renderer.shadowMap.needsUpdate = true // 更新阴影

// 创建环境光
const light = new AmbientLight(0xffffff, 1)
scene.add(light)
// 创建平行光
const directionalLight = new DirectionalLight(0xffffff, 5)
directionalLight.position.set(100, 0, 100)
const directionalLight2 = new DirectionalLight(0xffffff, 5)
directionalLight2.position.set(0, 50, 50)
const directionalLight3 = new DirectionalLight(0xffffff, 10)
directionalLight3.position.set(0, 0, -50)
scene.add(directionalLight, directionalLight2, directionalLight3)

// // 创建平面
// const plane = new Mesh(
//   new PlaneGeometry(500, 500),
//   new MeshStandardMaterial({
//     color: 0x999999, // 颜色
//     side: DoubleSide, // 双面渲染
//     transparent: true, // 透明
//     opacity: 0.5, // 透明度
//   })
// )
// plane.rotation.x = -Math.PI / 2
// plane.position.y = -100
// plane.receiveShadow = true
// scene.add(plane)

// 创建纹理
const textureLoader = new TextureLoader()
const textureBaseColor = textureLoader.load('/phoneModel/basecolor.png')
const textureNormal = textureLoader.load('/phoneModel/normal.png')
const textureMetallic = textureLoader.load('/phoneModel/metallic.png')
const textureRoughness = textureLoader.load('/phoneModel/roughness.png')
const textureOpacity = textureLoader.load('/phoneModel/opacity.png')
textureBaseColor.flipY = false // 如果设置为true，纹理在上传到GPU的时候会进行纵向的翻转。默认值为true。
textureNormal.flipY = false // 如果设置为true，纹理在上传到GPU的时候会进行纵向的翻转。默认值为true。
textureMetallic.flipY = false // 翻转y轴
textureRoughness.flipY = false // 翻转y轴
textureOpacity.flipY = false // 翻转y轴


// 创建材质
const material = new MeshStandardMaterial({
  metalness: 1, // 金属度
  roughness: 1, // 粗糙度
  map: textureBaseColor, // 纹理贴图
  normalMap: textureNormal, // 法线贴图
  metalnessMap: textureMetallic, // 金属度贴图
  roughnessMap: textureRoughness, // 粗糙度贴图
  alphaMap: textureOpacity, // 透明度贴图
  transparent: true, // 设置为透明
  opacity: 1, // 设置透明度为1
})

// 加载dracoLoader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/gltf/')

// 加载模型
const loader = new GLTFLoader()
loader.load('/phoneModel/手机.glb', (gltf) => {
  gltf.scene.traverse((child: any) => {
    if (child.isMesh) {
      child.material = material
    }
  })
  scene.add(gltf.scene)
})

// 创建控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 开启阻尼效果，类似初高中受力与位移的关系
controls.dampingFactor = 0.05 // 阻尼系数，值越小，阻尼越大
controls.minDistance = 20 // 相机距离原点的最近距离
controls.maxDistance = 500 // 相机距离原点的最远距离


// // 创建辅助坐标系
// const axesHelper = new AxesHelper(100)
// // 添加坐标
// scene.add(axesHelper)


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