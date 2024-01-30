---
outline: [2,3]
---

# CSS3系列之过渡
## 什么是css3过渡
- CSS3 过渡是元素从一种样式逐渐改变为另一种的效果。

- CSS transitions 可以决定**哪些属性发生动画效果** (明确地列出这些属性)，**何时开始 (设置 delay）**，**持续多久 (设置 duration)** 以及**如何动画 (定义timing function，比如匀速地或先快后慢)**。
## 语法与属性
```css
div {
    transition: <property> <duration> <timing-function> <delay>;
}
```
### transition
- 简写属性，用于在一个属性中设置四个过渡属性。
### transition-property
- 规定应用过渡的 CSS 属性的名称。
- 使用你想要改变的属性，全部为all。
- 指定哪个或哪些 CSS 属性用于过渡。只有指定的属性才会在过渡中发生动画，其它属性仍如通常那样瞬间变化。
### transition-duration
- 定义过渡效果花费的时间。默认是 0。
- 指定过渡的时长。或者为所有属性指定一个值，或者指定多个值，为每个属性指定不同的时长。
### transition-timing-function
- 规定过渡效果的时间曲线。默认是 "ease"。
### transition-delay
- 规定过渡效果何时开始。默认是 0。
- 指定延迟，即属性开始变化时与过渡开始发生时之间的时长。

### 注意
::: warning
- 必须要指定添加效果的CSS属性。
- 必须指定效果的持续时间。如果未指定的期限，transition将没有任何效果，因为默认值是0。
:::
### 举例
```css
/* 全部属性 */
div {
  transition-property: width;
  transition-duration: 2s;
  transition-timing-functing: ease;
  transition-delay: 1s;
}
/** 下面是简写形式 **/
div {
  transition: width 2s ease 1s;
}
```
```css
/* 简写 */
div {
  transition: width 2s;
}
```
```css
/* 改变多个属性，用逗号隔开 */
div	{
  transition: width 2s, height 3s, transform 2s;
}
```
```css
/* 当属性值列表长度不一致时 */
div {
  transition-property: opacity, left, top, height;
  transition-duration: 3s, 5s;
}
/** 按下面方式处理 **/
div {
  transition-property: opacity, left, top, height;
  transition-duration: 3s, 5s, 3s, 5s;
}

----------------------------

div {
  transition-property: opacity, left;
  transition-duration: 3s, 5s, 2s, 1s;
}
/** 按下面方式处理 **/
div {
  transition-property: opacity, left;
  transition-duration: 3s, 5s;
}
```
## 检测过渡是否完成
当过渡完成时触发一个事件，在符合标准的浏览器下，这个事件是 `transitionend`, 在 WebKit 下是 `webkitTransitionEnd`。 `transitionend` 事件提供两个属性:
1. `propertyName`
字符串，指示已完成过渡的属性。
2. `elapsedTime`
浮点数，指示当触发这个事件时过渡已运行的时间（秒）。这个值不受 `transition-delay` 影响。
照例可以用 `element.addEventListener()` 方法来监听这个事件：
```js
el.addEventListener("transitionend", updateTransition, true);
```
::: warning
备注： 如果取消了过渡则不会触发 `transitionend` 事件，因为在过渡完成前动画的属性值改变了。
:::
## 实例
### 1. 鼠标悬浮在图片上，图片放大
::: info 
**关键代码：transition: transform 2s;      transform: scale(1.5);**
:::
<iframe width="100%" height="500" src="https://codepen.io/mengfanfei/embed/ababrYr"></iframe>

### 2. 鼠标悬浮，模块上移
::: info
**关键代码：transition: transform 0.3s;      transform: translateY(-8px);**
:::
<iframe width="100%" height="500" src="https://codepen.io/mengfanfei/embed/XWPpjje"></iframe>

### 3. 鼠标悬浮，列表突出
::: info
**关键代码：transition: all 0.3s;  position: relative;   z-index: 1;   box-shadow: 0 4px 16px 0 rgba(0,22,49,0.15);**
:::
<iframe width="100%" height="500" src="https://codepen.io/mengfanfei/embed/vYzgXjq"></iframe>
