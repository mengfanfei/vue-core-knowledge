# 缩放适配FireFox浏览器

## 1. 引言

在项目遇到系统需要统一缩放的情况，默认设计图尺寸宽1920，通过当前屏幕尺寸/1920得出缩放比例，然后赋值给`body`标签 `zoom`属性，在谷歌浏览器上没啥问题，但是在FireFox浏览器上`zoom`属性无效，所以需要通过使用`scale`属性适配FireFox浏览器


## 2. 主要代码

```JS
const deviceWidth = document.documentElement.clientWidth;
const scale = deviceWidth / 1920; // 分母-设计稿的尺寸
if (navigator.userAgent.indexOf("Firefox") > -1) { // 火狐浏览器

  document.body.style.cssText = `--scale: ${scale};`
  document.getElementById('app').style.height = `calc(100% / ${scale})` // 设置系统高度，如果设置body的高度容易使内容出现多个滚动条，根据实际情况处理
  document.body.style.transform = `scale(${scale})` // 缩放比例
  document.body.style.transformOrigin = 'top left' // 因为火狐浏览器缩放后不能占据全屏，默认居中，所以先移到左上角
  document.body.style.width = `calc(100% / ${scale})` // 然后将宽度通过反除比例得出全屏宽度
} else {
  document.body.style.cssText = `--scale: 1;` // 避免--scale不存在导致样式问题，默认为1
  document.body.style.zoom = scale
}
```

由于项目中首页一个模块占据全屏，所以设置此模块的高度

```js
mounted() {
    if (navigator.userAgent.indexOf("Firefox") > -1) {
      this.scaleHeight = document.body.offsetHeight / (document.documentElement.clientWidth / 1920) + 'px'
    } else {
      this.scaleHeight  = document.body.offsetHeight + 'px'
    }
}
```

上述代码中只是将app的内容高度改成屏幕高度了，但是body的标签高度还没有改，这就导致有弹窗时的背景蒙版高度不够，所以全局设置宽高

```css
/* 使用的element-plus组件库*/
/* --scale为上述代码中的缩放比例 */

.el-popup-parent--hidden {
  width: calc(100% / var(--scale)) !important;
  height: calc(100% / var(--scale));
}
```
