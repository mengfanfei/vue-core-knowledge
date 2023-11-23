<template>
  <div>
    <FlvVideo url="https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv" />
  </div>
</template>

<script setup lang="ts">
// import { onMounted, ref } from 'vue'
// import flvjs from 'flv.js'
import FlvVideo from '@/components/FlvVideo.vue'

// const lastDecodedFrames = ref(0)
//
// onMounted(() => {
//   if (flvjs.isSupported()) {
//     const videoElement = document.getElementById('videoElement') as  HTMLMediaElement
//     const flvPlayer = flvjs.createPlayer({
//       type: 'flv',
//       isLive: true,
//       hasAudio: false,
//       hasVideo: true,
//       url: 'https://sd-sme.caiicloud.com:7094/rtsp/live/ch11_0_1.flv',
//     }, {
//       enableWorker: false, // 不启用分离的线程进行转换，之前为true
//       enableStashBuffer: false, // 关闭IO隐藏缓冲区
//       stashInitialSize: 128, // 减少首帧显示等待时长
//       autoCleanupSourceBuffer: true, // 打开自动清除缓存
//       fixAudioTimestampGap: false, //false才会音视频同步,新增
//       lazyLoad: false, // 去掉懒加载,新增
//     });
//     flvPlayer.attachMediaElement(videoElement)
//     flvPlayer.load()
//
//     flvPlayer.on(flvjs.Events.ERROR, (errorType: number, errorInfo: any) =>{
//       console.log(errorType, errorInfo)
//
//       // flvPlayer.pause()
//       // flvPlayer.unload()
//       // flvPlayer.detachMediaElement()
//       // // flvPlayer.destroy()
//       //
//       //
//       // flvPlayer.attachMediaElement(videoElement)
//       // flvPlayer.load()
//       // flvPlayer.play()
//     })
//
//     // flvPlayer.on('statistics_info', (res) => {
//     //   console.log(res)
//     //   if (lastDecodedFrames.value === 0) {
//     //     lastDecodedFrames.value = res.decodedFrames
//     //     return
//     //   }
//     //   if (lastDecodedFrames.value !== res.decodedFrames) {
//     //     lastDecodedFrames.value = res.decodedFrames
//     //   } else {
//     //     // lastDecodedFrames.value = 0
//     //     // flvPlayer.pause()
//     //     // flvPlayer.unload()
//     //     // flvPlayer.detachMediaElement()
//     //     // // flvPlayer.destroy()
//     //     //
//     //     //
//     //     // flvPlayer.attachMediaElement(videoElement)
//     //     // flvPlayer.load()
//     //     // flvPlayer.play()
//     //   }
//     // })
//   }
// })
</script>


<style scoped>

</style>
