#  常见问题总结
## 1. Frame buffer object is incomplete: 36054

使用百度地图api控制台打印：Frame buffer object is incomplete: 36054

原因：承载地图的div容器没有设置大小

解决方法：给地图容器设置大小，比如
```css
#map {
  width: 100vw;
  height: 100vh;
}
```
