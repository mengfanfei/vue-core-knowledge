<template>
  <div id="myBDmap"></div>
</template>

<script setup lang="ts">
import { useMap } from '../../hooks/map'

const func = () => {
  console.log(bdMap.value)
}

const { bdMap, BMapGL} = useMap('myBDmap', {lng: 118, lat: 60}, 11, func)
</script>

<style scoped>
#myBDmap {
  height: 100%;
}
</style>