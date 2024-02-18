# 可视化大屏

封装一个组件实现按照设计稿比例进行设计开发，然后放大缩小实现全屏展示

```vue
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

```

## 基本使用
`baseWidth`&`baseHeight`为缩放前渲染大小，通常为设计稿中的画板高宽，设置后该组件会基于这些属性进行缩放处理。
设置属性后按照设计稿的固定像素正常开发即可，无需考虑不同分辨率下的适配问题。
> 在16:9的比例下(baseW/H 16:9), 适配2k(2560x1440), 4k(3840x2160)屏幕时不会有缩放问题，因为是按照比例缩放而非按照分辨率缩放。

根据要求考虑设置`fill-mode`

## 属性
- baseWidth 非必填， 基本渲染宽度，默认1920，设计稿中画板的宽度
- baseHieght 非必填，基本渲染高度，默认1080，设计稿中画板的高度
- fill-mode 非必填，缩放策略
- - 默认 居中缩放，任何情况下保持缩放比且所有内容均可见，原缩放策略
- - `stretch` 平铺缩放，任何情况下所有内容均可见且填满内容区域，无视缩放比

```vue
<template>
  <ResizeFrame :base-width="1920" :base-height="1080" :fill-mode="'' | 'stretch'">
    ...其他内容
  </ResizeFrame>
</template>
```
