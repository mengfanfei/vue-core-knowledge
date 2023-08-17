<template>
  <div id="three4"></div>
</template>

<script setup lang="ts">
import { AxesHelper, BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { onMounted } from 'vue';
// 1. 创建场景
const scene = new Scene()
// 2. 创建相机
const camera = new PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
// 设置相机的位置
camera.position.set(10, 0, 0)
// 3. 创建渲染器
const renderer = new WebGLRenderer()
// 设置渲染器的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 4. 创建物体
// 创建几何体
const geometry = new BoxGeometry(1, 1, 1)
// 创建材质
const material = new MeshBasicMaterial({ color: 0xffff00 })
// 将几何体和材质组合起来创建物体
const cube = new Mesh(geometry, material)
// 将物体添加到场景中
scene.add(cube)
// 5. 监听屏幕的大小，修改渲染器和相机的宽高比例
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})
// 6. 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 7. 创建坐标轴辅助器
const axesHelper = new AxesHelper(5)
// 坐标轴辅助器添加到场景中
scene.add(axesHelper)

// 8. 创建render函数
function render() {
  requestAnimationFrame(render)
   // 每一帧都去修改物体的 position
   cube.position.x += 0.01
    if (cube.position.x>5) {
        cube.position.x = 0
    }
  renderer.render(scene, camera)
}
// 9. dom加载完成后将生成的canvas添加到dom中并调用render函数渲染
onMounted(() => {
  const element = document.getElementById('three4')
  element?.appendChild(renderer.domElement)
  render()
})
</script>

<style scoped>

</style>