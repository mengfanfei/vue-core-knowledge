# CSS3系列之转换
::: info
`transform`属性允许你旋转，缩放，倾斜或平移。。。
:::

```css
transform: none; // 没有任何变换

transform: translate(12px, 50%); // 平移,2D,(x,y),x轴平移 y轴平移 translate(10px) = translate(10px, 0)
transform: translate3d(x,y,z); // 平移，3D, x轴平移 y轴平移 z轴平移
transform: translateX(x); // 平移，x轴平移
transform: translateY(y); // 平移，y轴平移
transform: translateZ(z); // 平移，z轴平移

transform: scale(x, y?); // 缩放，x轴缩放，y轴缩放 scale(1.5) = scale(1.5, 1.5),x,y:数字
transform: scale3d(x,y,z); // 缩放
transform: scaleX(x); // 缩放，x轴缩放
transform: scaleY(y); // 缩放，y轴缩放
transform: scaleZ(z); // 缩放，z轴缩放
```