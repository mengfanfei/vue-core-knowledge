# uniapp Tips

## 1. 分包中的图片放在分包的static目录下
将图片放在分包的`static`目录下，在打包成微信小程序时不会将图片放在主里，如果分包中的图片没有在`static`目录下，图片将会打包到主包中的`static`中

## 2. 通过监听键盘高度来处理是否输入框focus
- 通过对输入框键盘高度的监听，赋值focus，然后根据focus的`true`与`false`来处理其他业务，比如：css的改变，内容的显隐等
- 如果通过`input`组件的`onblur`方法更改focus，然后通过`click`将focus设置为`true`则会出现延迟不说，还会出现不生效的问题，原因在于`onblur`的执行晚于`click`
- 通过`click`等主动方法处理focus时，先将focus置为`false`然后再置为`true`

```vue
<script lang="ts" setup>
const is_focus = ref(true)
const onKeyboardHeightChange = (e: any) => {
  if (e.detail.height === 0) {
    is_focus.value = false
  } else {
    is_focus.value = true
  }
}
const onFocus = () => {
  is_focus.value = false
  nextTick(() => {
    is_focus.value = true
  })
}
</script>

<template>
<view class="search_container" :class="{'search_container_active': is_focus}" @click.stop="moveHandle" @touchmove.stop.prevent="moveHandle">
  <view class="input_container" @click.stop="onFocus">
    <input
      type="text"
      :value="value"
      confirm-type="search"
      placeholder-style="color:rgba(0, 14, 48, 0.25);"
      :placeholder="placeholder"
      :focus="is_focus"
      class="search_input"
      @input="onInput"
      @keyboardheightchange="onKeyboardHeightChange"
      @confirm="(e: any) => onSearch(e.detail.value)"
    >
  </view>
</view>
</template>
```

## 3. 阻止滚动穿透
通过`@touchmove.stop.prevent`来阻止滚动穿透
```vue
<template>
  <view @touchmove.stop.prevent="moveHandle">

  </view>
</template>
<script>
const moveHandle = () => {
  return
}
</script>
```