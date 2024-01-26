<template>
  <div class="base-container">
    <resize-frame class="frame"> <!--fill-mode="stretch"-->
      <!-- 公共头部 -->
      <!-- <base-header :now-id="nowId"></base-header> -->
      <!-- 其余内容 -->
      <slot></slot>
    </resize-frame>
  </div>
</template>

<script lang="ts" setup>
import ResizeFrame from '../frames/index'
// import BaseHeader from './baseHeader.vue'
defineProps({
  nowId: {
    type: Number,
    default: 1
  }
})
</script>

<style lang="scss" scoped>
.base-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  background: url('@/assets/screen/common_bg_webp') no-repeat center center;
  background-size: 100% 100%;
  .frame {
    position: relative;
    z-index: 9;
  }
}
</style>