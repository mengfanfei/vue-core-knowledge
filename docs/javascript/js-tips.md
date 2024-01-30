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
## js保留两位小数，整数不补零
```js
parseFloat(num.toFixed(2)) // num是变量
```
## 使用axios.CancelToken处理重复请求的问题
```js
// request.js

import axios from 'axios'

const requestMap = new Map()
const CancelToken = axios.CancelToken

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 60000 // 请求超时时间
})

service.interceptors.request.use(config => {
  /**
   * 判断是否是重复请求，重复请求取消
   *  */
  const uniqueCode = config.url + JSON.stringify(config.data) + '&' + config.method.toLowerCase()
  // 说明这个请求池中存在这个请求，还在进行中并没有结束
  if (requestMap.get(uniqueCode)) {
    // 防止提交表单等时候重复发起同一个请求（所以这里只限制了post请求）
    if (config.method === 'post') {
      // 取消重复请求（取消掉后面重复的请求）直接取消当前的请求，请求还未发出就被取消了，所以浏览器不会生成取消的记录
      config.cancelToken = new CancelToken(cancel => cancel('请不要重复提交!')) // 取消的是当前的请求
    }
  } else {
    // 存贮请求的唯一标识作为健key: 对应的取消函数作为值 value
    config.cancelToken = new CancelToken(cancel => requestMap.set(uniqueCode, cancel))
  }
  ...
  ...
  return config
}, err => {})

service.interceptors.response.use((response) => {
  // 剔除请求池中完成的请求
  const uniqueCode = response.config.url + response.config.data + '&' + response.config.method.toLowerCase()
  if (requestMap.get(uniqueCode)) {
    requestMap.delete(uniqueCode)
  }
  return response.data
}, error => {
  // 剔除请求池中的请求
  const uniqueCode = error.config.url + error.config.data + '&' + error.config.method.toLowerCase()
  if (requestMap.get(uniqueCode)) {
    requestMap.delete(uniqueCode)
  }
  ...
  ...
})
```