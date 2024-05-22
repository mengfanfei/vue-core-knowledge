# 自定义返回按钮

## 引言

> 自定义放回按钮用于没有header时，并对小程序和web端的位置进行了适配处理


## 代码实现

```vue
<template>
  <view class="back-btn" :style="positionStyle" @click="back">
    <uni-icons type="back" size="24" color="rgba(0,0,0,0.85)"></uni-icons>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'


const positionStyle = ref('')

onLoad(() => {
  // #ifndef H5
  const menu = uni.getMenuButtonBoundingClientRect()
  positionStyle.value = `top:${menu.top}px;height:${menu.height}px;border-radius:${menu.height/2}px;`
  // #endif
  // #ifdef H5
  positionStyle.value = `top:12px;height:32px;border-radius:16px;`
  // #endif
})

const back = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.back-btn {
  position: fixed;
  left: 24rpx;
  z-index: 999;
  width: 88rpx;
  background: rgba(255,255,255,0.45);
  border: 1rpx solid rgba(0,0,0,0.10);
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
```