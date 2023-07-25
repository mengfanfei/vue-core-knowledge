<template>
  <canvas id="particle">
    不支持
  </canvas>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'

let canvas: HTMLCanvasElement, context: CanvasRenderingContext2D

/** 
 * 创建粒子
 */
const dots: any[] = []
for (let i = 0; i < 150; i++) {
  dots.push({
    x: Math.random() * document.body.clientWidth, // x  , y  为  粒子坐标
    y: Math.random() * document.body.clientHeight,
    xa: Math.random() * 2 - 1, // xa , ya 为  粒子 xy 轴加速度
    ya: Math.random() * 2 - 1,
    max: 150 // 连线的最大距离 px
  })
}

/**
 * 绘制粒子
 */
const drawParticle = () => {
  canvas = document.getElementById('particle') as HTMLCanvasElement
  context = canvas.getContext('2d') as CanvasRenderingContext2D
  canvas.width = document.body.clientWidth
  canvas.height = document.body.clientHeight

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = 'rgba(0, 43, 54, 1)'
  context.fillRect(0, 0, canvas.width, canvas.height)
  dots.forEach(item => {
    item.x += item.xa
    item.y += item.ya
    item.xa *= item.x > canvas.width || item.x < 0 ? -1 : 1
    item.ya *= item.y > canvas.height || item.y < 0 ? -1 : 1
    context.fillStyle = 'rgba(255,218,27,1)'
    context.fillRect(item.x - 1, item.y - 1, 2, 2)
    drawParticleLine(item, dots)
  })
}

/**
 * 绘制粒子连接线
 */
const drawParticleLine = (dot: any, dots: any[]) => {
  for (const item of dots) {
    if (dot === item || item.x === null || item.y === null) continue
    const xc = dot.x - item.x
    const yc = dot.y - item.y
    const distance = Math.sqrt(xc*xc + yc*yc)
    if (distance < item.max) {
      const ratio = (item.max - distance) /item.max
      context.beginPath()
      context.lineWidth = ratio / 2
      context.moveTo(dot.x, dot.y)
      context.lineTo(item.x, item.y)
      context.strokeStyle = 'rgba(255,218,27,1)'
      context.stroke()
    }
  }
}

const draw = () => {
  window.requestAnimationFrame(draw)
  drawParticle()
}

onMounted(() => {
  draw()
})

</script>