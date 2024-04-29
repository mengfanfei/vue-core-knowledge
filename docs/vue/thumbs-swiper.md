# 带缩略图的轮播图

## 安装swiper

```shell
npm install swiper / yarn add swiper / pnpm add swiper
```
## 效果
<img src="../assets/imgs/thumbsSwiper.gif"  alt="轮播图" />


## thumbsSwiper组件

```vue
<template>
  <!-- Swiper -->
  <div style="--swiper-navigation-color: #fff; --swiper-pagination-color: #fff; --swiper-navigation-size: 24px;" class="swiper mySwiper2">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item, index) in picsList" :key="index">
        <el-image
          :src="item"
          alt=""
          fit="contain"
          :preview-src-list="picsList"
          :initial-index="index"
          style="width: 100%; height: 100%;"
          preview-teleported
        />
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
  <div class="swiper mySwiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item, index) in picsList" :key="index">
        <el-image
          :src="item"
          alt=""
          fit="contain"
          style="width: 100%; height: 100%;"
        />
        <div class="mark"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Swiper from 'swiper'
import { Navigation, Thumbs, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

const props = defineProps<{
  picsList: string[],
  loop?: boolean
}>()

const initSwiper = () => {
  const swiper = new Swiper('.mySwiper', {
    loop: props.loop,
    modules: [FreeMode, Navigation, Thumbs],
    spaceBetween: 8,
    slidesPerView: 'auto',
    freeMode: true,
    watchSlidesProgress: true
  })
  new Swiper('.mySwiper2', {
    loop: props.loop,
    modules: [FreeMode, Navigation, Thumbs],
    spaceBetween: 0,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    thumbs: {
      swiper: swiper
    }
  })
}
onMounted(() => {
  initSwiper()
})
</script>

<style scoped lang="scss">
.mySwiper2 {
  width: 540px;
  height: 540px;

  .swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .swiper-button-next, .swiper-button-prev {
    transition-duration: 0.3s;
    opacity: 0;
  }
  &:hover {
    .swiper-button-next, .swiper-button-prev {
      opacity: 1;
    }
  }
}
.mySwiper {
  width: 540px;
  height: 78px;
  margin-top: 8px;
  .swiper-slide {
    width: 78px;
    height: 78px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .mark {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.45);
      z-index: 1;
    }
  }
  .swiper-slide-thumb-active {
    .mark {
      background: transparent;
      border: 2px solid #d6a441;
    }
  }
}
</style>
```

## 简介

- 通过使用 `swiper` 库实现轮播图
- 传入参数 `picsList` -图片链接集合，`loop` -是否循环，默认`false`
- 图片放大预览使用`el-image`的`preview-src-list`属性
