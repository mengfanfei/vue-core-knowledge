<template>
  <canvas id="particle">
    不支持
  </canvas>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  drawParticle()
})

/** 
 * 创建粒子
 */
const dots = []
for (let i = 0; i < 100; i++) {
  dots.push({
    x: Math.random() * document.body.clientWidth, // x  , y  为  粒子坐标
    y: Math.random() * document.body.clientHeight,
    xa: Math.random() * 3 - 1, // xa , ya 为  粒子 xy 轴加速度
    ya: Math.random() * 3 - 1,
    max: 100 // 连线的最大距离 px
  })
}


const drawParticle = () => {
  const canvas = document.getElementById('particle') as HTMLCanvasElement
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  canvas.width = document.body.clientWidth
  canvas.height = document.body.clientHeight

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = 'rgba(255,255,0, 1)'
  context.fillRect(0, 0, canvas.width, canvas.height)
}

</script>