/*
 * @Descripttion: 
 * @Author: CaoShuangNa
 * @Date: 2023-06-14 13:22:45
 * @LastEditors: CaoShuangNa
 * @LastEditTime: 2023-10-19 15:56:13
 */
export const MUNICIPALITY_CITYCODE_LIST = ['110100', '120100', '310100', '500100']//直辖市城市code
export const MUNICIPALITY_PROVINCECODE_LIST = ['110000', '120000', '310000', '500000']//直辖市省code

/**
 * 处理直辖市，多用于树级联选择
 * 只支持北京市、天津市、上海市、重庆市的隐藏掉省
 * @param {Array} treeRegionvalue treeRegion接口返回数据
 */
export function reduceDupMunicipality(treeRegionvalue) {
  treeRegionvalue.forEach((value, index, array) => {
    if (MUNICIPALITY_PROVINCECODE_LIST.includes(value.regionCode)) {
      array[index] = value.children[0]
    }
  })
  return treeRegionvalue
}

/**
 * 处理直辖市地理位置信息显示
 * @param {String} provinceCode
 * @param {String} addr
 */
export function displayMunicipality (provinceCode,addr) {
  let address=''
    if (provinceCode&&MUNICIPALITY_PROVINCECODE_LIST.includes(provinceCode)) {
      address=addr&&addr.slice(3)
  }else{
    address=addr
  }
  console.log("=====",address)
  return address
}
