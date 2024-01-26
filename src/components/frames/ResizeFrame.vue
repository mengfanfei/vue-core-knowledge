<template>
  <div
    class="resize-frame"
    :style="frameStyle"
  >
    <slot :scope="frameInfo"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, getCurrentInstance, defineProps } from 'vue'
import { debounce } from 'lodash-es'

const TYPE_STRETCH = 'stretch'

const props = defineProps({
  baseWidth: {
    type: Number,
    default: 1920
  },
  baseHeight: {
    type: Number,
    default: 1080
  },
  fillMode: {
    type: String,
    default: ''
  }
})
const instance = getCurrentInstance() as any

const frameStyle = ref('')
const frameInfo = ref({
  widthRatio: 1,
  heightRatio: 1,
  screenRatio: 1,
  frameWidth: 1080,
  frameHeight: 1920,
  scaleX: 1,
  scaleY: 1
})

const windowResizeHandler = debounce(() => {
  domResizeHandler()
}, 16.67)

onMounted(() => {
  domResizeHandler()
  window.addEventListener('resize', windowResizeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', windowResizeHandler)
}) 

function domResizeHandler () {
  const [baseWidth, baseHeight] = [props.baseWidth, props.baseHeight]

  const { innerHeight, innerWidth } = window

  const heightRatio = innerHeight / baseHeight
  const widthRatio = innerWidth / baseWidth
  const screenRatio = innerWidth / innerHeight
  const frameHeight = innerHeight
  const frameWidth = innerWidth

  const sizeStyle = `width: ${baseWidth}px; height: ${baseHeight}px; `

  const left = (innerWidth - baseWidth) / 2
  const top = (innerHeight - baseHeight) / 2

  let scaleX = 1
  let scaleY = 1
  if (props.fillMode === TYPE_STRETCH) { // 平铺模式
    scaleX = widthRatio
    scaleY = heightRatio
  } else {
    scaleX = heightRatio <= widthRatio ? heightRatio : widthRatio
    scaleY = scaleX
  }
  // 宽度过长，以height为准
  frameInfo.value = { heightRatio, widthRatio, screenRatio, frameHeight, frameWidth, scaleX, scaleY }

  requestAnimationFrame(() => {
    // 这种方案兼容高德地图（需做sacle额外处理), 不兼容百度地图
    // frameStyle.value = `${sizeStyle}; transform: scaleX(${scaleX}) scaleY(${scaleY}) translateX(-50%) translateY(-50%) translateZ(0);`
    // 兼容百度地图，不兼容高德地图，同BaseResizeFrame处理
    frameStyle.value = `${sizeStyle}; transform: scaleX(${scaleX}) scaleY(${scaleY}); left: ${left}px; top: ${top}px;`

    // 广播通知-屏幕大下调整了，图表也重新resize下
    nextTick(() => instance.$cast?.baseFrameResize.send())
  })
}
</script>

<style lang="scss" scoped>
.resize-frame {
  position: absolute;
  width: 1920px; // 默认样式，会被js替换调
  height: 1080px;
  box-sizing: border-box;
  transform-origin: center;
}
</style>
