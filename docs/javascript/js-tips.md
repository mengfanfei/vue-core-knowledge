# JS Tips

## 数组分组函数
```js
// 1. 数组分组函数
function arrayGrouping(arr, num) {
  const newArr = []
  for (let i = 0; i < arr.length; i += num) {
    newArr.push(arr.slice(i, i + num)) // // slice() 方法不会改变原始数组
  }
  return newArr
}
```
## 限制输入框只能输入数字并最多限制几位小数
```js
oninput="if(isNaN(value)) {value = parseFloat(value)} if (value.indexOf('.') > 0) {value = value.slice(0, value.indexOf('.') + 3)}"
// 可以改变最后一个数字，值为需要几位小数加一
```