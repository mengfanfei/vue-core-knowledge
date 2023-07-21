import store from '@/store'
import { GetDicByType } from '@/api/base/common'


interface DictsListItem {
  key: string
  value: any
}

interface ResponseResult {
  dictLabel: string
  dictValue: string
  [propsName: string]: any
}

interface DictData {
  value: string,
  label: string,
  raw: ResponseResult
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

export function useDicts(type: string) {
  let dictsList = ref<DictData[]>([])
  const storeDict = searchDictByKey(store.getters.dict, type)
  if (storeDict) {
    dictsList = storeDict
  } else {
    GetDicByType(type).then(result => {
      const data = result.data.map(((item: ResponseResult) => {
        return {
          label: item.dictName,
          value: item.dictCode,
          raw: item
        }
      }))
      store.dispatch('dict/setDict', { key: type, value: data })
      dictsList.value = data
    })
  }

  return dictsList
}
