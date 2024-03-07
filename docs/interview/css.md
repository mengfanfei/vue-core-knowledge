---
outline: [2,3]
---

# CSS相关面试题

## 1. CSS盒子模型

::: info 介绍
css盒子模型包含了**元素内容（content）**、**内边距（padding）**、**边框（border）**、**外边距（margin）** 几个要素。
:::

### 标准盒子模型

![标准盒子模型](../assets/imgs/cssBox.png)

元素框的总宽度 = width + padding-left + padding-right + border-left + border-right + margin-left + margin-right

元素框的总高度 = height + padding-top + padding-bottom + border-top + border-bottom + margin-top + margin-bottom

### IE盒子模型

![IE盒子模型](../assets/imgs/cssIEBox.png)

元素框的总宽度 = width + margin-left + margin-right

元素框的总高度 = height + margin-top + margin-bottom

width = padding-left + padding-right + border-left + border-right + content

height = padding-top + padding-bottom + border-top + border-bottom + content

::: warning 注意
`box-sizing: border-box` 表示IE盒子模型

`box-sizing: content-box` 表示标准盒子模型
:::

## 2. 谈谈你对BFC的理解

### 2.1 BFC是什么

`BFC`（Block Formatting Context），即块级格式化上下文，它是页面中的一块渲染区域，并且有一套属于自己的渲染规则：
- 内部的盒子会在垂直方向上一个接着一个的放置
- 对于同一个BFC的俩个相邻的盒子的margin会发生重叠，与方向无关
- 每个元素的左外边距与包含块的左边界相接触（从左到右），即使浮动元素也是如此
- BFC的区域不会与float的元素区域重叠
- 计算BFC的高度时，浮动子元素也参与计算
- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然

`BFC`目的时形成一个相对于外界完全独立的空间，让内部的子元素不会影响到外部的元素

### 2.2 触发条件

触发`BFC`的条件包含但不限于：

- 根元素，即HTML元素
- 浮动元素，float值为left，right
- overflow值不为visible，为auto，scroll，hidden
- display的值为inline-block，table，inline-table，flex，inline-flex，grid，inline-grid ...
- position的值为absolute或fixed

### 2.3 应用场景

- 防止margin重叠（塌陷）
- 清楚内部浮动
- 自适应多栏布局

## 3. 元素水平垂直居中的方法有哪些？

### 3.1 利用定位+margin: auto
  ```css
  .father {
    position: relative;
  }
  .son {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  ```
### 3.2 利用定位+margin:负值
  ```css
  .father {
    position: relative;
  }
  .son {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
    width: 100px;
    height: 100px;
  }
  ```

### 3.3 利用定位+transform
  ```css
  .father {
    position: relative;
  }
  .son {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  ```

### 3.4 table布局
  ```css
  .father {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }
  .son {
    display: inline-block;
  }
  ```

### 3.5 flex布局

  ```css
  .father {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ```

### 3.6 grid布局

  ```css
  .father {
    display: grid;
    align-items: center;
    justify-content: center;
  }
  ```
## 4. css选择器以及优先级

### 选择器

- **通用选择器**  : `*`
- **标签选择器**  : `div` `p` `span`
- **类选择器**   : `class="text"  .text {}`
- **ID选择器** : `id="hello"  #hello {}`
- **后代选择器** : `#box div` 
- **子选择器** : `.one>.one_1`
- **兄弟选择器** : `.one+.two`
- **群组选择器** : `div, p`
- **伪类选择器** : `:link` `:hover` `:foucs` `:first-child`
- **伪元素选择器** : `::after` `::before` `::first-line`
- **属性选择器** : `[attr]` `[attr=value]`

### 优先级

内联 > ID选择器 > 类选择器 > 标签选择器

## 5. 继承

继承是指给父元素设置一些属性，后代元素会自动拥有这些属性

### 有继承的属性

- 字体系列属性

  `font`,
  `font-family`,
  `font-weight`,
  `font-size`,
  `font-style`,
  `font-variant`,

- 文本系列属性

  `text-indent`,
  `text-align`,
  `line-height`,
  `word-spacing`,
  `letter-spacing`,
  `text-transform`,
  `direction`,
  `color`,

- 元素可见性

  `visibility`

- 表格布局属性

  `caption-side`,
  `border-collapse`,
  `border-spacing`,
  `empty-cells`,
  `table-layout`,

- 列表属性

  `list-style-type`,
  `list-style-position`,
  `list-style`,

- 引用

  `quotes`

- 光标属性

  `sursor`

  ### 无继承的属性

  - display
  - 文本属性：vertical-align text-decoration
  - 盒子模型的属性：宽度，高度，内外边距，边框等
  - 背景属性：背景图片，颜色，位置等
  - 定位属性：浮动，清除浮动，定位position等
  - 生成内容属性：content，counter-reset，counter-increment
  - 轮廓样式属性：outline-style，outline-width，outline-color，outline
  - 页面样式属性：size，page-break-before，page-break-after

## 6. CSS隐藏页面元素

- display: none （不占据空间，无法响应点击事件，重绘重排）
- visibility: hidden （占据空间，无法响应点击事件，重绘）
- opacity: 0 （占据空间，可以响应点击事件，重绘（利用动画不会触发重绘））
- 设置height,width为0
- position: absolute
- clip-path 

## 7. flex弹性布局

### 是什么

`flex` 意为“弹性布局”，可以简便，完整，响应式地实现各种页面布局

采用flex布局的元素，称为`flex`容器`container`

它的所有子元素自动成为容器成员，称为`flex`项目的`item`

容器中默认存在两条轴，主轴和交叉轴，呈90度关系。项目默认沿主轴排列，通过 `flex-direction`来决定主轴的方向

每根轴都有起点和终点，这对于元素的对齐非常重要