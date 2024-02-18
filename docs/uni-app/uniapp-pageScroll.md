# 监听页面滚动显示隐藏tabs栏


## 实现思路

1. 监听页面滚动，滚动到一定程度时显示tabs栏，使用`onPageScroll`来判断页面滚动位置。
2. 往上滑时，隐藏tabs栏；往下拉时，显示tabs栏。

## 代码实现

```vue
<template>
<view>
    <!-- 搜索框 -->
    <view class="search_con" :style="{paddingBottom: isScroll && !isShowTabs ? '24rpx' : '0'}" @touchmove.stop.prevent="() => {}">
      <search-input v-model:value="queryParams.searchKey" @search="handleSearch"></search-input>
    </view>
    <view style="height: 96rpx;"></view>
    <view :style="isShowTabs ? 'position: sticky; top: 94rpx; z-index: 9;' : ''">
      <tabs :list="list" v-model:active="tabActive" @change="handleChange"></tabs>
    </view>
  </view>
</template>
<script setup lang="ts">

const isScroll = ref(false)
const scrollTop = ref(0)
const isShowTabs = ref(false)

onPageScroll(throttle((e: Page.PageScrollOption) => {
  if (e.scrollTop > uni.upx2px(96)) { // 滑动距离大于`uni.upx2px(96)`时，对搜索框的样式处理
    isScroll.value = true
  } else {
    isScroll.value = false
  }
  if (scrollTop.value - e.scrollTop >= 0 && isScroll.value) { // 当滑动距离大于`uni.upx2px(96)`并且是往上滑时，显示tabs栏（也就是tabs赋值position：sticky）
    isShowTabs.value = true
  } else {
    isShowTabs.value = false
  }
  scrollTop.value = e.scrollTop
}, 300, { trailing: false}))
</script>
```