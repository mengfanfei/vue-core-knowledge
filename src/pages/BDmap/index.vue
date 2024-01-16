<template>
  <div id="bdMap"></div>
</template>

<script setup lang="ts">
import { useMap } from '@/hooks/map'
import MyLocation from '@/assets/imgs/myEntLocation.png'
import { useMapFunc } from '@/hooks/mapFunc'
import { createDom } from '@/pages/BDmap/createDom'

const func = () => {
  // 开启鼠标滚轮缩放
  bdMap.value.enableScrollWheelZoom(true)
  // 绘制区域覆盖物
  drawArea()
  // 绘制我的企业位置
  drawMyCompany()
}

const { BMapGL, bdMap } = useMap('bdMap', {lng: 120.17284080370578, lat: 36.434558092962526}, 10, func)
const { drawAreaOverly } = useMapFunc()

/**
 * 绘制边界
 */
const drawArea = () => {
  drawAreaOverly(bdMap.value, BMapGL.value, '青岛', 0)
}

/**
 * 绘制我的企业位置
 */
const drawMyCompany = () => {
  //  创建一个Icon
  const point = new BMapGL.value.Point(120.17284080370578, 36.434558092962526)
  const myIcon = new BMapGL.value.Icon(MyLocation, new BMapGL.value.Size(48, 48), {
  });
  // 创建标注
  const marker = new BMapGL.value.Marker(point, {
    icon: myIcon,
    enableMassClear: false,
    offset: new BMapGL.value.Size(0, -24),
  }) // 创建图像标注
  // 添加到地图上
  bdMap.value.addOverlay(marker)
  // 创建自定义覆盖物
  const label = new BMapGL.value.CustomOverlay(createDom, {
    point,
    offsetY: -78,
    enableMassClear: false, // 是否能被统一清除掉覆盖物
    enableDraggingMap: true, // 是否可以在覆盖物位置拖拽地图
    // MaxZoom: 6, // 最大显示层级
    // MinZoom: 3, // 最小显示层级
    properties: {
      title: '我的企业'
    }
  })
  // 添加到地图上
  bdMap.value.addOverlay(label)
}
</script>

<style scoped>
#bdMap {
  width: 100vw;
  height: 100vh;
}
</style>
