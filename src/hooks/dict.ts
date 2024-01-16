import store from '@/store'
import { GetDictByType2, GetDictByType, GetDictLevelData, GetDictTreeDataNeedChildFlag } from '@/api/common/common'
import { reactive, ref } from 'vue'


interface DictsListItem {
  key: string
  value: any
}

interface ResponseResult {
  dictLabel: string
  dictValue: string
  [propsName: string]: any
}

export interface DictData {
  value: string,
  label: string,
  raw: ResponseResult
}

export interface DictMap {
  [x:string]: DictData[]
}

export interface DictTreeData {
  id: number
  dictCode: string
  dictName: string
  children?: DictTreeData[]
}

function searchDictByKey (dict: DictsListItem[], key: string) {
  if (key == null && key === '') {
    return null
  }
  try {
    for (let i = 0; i < dict.length; i++) {
      if (dict[i].key === key) {
        return dict[i].value
      }
    }
  } catch (e) {
    return null
  }
}

export function useDicts(type: string | string[]): any {
  if (Array.isArray(type)) { // 如果是数组
    type = type.filter(item => item)
  }
  if (!type || type.length === 0) return []

  let dictList = ref<DictData[]>([])

  let dictsMap = reactive<DictMap>({})

  // 未有字典值的数组集合
  const noHasDictArr: string[] = []

  if (!Array.isArray(type)) {
    const storeDict = searchDictByKey(store.getters.dict, type)
    if (storeDict) {
      dictList.value = storeDict
    } else {
      noHasDictArr.push(type)
    }
  } else {
    type.forEach(item => {
      const storeDict = searchDictByKey(store.getters.dict, item)
      if (storeDict) {
        dictsMap[item] = storeDict
      } else {
        noHasDictArr.push(item)
      }
    })
  }


  if (noHasDictArr.length > 0) {
    GetDictByType2(noHasDictArr).then(result => {
      noHasDictArr.forEach(element => {
        const data = result.data[element].map(((item: ResponseResult) => {
          return {
            label: item.dictName,
            value: item.dictCode,
            raw: item
          }
        }))
        store.dispatch('dict/setDict', { key: element, value: data })
        Array.isArray(type) ? dictsMap[element] = data : dictList.value = data
      })
    })
  }
  // 如果传入字符串，返回list，跟之前一样，为了适配之前的代码，传入数组，返回Map
  return Array.isArray(type) ? dictsMap : dictList
}

export async function getDictsAsync (type: string) {
  const storeDict = searchDictByKey(store.getters.dict, type)
  if (storeDict) return storeDict

  const baseList = await GetDictByType(type).then(response => response.data)
  const result = baseList.map((raw: { dictName: string, dictCode: string })=> {
    return {
      label: raw.dictName,
      value: raw.dictCode,
      raw
    }
  })
  store.dispatch('dict/setDict', { key: type, value: result })

  return result
}

/**
 * 分级获取子级字典
 * @param type 字典类型
 * @param parentCode 父级字典值
 */
export async function getDictsLevelData(type: string, parentCode: string,dictLevel: string) {
  const baseList = await GetDictLevelData(type, parentCode,dictLevel).then(response => response.data)
  const result: DictData[] = baseList.map((raw: { dictName: string, dictCode: string })=> {
    return {
      label: raw.dictName,
      value: raw.dictCode,
      raw
    }
  })
  return result
}

/**
 * 获取树形字典
 * @param type 字典类型
 * @returns 返回树形字典，字段内容完全由后端定义，暂时不做重新定义
 */
export function useTreeDicts(type: string) {
  let dictList = ref<DictTreeData[]>([])
  const storeDict = searchDictByKey(store.getters.dict, type)
  if (storeDict) {
    dictList.value = storeDict
  } else {
    GetDictTreeDataNeedChildFlag(type).then(response => {
      const result = response.data?.[0]?.children || []
      store.dispatch('dict/setDict', { key: type, value: result })
      dictList.value = result
    })

  }
  console.log("-------",dictList)
  return dictList
}
