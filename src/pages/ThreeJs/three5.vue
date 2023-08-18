<template>
  <div id="three5"></div>
</template>

<script setup lang="ts">
import { AmbientLight, BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { onMounted } from 'vue';

// 1. 创建场景
const scene = new Scene()
// 2. 创建相机
const camera = new PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000)
// 设置相机的位置
camera.position.set(100, 100, 500)
// 3. 创建渲染器
const renderer = new WebGLRenderer()
// 设置渲染器生成的canvas宽高
renderer.setSize(window.innerWidth, window.innerHeight)
// 4. 创建几何体
const geometry = new BoxGeometry(100, 100, 100)
// 5. 创建材质
const material = new MeshBasicMaterial({
  color: 0xffff00
})
// 6. 几何体材质组成物体
const cube = new Mesh(geometry, material)
// 7. 将物体添加到场景中
scene.add(cube)
// 
const controls = new OrbitControls(camera, renderer.domElement)
// 创建环境光
const light = new AmbientLight( 0x404040 ); // 柔和的白光
light.position.set(-200, 200, 0)
scene.add( light )
// 8. 创建渲染函数
const render = () => {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
// 9. dom加载完成之后开始渲染
onMounted(() => {
  const element = document.getElementById('three5')
  element?.appendChild(renderer.domElement)
  render()
})
</script>

<style scoped>

</style>