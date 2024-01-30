# CSS Tips

## 修改input placeholder样式
```css
.placeholder-custom::-webkit-input-placeholder {  
  color: #babbc1;
  font-size: 12px;
}
```

## 巧用not选择器
```css
li:not(:last-child){
  border-bottom: 1px solid #ebedf0;
}
```

## 使用caret-color改变光标颜色
```html
<input type="text" class="caret-color" />
```
```css
.caret-color {
  /* 关键css */
  caret-color: #ffd476;
}
```

## 移除`type="number"`尾部的箭头
```html
<input type="number" class="no-arrow" />
```
```css
/* 关键css */
.no-arrow::-webkit-outer-spin-button,
.no-arrow::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
```
##  `outline:none`移除input状态线
```html
<input type="number" class="no-arrow" />
```
```css
.no-arrow{
  outline: none;
}
```
## 解决IOS滚动条卡顿
```css
body,html{   
  -webkit-overflow-scrolling: touch;
}
```
## 隐藏滚动条
```css
/* 关键代码 */
.box-hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
```
## 自定义文本选中的样式
```css
.box-custom::selection {
  color: #ffffff;
  background-color: #ff4c9f;
}
```
## 禁止文本选中
```css
.box p:last-child{
  user-select: none;
}
```
## 多行文本省略
```css
.more-line-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  /* 设置n行，也包括1 */
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
```
## css中的calc()函数出现【invalid property value】错误
【invalid property value】错误，即【无效的属性值】，比如 `width: calc(1536px+12px);` 。
解答：`calc()`函数是一个进行四则运算（加减乘除）的函数，在其中的运算符的两侧都需要保留一个空格才会生效。因此正确的写法应该是 `width: calc(1536 + 12px); `。
## 鼠标指针样式
```css
cursor: default; /**默认，箭头**/
cursor: pointer; /**手指**/
cursor: help; /**带问号的帮助样式**/
cursor: wait; /**加载中**/
cursor: text; /**文本选择**/
cursor: crosshair; /**十字样式**/
```
## border-image：使用图片设置border边框