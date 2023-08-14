<template>
  <div class="thirdThree">

  </div>
</template>

<script setup lang="ts">
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { onMounted } from 'vue'

/**
 * 场景
 */
const scene = new Scene()
/**
 * 相机
 */
const camera = new PerspectiveCamera(100, window.innerWidth/window.innerHeight, 0.1, 1500)
camera.position.set(8, 1, 12)
/**
 * 渲染器
 */
const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)



onMounted(() => {

})
</script>

<style scoped>

</style>