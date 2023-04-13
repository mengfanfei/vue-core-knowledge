<template>
  <div id="myBDmap"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

  onMounted(() => {
    console.log(window)
    const map = new window.BMapGL.Map("myBDmap")        // 创建地图实例 
    const point = new window.BMapGL.Point(116.404, 39.915)  // 创建点坐标 
    map.centerAndZoom(point, 10)
    map.enableScrollWheelZoom(true)
  })
</script>

<style scoped>
#myBDmap {
  height: 100%;
}
</style>