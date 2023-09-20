<template>
  <div ref="carRef"></div>
  <div v-if="!complete" class="fixed top-0 left-0 right-0 bottom-0 z-10 bg-white text-black flex justify-center items-center text-xl">{{ progressValue }}</div>
</template>

<script setup lang="ts">
import {
  AmbientLight,
  AxesHelper,
  Color,
  DefaultLoadingManager,
  DirectionalLight,
  DoubleSide,
  EquirectangularReflectionMapping,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { GroundProjectedSkybox } from 'three/examples/jsm/objects/GroundProjectedSkybox';
import { onMounted, ref } from 'vue';

const progressValue = ref('0%')
const complete = ref(false)

const carRef = ref<HTMLDivElement | null>(null);

const params = {
  height: 20,
  radius: 440
}

// 创建场景
const scene = new Scene();
// 创建相机
const camera = new PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 1000);
camera.position.set(24, 7, -16);
camera.lookAt(0,4,0);

// 创建渲染器
const renderer = new WebGLRenderer({
  antialias: true, // 抗锯齿
});
renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器的尺寸
// renderer.setClearColor(0x000000, 1); // 设置背景颜色
renderer.setPixelRatio(window.devicePixelRatio); // 设置像素比
renderer.shadowMap.enabled = true; // 开启阴影

// 加载环境贴图
const hdrLoader = new RGBELoader()
let skybox: GroundProjectedSkybox
hdrLoader.load('/car/blouberg_sunrise_2_1k.hdr', (texture) => {
  // mapping: 图像将如何应用到物体（对象）上。默认值是THREE.UVMapping对象类型， 即UV坐标将被用于纹理映射
  texture.mapping = EquirectangularReflectionMapping // 反射
  scene.background = texture // 在渲染场景的时候将设置背景，且背景总是首先被渲染的
  scene.environment = texture // 该纹理贴图将会被设为场景中所有物理材质的环境贴图，该属性不能够覆盖已存在的、已分配给 MeshStandardMaterial.envMap 的贴图
  skybox = new GroundProjectedSkybox(texture)
  skybox.scale.setScalar(100)
  skybox.radius = params.radius
  skybox.height = params.height
  scene.add(skybox)
})

// 添加环境光
scene.add(new AmbientLight(0xffffff, 1));
// 添加平行光
const light = new DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

// 添加地面
// const planeGeometry = new PlaneGeometry(50, 50);
// const planeMaterial = new MeshStandardMaterial({
//   color: 0xffffff,
//   side: DoubleSide,
// });
// const plane = new Mesh(planeGeometry, planeMaterial);
// plane.rotation.x = -Math.PI / 2;
// plane.receiveShadow = true; // 接收阴影
// scene.add(plane);

// 添加控制组件
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 开启阻尼
controls.dampingFactor = 0.05; // 阻尼系数
controls.maxPolarAngle = MathUtils.degToRad(90); // 最大角度
controls.minDistance = 20; // 最小距离
controls.maxDistance = 80; // 最大距离
controls.enablePan = false; // 禁止平移
controls.target = new Vector3(0, 4, 0); // 设置相机焦点
controls.update()
// 添加坐标系
// const axesHelper = new AxesHelper(1000)
// scene.add(axesHelper)

// 添加模型
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/gltf/')
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
// 加载模型
loader.load('/car/Lamborghini.glb', (gltf) => {
  // gltf.scene.position.y = -800 // 模型位置
  // gltf.scene.scale.set(50, 50, 50) // 模型缩放
  gltf.scene.traverse((object) => {
    if (object.type === 'Mesh') {
      if (object.name === 'object_4') {
        object.material.color = new Color(0xff0000)
      }
    }
  })
  scene.add(gltf.scene);
  // 
  gltf.scene.children[0].scale.multiplyScalar(4)
});

// 添加全局加载管理器
DefaultLoadingManager.onLoad = () => {
  complete.value = true // 加载完成
  render()
}
DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  progressValue.value = (itemsLoaded / itemsTotal * 100).toFixed(0) + '%' // 加载进度
}
DefaultLoadingManager.onError = (url) => {
  console.log(`There was an error loading ${url}`) // 加载错误
}




// 渲染
const render = () => {
  skybox && (skybox.height = params.height)
  skybox && (skybox.radius = params.radius)
  renderer.render(scene, camera);
  // controls.update();
  // requestAnimationFrame(render);
};


onMounted(() => {
  carRef.value?.appendChild(renderer.domElement);
  // 渲染
  render();
})

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

// 添加gui
const gui = new GUI();
gui.add(params, 'height', 10, 100, 0.1).onChange(render)
gui.add(params, 'radius', 10, 1000, 1).onChange(render)

controls.addEventListener('change', render)


</script>

<style scoped>

</style>