<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  AmbientLight,
  Color,
  ColorRepresentation,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  Shape,
  WebGLRenderer,
  AxesHelper,
  Vector3,
  BufferGeometry,
  LineBasicMaterial,
  Line,
  Box3,
  Sprite,
  SpriteMaterial,
  TextureLoader
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import * as d3 from 'd3'

export interface Property {
  adcode: number
  name: string
  center: [number, number]
  centroid: [number, number]
  childrenNum: number
  level: string
  parent: number
  subFeatureIndex: number
  acroutes: number[]
}

export interface Geometry {
  type: string
  coordinates: [number, number][][][]
}
interface Feature {
  type: string;
  properties: Property
  geometry: Geometry
}
interface IMapInfo {
  type: string
  features: Feature[]
}

const mapRef = ref<HTMLDivElement | null>(null)

// 创建场景
const scene = new Scene()
// 设置场景参数
const setSceneParams = () => {
  scene.background = new Color(0xffffff)
}

// 创建相机
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机参数
const setCameraParams = () => {
  camera.position.set(0, -1.5, 4)
}

// 渲染器
const renderer = new WebGLRenderer({
  // alpha: true, // 透明
  antialias: true // 抗锯齿
})
// 设置渲染器参数
const setRendererParams = () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
}

// CSS2D渲染器
const css2DRenderer = new CSS2DRenderer()
// 设置CSS2D渲染器参数
const setCSS2DRendererParams = () => {
  css2DRenderer.setSize(window.innerWidth, window.innerHeight)
  css2DRenderer.domElement.style.position = 'absolute'
  css2DRenderer.domElement.style.top = '0px'
  css2DRenderer.domElement.style.pointerEvents = 'none'
}

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器参数
const setControlsParams = () => {
  controls.enableDamping = true
  controls.dampingFactor = 0.25
}

// 添加灯光
const addLight = () => {
  // 环境光
  const ambientLight = new AmbientLight(0xd4e7fd, 4)
  scene.add(ambientLight)
  // 平行光
  const light = new DirectionalLight(0xffffff, 0.2)
  light.position.set(0, 5, 8)
  const light2 = light.clone()
  light2.position.set(0, -5, 8)
  const light3 = light.clone()
  light3.position.set(5, 0, 8)
  const light4 = light.clone()
  light4.position.set(-5, 0, 8)
  // 添加到场景
  scene.add(light, light2, light3, light4)
}

// 获取地图坐标信息
const getMapInfo = async () => {
  const url = 'https://geo.datav.aliyun.com/areas_v3/bound/370200_full.json'
  const result = await fetch(url)
  return result.json()
}

const offsetXY = d3.geoMercator()

// 生成地图
const createMap = (mapInfo: IMapInfo) => {
  const map = new Object3D()
  const center = mapInfo.features[0].properties.centroid
  offsetXY.center(center).translate([0, 0])
  mapInfo.features.forEach((feature) => {
    const unit = new Object3D()
    const { centroid, center, name } = feature.properties
    const { coordinates, type } = feature.geometry
    const point = centroid || center || [0, 0]
    const color = new Color(`hsl(
      ${233},
      ${Math.random() * 30 + 55}%,
      ${Math.random() * 30 + 55}%)
    `).getHex()
    const depth = 0.3

    const label = createLabel(name, point, depth)
    const icon = createIcon(center, depth)

    coordinates.forEach((coordinate) => {
      if (type === 'MultiPolygon') coordinate.forEach(item => fn(item))
      // if (type === 'Polygon') fn(coordinate)
      function fn(coordinate: [number, number][]) {
        const mesh = createMesh(coordinate, color, depth)
        const line = createLine(coordinate, depth)
        unit.add(mesh, ...line)
        unit.name = name
      }
    })
    map.add(unit, label, icon)
  })
  setCenter(map)
  return map
}

// 创建Mesh
const createMesh = (data: [number, number][], color: ColorRepresentation, depth: number) => {
  const shape = new Shape()
  data.forEach((item, index) => {
    const [x, y] = offsetXY(item) as [number, number]
    if (index === 0) {
      shape.moveTo(x, -y)
    } else {
      shape.lineTo(x, -y)
    }
  })
  // 创建挤压缓冲几何体
  const geometry = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false
  })
  //  创建材质
  const material = new MeshStandardMaterial({
    color, // 颜色
    side: DoubleSide,
    transparent: true,
    metalness: 0.8, // 金属度
    roughness: 0.45, // 粗糙度
  })
  return new Mesh(geometry, material)
}
// 创建line
const createLine = (data: [number, number][], depth: number) => {
  const points: Vector3[] = []
  data.forEach(item => {
    const [x, y] = offsetXY(item) as [number, number]
    points.push(new Vector3(x, -y, 0))
  })
  const lineGeometry = new BufferGeometry().setFromPoints(points)
  const upLineMaterial = new LineBasicMaterial({
    color: 0xffffff
  })
  const downLineMaterial = new LineBasicMaterial({
    color: 0xffffff
  })
  const upLine = new Line(lineGeometry, upLineMaterial)
  const downLine = new Line(lineGeometry, downLineMaterial)
  upLine.position.z = depth + 0.0001
  downLine.position.z = -0.0001
  return [upLine, downLine]
}
// 创建label
const createLabel = (name: string, point: [number, number], depth: number) => {
  const div = document.createElement('div')
  div.style.color = '#fff'
  div.style.fontSize = '12px'
  div.style.textShadow = '1px 1px 2px #047cd6'
  div.textContent = name
  const label = new CSS2DObject(div)
  label.scale.set(0.01, 0.01, 0.01)
  const [x, y] = offsetXY(point) as [number, number]
  label.position.set(x, -y, depth)
  return label
}
// 创建icon
const createIcon = (point: [number, number], depth: number) => {
  const url = new URL('@/assets/imgs/icon.png', import.meta.url).href
  const map = new TextureLoader().load(url)
  const icon = new Sprite(new SpriteMaterial({
    map,
    transparent: true
  }))
  const [x, y] = offsetXY(point) as [number, number]
  icon.position.set(x, -y, depth + 0.1)
  icon.scale.set(0.2, 0.2, 0.2)
  icon.renderOrder = 1
  return icon
}
// 将地图居中
const setCenter = (map: Object3D) => {
  const box = new Box3().setFromObject(map)
  // 盒子辅助器
  // const boxHelper = new Box3Helper(box, new Color(0xffff00))
  // scene.add(boxHelper)
  const center = box.getCenter(new Vector3())

  map.position.x = map.position.x - center.x
  map.position.y = map.position.y - center.y
}
// 初始化地图
const initMap = async () => {
  const mapInfo: IMapInfo = await getMapInfo()
  const map = createMap(mapInfo)
  scene.add(map)
}

// 将画布挂在到DOM上
const addCanvas = () => {
  mapRef.value?.appendChild(renderer.domElement)
  mapRef.value?.appendChild(css2DRenderer.domElement)
}

// 渲染
const render = () => {
  renderer.render(scene, camera)
  css2DRenderer.render(scene, camera)
}

// 动画
const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  render()
}

// 监听窗口大小变化
const handleResize = () => {
  setRendererParams()
  setCSS2DRendererParams()
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  render()
}

// 设置gui
const setGUI = () => {
  const gui = new GUI()
  // gui.add(controls, 'enableRotate').name('旋转')
  // gui.add(controls, 'enableZoom').name('缩放')
  // gui.add(controls, 'enablePan').name('平移')
  gui.add(controls, 'enableDamping').name('阻尼')
  gui.add(controls, 'dampingFactor', 0, 0.99).name('阻尼系数')
  gui.add(controls, 'minDistance', 0, 100).name('最小距离')
  gui.add(controls, 'maxDistance', 0, 100).name('最大距离')
}

// 添加辅助坐标系
const addAxes = () => {
  const axesHelper = new AxesHelper(5)
  scene.add(axesHelper)
}

onMounted(() => {
  // 初始化场景参数
  setSceneParams()
  // 初始化相机参数
  setCameraParams()
  // 初始化渲染器参数
  setRendererParams()
  // 初始化CSS2D渲染器参数
  setCSS2DRendererParams()
  // 初始化控制器参数
  setControlsParams()
  // 初始化地图
  initMap()
  // 添加灯光
  addLight()
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
  // 初始化gui
  // setGUI()
  // 添加辅助坐标系
  // addAxes()
  // 初始化画布
  addCanvas()
  // 渲染,动画
  animate()
})
</script>

<template>
  <div ref="mapRef"></div>
</template>

<style scoped>

</style>