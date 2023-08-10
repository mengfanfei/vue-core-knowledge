<template>
  <div>
    <input type="file" name="oImageFile" id="oImageFile" accept="image/*" />
    <canvas id="canvasContainer" class="hidden"></canvas>
  </div>
</template>

<script setup lang="ts">
import { useCanvas } from '@/hooks/canvas'
import { onMounted } from 'vue'

const OPACTIY = 0.5

let POS: number[] = []

const { canvas, context } = useCanvas('canvasContainer')
const bindInit = () => {
  const oImageFile = document.getElementById('oImageFile')
  oImageFile?.addEventListener('change', handleFileChange)
  canvas.value?.addEventListener('mousedown', handleMouseDown)
}
onMounted(() => {
  bindInit()
})


const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files![0]
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    const oImage = new Image()
    oImage.src = e.target!.result as string
    oImage.onload = () => {
      const { width, height } = oImage
      generateCanvas(canvas.value!, width, height)
      context.value?.drawImage(oImage, 0, 0, width, height)
      // drawImageMask(0, 0, width, height, OPACTIY)
    }
  }
  
}

const generateCanvas = (canvas: HTMLCanvasElement, width: number, height: number) => {
  canvas.width = width
  canvas.height = height
  canvas.style.display = 'block'
}

const drawImageMask = (x: number, y: number, width: number, height: number, opacity: number) => {
  context.value!.fillStyle = `rgba(0, 0, 0, ${opacity})`
  context.value?.fillRect(x, y, width, height)
}

const handleMouseDown = (e: HTMLElementEventMap['mousedown']) => {
  POS = [ e.offsetX, e.offsetY ]
  context.value!.globalCompositeOperation = 'source-over'
  const { width, height } = canvas.value!
  context.value!.clearRect(0, 0, width, height)
  drawImageMask(0, 0, width, height, OPACTIY)
  // canvas.value?.addEventListener('mousemove', handleMouseMove)
  // canvas.value?.addEventListener('mouseup', handleMouseUp)
}
const handleMouseMove = (e: HTMLElementEventMap['mousemove']) => {
  const [ endX, entY ] = [ e.offsetX, e.offsetY ]
  const [ startX, startY ] = POS
  const rectWidth = endX - startX
  const rectHeight = entY - startY
  const { width, height } = canvas.value!
  context.value?.clearRect(0,0, width, height)
  drawImageMask(0, 0, width, height, OPACTIY)
  drawScreenShot()
}
const handleMouseUp = () => {
  canvas.value?.removeEventListener('mousemove', handleMouseMove)
  canvas.value?.removeEventListener('mouseup', handleMouseUp)
}

const drawScreenShot = () => {
  context.value!.globalCompositeOperation = 'destination-out'
}
</script>