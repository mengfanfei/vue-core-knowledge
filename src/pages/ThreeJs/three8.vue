<template>
  <div id="three8" ref="three8Ref"></div>
</template>
<script setup lang="ts">
import { AmbientLight, Color, DirectionalLight, DirectionalLightHelper, DoubleSide, EquirectangularReflectionMapping, GridHelper, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, PerspectiveCamera, PlaneGeometry, Scene, Texture, VideoTexture, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, ref } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { Reflector } from 'three/examples/jsm/objects/Reflector'

let three8Ref = ref<InstanceType<typeof HTMLElement> | null>(null)
// 创建场景
const scene = new Scene()
// 创建相机
const camera = new PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 2, 6)
// 创建渲染器
const renderer = new WebGLRenderer({
  antialias: true // 抗锯齿
})
// 设置渲染器生成canvas 宽高
renderer.setSize(window.innerWidth, window.innerHeight)

// 生成场景背景，环境贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/glb/sky12.hdr', (texture) => {
  texture.mapping = EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})

// 加载机器人模型
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/gltf/')
dracoLoader.setDecoderConfig({ type: 'js'})
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/glb/robot.glb', (gltf) => {
  scene.add(gltf.scene)
})


// 添加控制器
const controls = new OrbitControls(camera, renderer.domElement)

// 添加灯光
const light1 = new DirectionalLight(0xffffff, 1)
light1.position.set(0,0,5)
scene.add(light1)
const light2 = new DirectionalLight(0xffffff, 1)
light2.position.set(0,5,0)
scene.add(light2)
const light3 = new DirectionalLight(0xffffff, 1)
light3.position.set(5,0,0)
scene.add(light1, light2, light3)

// 添加video纹理
const video = document.createElement('video')
video.src = '/glb/zp2.mp4'
video.muted = true
video.loop = true
video.play()

const videoTexture = new VideoTexture(video)
const geometry = new PlaneGeometry(8, 4.5)
const material = new MeshBasicMaterial({
  map: videoTexture,
  transparent: true,
  alphaMap: videoTexture,
  side: DoubleSide
})

const videoMesh = new Mesh(geometry, material)
videoMesh.rotateX(Math.PI/2)
videoMesh.position.y = 0.2
scene.add(videoMesh)

// 添加镜面反射
let reflectorGeometry = new PlaneGeometry(100, 100);
let reflectorPlane = new Reflector(reflectorGeometry, {
  textureWidth: window.innerWidth,
  textureHeight: window.innerHeight,
  color: 0xffff00,
})
reflectorPlane.rotation.x = -Math.PI / 2;
scene.add(reflectorPlane)



const render = () => {
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(render)
}

// dom加载完成后将canvas添加到dom中
onMounted(() => {
  three8Ref.value?.appendChild(renderer.domElement)
  render()
})

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
</script>
