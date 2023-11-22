<script setup lang="ts">
import { onMounted } from 'vue'
import flvjs from 'flv.js'

onMounted(() => {
  if (flvjs.isSupported()) {
    const videoElement = document.getElementById('videoElement') as  HTMLMediaElement
    const flvPlayer = flvjs.createPlayer({
      type: 'mp4',
      url: 'https://hd-oss.cosmoplat.com/hdCosmo58:cosmoplat-qdind-video-upload/20221122160528_1e4336cac1ce4ee0bc3fa9479990df5c.mp4'
    });
    flvPlayer.attachMediaElement(videoElement)
    flvPlayer.load()
    flvPlayer.play()
  }
})
</script>

<template>
  <div>
    <video id="videoElement" class="w-full" controls></video>
  </div>
</template>

<style scoped>

</style>
