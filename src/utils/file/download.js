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
