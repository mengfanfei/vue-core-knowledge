<template>
  <div id="secondThree"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Scene, BoxGeometry, MeshLambertMaterial, Mesh, PointLight, AmbientLight, OrthographicCamera, WebGLRenderer } from 'three'
onMounted(() => {
/**
 * 场景Scene包括 网格模型Mesh 和 光照Light
 * 	网格模型, 又由 几何体对象Geometry 和 材质对象Material 组成
 * 	光照包含 平行光、环境光、点光源... ...
**/

// 1.创建场景对象Scene
var scene = new Scene()

// 1.1 创建网格模型, 并传入 Geometry 和 Material, 最后将网格模型添加到场景中
/**
 * BoxGeometry 立方体几何对象
 * SphereGeometry 球体几何对象
*/
var geometry = new BoxGeometry(100, 100, 100)
// var geometry = new THREE.SphereGeometry(60, 40, 40)
var material = new MeshLambertMaterial({ color: 0x0000ff })
var mesh = new Mesh(geometry, material)
scene.add(mesh)

// 1.2 光照设置

// 点光源
var point = new PointLight(0xffffff) // 0xffffff 就是光照强度
// 设置点光源位置
point.position.set(400, 200, 300)
// 将点光源添加到场景中
scene.add(point)

// 环境光
var ambient = new AmbientLight(0x444444)
scene.add(ambient)

/**
 * 相机Camera包括 投影方式、相机位置、相机方向
 * 	投影方式：
 *   正射投影OrthographicCamera(left左边界, right右边界, top上边界, bottom下边界, near从距离相机多远的位置开始渲染, far距离相机多远的位置截止渲染) 
 *   透射投影PerspectiveCamera(fov能够看到的角度范围, aspect渲染窗口的长宽比, near从距离相机多远的位置开始渲染, far距离相机多远的位置截止渲染)
**/

// 2.相机设置
var k = window.innerWidth / window.innerHeight
var s = 200 // 三维场景显示范围控制系数，系数越大，显示的范围越大

// 2.1 投影方式设置
var camera = new OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)

// 2.2 相机位置设置
camera.position.set(200, 300, 200)

// 2.3 相机方向设置
camera.lookAt(scene.position) // 指向的场景对象的位置


// 3.渲染器
var renderer = new WebGLRenderer()

// 设置渲染区域尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
// 设置背景颜色
renderer.setClearColor(0xb9d3ff, 1)
// 在body元素中插入canvas对象
const element = document.getElementById('secondThree') as HTMLElement
element.appendChild(renderer.domElement)

// 执行渲染操作(指定场景和相机作为参数)
renderer.render(scene, camera)
  })
</script>

<style scoped>

</style>