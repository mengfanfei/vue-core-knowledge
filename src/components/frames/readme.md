# ResizeFrame

## 基本使用
`baseWidth`&`baseHeight`为缩放前渲染大小，通常为设计稿中的画板高宽，设置后该组件会基于这些属性进行缩放处理。
设置属性后按照设计稿的固定像素正常开发即可，无需考虑不同分辨率下的适配问题。
> 在16:9的比例下(baseW/H 16:9), 适配2k(2560x1440), 4k(3840x2160)屏幕时不会有缩放问题，因为是按照比例缩放而非按照分辨率缩放。

根据要求考虑设置`fill-mode`

### 属性
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



## ResizeFrame.vue 
缩放适配器组件

- 相比与之前版本添加`fillMode`属性来控制缩放策略
- 改为CompositionAPI写法，部分细节修改

## BaseReiszeFrame.vue 
缩放适配器组件原版
