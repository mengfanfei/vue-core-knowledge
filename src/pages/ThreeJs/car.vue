<template>
  <div ref="carRef"></div>
</template>

<script setup lang="ts">
import { AmbientLight, DirectionalLight, DoubleSide, EquirectangularReflectionMapping, MathUtils, Mesh, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { onMounted, ref } from 'vue';

const carRef = ref<HTMLDivElement | null>(null);

// 创建场景
const scene = new Scene();
// 创建相机
const camera = new PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(3, 1.5, 4);

// 创建渲染器
const renderer = new WebGLRenderer({
  antialias: true, // 抗锯齿
});
renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器的尺寸
// renderer.setClearColor(0x000000, 1); // 设置背景颜色
renderer.setPixelRatio(window.devicePixelRatio); // 设置像素比
renderer.shadowMap.enabled = true; // 开启阴影

// 加载环境贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/car/park_parking_4k.hdr', (texture) => {
  texture.mapping = EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
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
controls.maxPolarAngle = MathUtils.degToRad(85); // 最大角度
controls.minDistance = 20; // 最小距离
controls.maxDistance = 80; // 最大距离
controls.enablePan = false; // 禁止平移

// 添加gui
const gui = new GUI();
// gui
//   .add(controls, 'enableDamping')
//   .name('阻尼')
//   .onChange((value: boolean) => {
//     controls.enableDamping = value;
//   }
//   );

// 添加模型
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/gltf/')
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
// 加载模型
loader.load('/car/Lamborghini.glb', (gltf) => {
  scene.add(gltf.scene);
  // 
  gltf.scene.children[0].scale.multiplyScalar(4)
});

// 渲染
const render = () => {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(render);
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


</script>

<style scoped>

</style>