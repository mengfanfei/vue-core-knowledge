# 导出与下载

## 1. 通过链接下载

经过调用接口获取一个链接地址，通过模拟点击`a`链接下载

方法如下：

```js
export function downloadUrl (url, name) {
  const link = document.createElement('a')
  link.setAttribute('display', 'none')
  link.download = name
  link.href = url
  document.body.appendChild(link)
  link.click()

  setTimeout(() => {
    URL.revokeObjectURL(url)
    document.body.removeChild(link)
  }, 150)
}
```

## 2. 通过blob文件流下载

::: warning 注意
将 `responseType: 'blob'` 添加到请求接口中
:::

通过接口返回一个blob文件流，然后经过 `getContentDispositionFileName` 方法获取文件名， 然后使用 `downloadBlob` 方法导出内容

方法如下：

```js
// 实例
// content-disposition: attachment; filename="导出测试.xlsx"
// content-disposition: attachment; filename=aaa.xlsx
/**
 * 从response header为content-disposition获取文件名
 * @param {AxiosResponse<any, any>} response Axios.httpResponse
 * @returns
 */
export function getContentDispositionFileName (response) {
  const disposition = response.headers['content-disposition']

  const reg = new RegExp('filename="?([^;]+\\.[^\\.;]+);*"?', 'i')
  const regResult = reg.exec(disposition)
  if (!regResult) console.error('解析content-disposition失败，未匹配到结果')

  let fileName
  if (regResult && regResult[1]) {
    fileName = regResult[1].replace(/['"]/g, '')
  }
  const result = decodeURI(fileName)

  return result
}

/**
 * 下载blob文件
 */
export function downloadBlob (blob, name = '导出数据') {
  const link = document.createElement('a')
  link.setAttribute('display', 'none')
  const url = URL.createObjectURL(blob)
  link.download = name
  link.href = url
  document.body.appendChild(link)
  link.click()

  setTimeout(() => {
    URL.revokeObjectURL(url)
    document.body.removeChild(link)
  }, 150)
}
```