<template>
  <canvas id="particle">
    不支持
  </canvas>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue'

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

const warea = reactive<{
  x: null | number,
  y: null | number,
  max: number
}>({
  x: null,
  y: null,
  max: 200
})

window.onmousemove = (e) => {
  warea.x = e.clientX
  warea.y = e.clientY
}

window.onmouseout = () => {
  warea.x = null
  warea.y = null
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
    context.fillRect(item.x, item.y, 2, 2)
    drawParticleLine(item, dots)
  })
}

/**
 * 绘制粒子连接线
 */
const drawParticleLine = (dot: any, dots: any[]) => {
  // 加入鼠标粒子
  const ndots = [warea].concat(dots)
  for (const item of ndots) {
    if (dot === item || item.x === null || item.y === null) continue
    const xc = dot.x - item.x
    const yc = dot.y - item.y
    const distance = Math.sqrt(xc*xc + yc*yc)
    if (distance < item.max) {
      if (item === warea && distance > item.max / 2) {
        dot.x -= xc * 0.03
        dot.Y -= yc * 0.03
      }
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