# HTML相关面试题

## 1. cookies、sessionStorage、localStorage的区别

### 存储大小
- cookies数据大小不能超过4k
- sessionStorage和localStorage虽然也有限制，但是要大的多，可达到5M或更大
### 有效时长
- localStorage 存储持久数据，关闭浏览器数据不会丢失，除非主动删除
- sessionStorage 只在会话中存在，页面会话结束数据就会被清除
- cookies 在设置的有效时间内一直有效，即使窗口或浏览器关闭
### 作用域
- sessionStorage 只在同源同窗口（或标签页）中共享数据，也就是在当前会话中
- localStorage 在所有同源窗口中共享
- cookies 在所有同源窗口中共享

## 2. 块级元素和行内元素有哪些

**常见的块级元素**：`p、div、form、ul、li、ol、table、h1～h6、dl、dt、dd`

**常见的行内元素**：`span、a、img、button、input、select、i`

**块级元素**

- 总是在新行上开始，就是每个块级元素独占一行，默认从上到下排列
- 宽度缺少时是它的容器的100%，除非设置一个宽度
- 高度、行高以及外边距和内边距都是可以设置的
- 块级元素可以容纳其它的块级元素和行内元素

**行内元素**

- 和其它元素都会在一行显示
- 宽度就是文字或者图片的宽度，不能改变，行内元素设置宽度`width`无效
- 行内元素只能容纳文本或者其它行内元素
- 行内元素设置`height`无效，但是可以通过`line-height`来设置
- 设置`margin`只有左右有效，上下无效
- 设置`padding`只有左右有效，上下无效

可以通过`display`属性对行内元素和块级元素进行切换


## 3. script、script async 和 script defer的区别

- `<script>` -  HTML 解析中断，脚本被提取并立即执行。执行结束后，HTML 解析继续。
- `<script async>` - 脚本的提取、执行的过程与 HTML 解析过程并行，脚本执行完毕可能在 HTML 解析完毕之前。当脚本与页面上其他脚本独立时，可以使用 async，比如用作页面统计分析。
- `<script defer>` - 脚本仅提取过程与 HTML 解析过程并行，脚本的执行将在 HTML 解析完毕后进行。如果有多个含 defer 的脚本，脚本的执行顺序将按照在 document 中出现的位置，从上到下顺序执行。

注意：没有 src 属性的脚本，async 和 defer 属性会被忽略。

## 4. iframe的优缺点与通信

**优点**

- 可以在页面上独立显示一个页面或者内容，不会与页面其它元素产生冲突。
- 可以在多个页面中重用同一个页面或者内容，可以减少代码的冗余。
- 加载是异步的，页面可以在不等待iframe加载完成的情况下进行展示。
- 放便的实现跨域访问

**缺点**

- 搜索引擎可能无法正确解析iframe中的内容
- 会阻塞主页面的onload事件
- 和主页面共享连接池，影响页面并行加载


::: info 提示
使用`postMessage` 和 `window.addEventListener('message', e => { ... })`来实现iframe父子页面通信
:::

## 5. meta viewport 是做什么用的，怎么写？

Viewport，适配移动端，可以控制视口的大小和比例：

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

其中，content 参数有以下几种：

- `width` viewport ：宽度(数值/device-width)
- `height` viewport ：高度(数值/device-height)
- `initial-scale` ：初始缩放比例
- `maximum-scale` ：最大缩放比例
- `minimum-scale` ：最小缩放比例
- `user-scalable` ：是否允许用户缩放(yes/no)