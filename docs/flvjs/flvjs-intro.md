# flv.js的简单使用


> bilibili出品的一个用纯 JavaScript 编写的 HTML5 Flash 视频 \(FLV\) 播放器。
>
> flv.js 的工作原理是将 FLV 文件流转换为 ISO BMFF（碎片 MP4）片段，然后通过媒体源扩展API将 mp4 片段馈送到 HTML5`<video>`元素中。
>
> flv.js 使用ECMAScript 6编写，由Babel Compiler转译为 ECMAScript 5 ，并与Browserify捆绑在一起。
> 
> **特性**
> - 具有 H.264 + AAC \/ MP3 编解码器播放功能的 FLV 容器
> - 多部分分段视频播放
> - HTTP FLV 低延迟直播流播放
> - FLV over WebSocket 实时流播放
> - 兼容 Chrome、FireFox、Safari 10、IE11 和 Edge
> - 开销极低，并且由浏览器进行硬件加速！

## 安装
```bash
npm/pnpm/yarn install --save flv.js
```

## 使用
```vue
<template>
  <video id="videoElement" ref="videoElement" muted autoplay></video>
</template>
<script setup>
import flvjs from 'flv.js'
let flvPlayer = null
const videoElement = ref()
const lastDecodedFrames = ref(0)

/**
 * flv播放设置
 */
const setFlv = (url) => {
  if (flvjs.isSupported()) {
    flvPlayer = flvjs.createPlayer({
      type: 'flv',
      url
    })
  }
  flvPlayer.attachMediaElement(videoElement.value)
  flvPlayer.load()
  flvPlayer.play()

  flvPlayer.on(flvjs.Events.ERROR, (errorType, errorInfo) => {
    flvPlayer.pause()
    flvPlayer.unload()
    flvPlayer.detachMediaElement()
    flvPlayer.attachMediaElement()
    flvPlayer.load()
    flvPlayer.play()
  })

  flvPlayer.on(flvjs.Events.STATISTICS_INFO, (info) => {
    if(lastDecodedFrames.value === 0) {
      lastDecodedFrames.value = info.decodedFrames
      return
    }
    if (lastDecodedFrames.value !== info.decodedFrames) {
      lastDecodedFrames.value = info.decodedFrames
    } else {
      lastDecodedFrames.value = 0
      flvPlayer.pause()
      // flvPlayer.unload()
      // flvPlayer.detachMediaElement()
      // flvPlayer.attachMediaElement()
      // flvPlayer.load()
      flvPlayer.play()
    }
  })
}

onMounted(() => {
  setFlv('.....')
})
</script>
```