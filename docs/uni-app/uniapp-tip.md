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

## 4. 小程序跳转另一个小程序的两种方法

### 1. 配置appid和页面路径path

```js
wx.navigateToMiniProgram({
  appId: '', // 要跳转的小程序appId
  path: 'page/index/index?id=123', // 要打开的页面
  extraData: { // 附加需要传递给目标小程序的数据
    foo: 'bar'
  },
  envVersion: 'release', // 要打开的小程序版本， develop开发，trial体验， release正式
  success(res) {
    // 打开成功
  },
  fail(res) {
    // 打开失败
  },
  complete(res) {
    // 成功,失败都调用
  }
})
```

### 2. 使用shortLink属性实现跳转

```js
wx.navigateToMiniProgram({
  shortLink: '#小程序://海信家/ijoHNgtTtvptcBx',
  envVersion: 'release', // 要打开的小程序版本， develop开发，trial体验， release正式
  success(res) {
    // 打开成功
  },
  fail(res) {
    // 打开失败
  },
  complete(res) {
    // 成功,失败都调用
  }
})
```

### 3. 使用限制 

#### 需要用户触发跳转
从 2.3.0 版本开始，若用户未点击小程序页面任意位置，则开发者将无法调用此接口自动跳转至其他小程序。
#### 需要用户确认跳转
从 2.3.0 版本开始，在跳转至其他小程序前，将统一增加弹窗，询问是否跳转，用户确认后才可以跳转其他小程序。如果用户点击取消，则回调 fail cancel。
#### 无需声明跳转名单，不限跳转数量（众测中）
1. 从2020年4月24日起，使用跳转其他小程序功能将无需在全局配置中声明跳转名单，调用此接口时将不再校验所跳转的 AppID 是否在 navigateToMiniProgramAppIdList 中。
2. 从2020年4月24日起，跳转其他小程序将不再受数量限制，使用此功能时请注意遵守运营规范。
