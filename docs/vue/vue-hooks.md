# Vue Hooks

## 1. useEvent
```js
import { onMounted, onBeforeUnmount } from 'vue'
export function useEvent(event, handler, options) {
  // Default to targeting the window
  const {
    target = window
    ...listenerOptions
  } = options

  onMounted(() => {
    target.addEventListener(event, handler, listenerOptions)
  })

  onBeforeUnmount(() => {
    target.removeEventListener(event, handler, listenerOptions)
  })
}
```
```js
useEvent('click', () => {
  console.log('click')
}, {
  target: buttonElement
})
```

## 2. useBannerSetting

Banner图列表hooks

```ts
import { ref, getCurrentInstance } from 'vue'
import { getCarouselAllList } from '@/api/common/banner'

export interface BannerItem {
  id: number,
  imageName: string,
  forwardUrl: string,
  imageUrl: string,
  title?: string,
  subTitle?: string,
  buttonMainName?: string
  buttonMainLink?: string
  [propName: string]: any
}

export function useBannerSetting (carChannel: string, themeBroadcast?: boolean) {
  const { proxy } = getCurrentInstance() as any
  const bannerList = ref<Array<BannerItem>>([])

  getCarouselAllList({ carChannel }).then((response: { data: { records: never[] } }) => {
    bannerList.value = response.data?.records || []

    themeBroadcast && themeChangeHandler(0)
  })

  function themeChangeHandler (index: number) {
    proxy.$cast.bannerColor.broadcast(bannerList.value[index])
  }

  return {
    bannerList,
    themeChangeHandler
  }
}
```

## 3. useCanvas

```ts
import { onMounted, shallowRef } from "vue"

export function useCanvas(CanvasElementID: string, callback?: Function) {
  const canvas = shallowRef<HTMLCanvasElement>()
  const context = shallowRef<CanvasRenderingContext2D>()
  onMounted(() => {
    canvas.value = document.getElementById(CanvasElementID) as HTMLCanvasElement
    context.value = canvas.value.getContext('2d') as CanvasRenderingContext2D
    callback && callback()
  })

  return {
    canvas,
    context
  }
}
```

## 4. useDicts

```ts
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

```

## 5. usePaginationSetting

```ts
import { ref, reactive } from 'vue'

export interface PaginationType {
  pageSize: number,
  pageNo: number
}

interface PaginationParamsType extends PaginationType {
  total: number
}

function getDefaultPagination (): PaginationType {
  return {
    pageSize: 10,
    pageNo: 1
  }
}

export function usePaginationSetting () {
  const pagination = reactive(getDefaultPagination())
  const dataCount = ref(0)
  const queryPending = ref(false)

  function setPaginationInfos ({ pageSize, pageNo, total }: PaginationParamsType) {
    pagination.pageSize = Number(pageSize)
    pagination.pageNo = Number(pageNo)
    dataCount.value = total
  }

  return {
    pagination,
    dataCount,
    queryPending,
    getDefaultPagination,
    setPaginationInfos,
    pageSizes: [10, 20, 50]
  }
}
```

## 6. usePageFunc

```ts
import { AxiosResponse } from 'axios'
import { PaginationType, usePaginationSetting } from './list-page'
import { downloadBlob, getContentDispositionFileName } from '@/utils/file/download'
import { exportDataHooksUse } from '@/api/import-export'
import { ElNotification } from 'element-plus'
import { onMounted, ref } from 'vue'

interface IQueryParams {
  [propsName: string]: any
}

interface ExportProps {
  /**
   * 导出接口，可不传，有默认值
   */
  exportUrl?: (data: any) => Promise<AxiosResponse<any, any>>
  /**
   * 参数
   */
  queryData?: any
}

/**
 * 统一聚合列表页面的一些筛选，搜索，重置等每个页面相同的代码
 * @param queryParams
 * @param callback 获取列表的方法
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function usePageFunc(queryParams: IQueryParams = {}, callback: Function) {
  const { pagination, dataCount, queryPending, setPaginationInfos, getDefaultPagination } = usePaginationSetting()
  /**
   * 默认传入的参数，作用：防止请求参数中有固定的值在重置时删除
   */
  const defaultQueryParams = { ...queryParams }
  /**
   * 时间选择
   */
  const queryCreateDate = ref<string[] | null>([])
  /**
   * 时间选择触发函数
   */
  const changeCreateDate = (value: string[] | null, start: string, end: string) => {
    console.log(value, start, end)
    if (value) {
      queryParams[start] = value[0]
      queryParams[end] = value[1]
    } else {
      queryParams[start] = undefined
      queryParams[end] = undefined
    }
  }
  /**
   * @description 分页切换
   * @param pageNo
  */
  const pageChangeHandler = (pageNo: number) => {
    const _pagination = { ...pagination }
    _pagination.pageNo = pageNo

    const params = getSearchParams(_pagination)
    callback(params)
  }
  /**
   * @description 参数拼接
   * @param p
   */
  const getSearchParams = (p?: PaginationType) => {
    const { pageSize, pageNo } = p || pagination
    const formParams = { ...queryParams }

    return {
      pageSize,
      pageNo,
      ...formParams
    }
  }
  /**
   * @description 查询
  */
  const searchHandler = () => {
    const pagination = getDefaultPagination()
    const params = getSearchParams(pagination)

    callback(params)
  }
  /**
     * @description 重置
    */
  const resetHandler = () => {
    Object.keys(queryParams).forEach(key => (queryParams[key] = defaultQueryParams[key]))
    queryCreateDate.value = []
    searchHandler()
  }
  /**
   * @description 刷新
   */
  const refreshHandler = () => {
    const params = getSearchParams(pagination)
    callback(params)
  }
  /**
   * 多选时存储的数据
   */
  const multipleSelection = ref<any[]>([])
  /**
   * 多选
   */
  const handleSelectionChange = (val: []) => {
    multipleSelection.value = val
  }

  const exportLoading = ref(false)
  const exportTitle = ref('导出')
  /**
   * 导出
   */
  const handleExport = (ExportOptions: ExportProps) => {
    if (exportLoading.value) return
    exportLoading.value = true
    exportTitle.value = '导出中'
    const func = ExportOptions.exportUrl ? ExportOptions.exportUrl : exportDataHooksUse
    func(ExportOptions.queryData).then(res => {
      ElNotification({
        title: '成功',
        message: '导出成功！请查看下载列表',
        type: 'success'
      })
      const fileName = getContentDispositionFileName(res)
      downloadBlob(res.data, fileName)
    }).finally(() => {
      exportLoading.value = false
      exportTitle.value = '导出'
    })
  }
  onMounted(() => {
    searchHandler()
  })

  return {
    queryCreateDate,
    pagination,
    dataCount,
    queryPending,
    pageChangeHandler,
    getSearchParams,
    searchHandler,
    resetHandler,
    getDefaultPagination,
    setPaginationInfos,
    changeCreateDate,
    refreshHandler,
    multipleSelection,
    handleSelectionChange,
    handleExport,
    exportLoading,
    exportTitle
  }
}

```

## 7. usePageFuncGather

```ts
import { AxiosResponse } from 'axios'
import { PaginationType, usePaginationSetting } from './list-page'
import { exportDataHooksUse } from '@/api/import-export'
import { downloadBlob, getContentDispositionFileName } from '@/utils/file/download'
import { ElNotification } from 'element-plus'
import { onMounted, ref } from 'vue'

interface IQueryParams {
  [propsName: string]: any
}

interface ExportProps {
  /**
   * 导出接口，可不传，有默认值
   */
  exportFunc?: (data: any) => Promise<AxiosResponse<any, any>>
  /**
   * 参数
   */
  queryData?: any
}

/**
 * 统一聚合列表页面的一些筛选，搜索，重置等每个页面相同的代码
 * @returns
 * @param GET_LIST_URL
 * @param queryParams
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function usePageFuncGather(GET_LIST_URL: (data: any) => Promise<AxiosResponse<any, any>>, queryParams: IQueryParams = {}) {
  const { pagination, dataCount, queryPending, setPaginationInfos, getDefaultPagination } = usePaginationSetting()
  /**
   * 默认传入的参数，作用：防止请求参数中有固定的值在重置时删除
   */
  const defaultQueryParams = { ...queryParams }
  /**
   * 时间选择
   */
  const queryCreateDate = ref<string[] | null>([])
  /**
   * 时间选择触发函数
   */
  const changeCreateDate = (value: string[] | null, start: string, end: string) => {
    if (value) {
      queryParams[start] = value[0]
      queryParams[end] = value[1]
    } else {
      queryParams[start] = undefined
      queryParams[end] = undefined
    }
  }
  /**
   * table数据
   */
  const tableData = ref([])
  /**
   * 列表数据获取
   */
  const fetchTableData = (params: any) => {
    if (queryPending.value) return

    queryPending.value = true

    GET_LIST_URL(params).then((response: any) => {
      tableData.value = Array.isArray(response.data) ? response.data : Array.isArray(response.data.records) ? response.data.records : Array.isArray(response.data.list) ? response.data.list : []
      const { size: pageSize, total, current: pageNo } = response.data || {}
      setPaginationInfos({pageNo, pageSize, total})
    }).catch((err: any) => console.log(err)).finally(() => {
      queryPending.value = false
    })
  }
  /**
   * @description 分页切换
   * @param pageNo
  */
  const pageChangeHandler = (pageNo: number) => {
    const _pagination = { ...pagination }
    _pagination.pageNo = pageNo

    const params = getSearchParams(_pagination)
    fetchTableData(params)
  }
  /**
   * @description 参数拼接
   * @param p
   */
  const getSearchParams = (p?: PaginationType) => {
    const { pageSize, pageNo } = p || pagination
    const formParams = { ...queryParams }

    return {
      pageSize,
      pageNo,
      ...formParams
    }
  }
  /**
   * @description 查询
  */
  const searchHandler = () => {
    const pagination = getDefaultPagination()
    const params = getSearchParams(pagination)

    fetchTableData(params)
  }
  /**
     * @description 重置
    */
  const resetHandler = () => {
    Object.keys(queryParams).forEach(key => (queryParams[key] = defaultQueryParams[key]))
    queryCreateDate.value = []
    searchHandler()
  }
  /**
   * @description 刷新
   */
  const refreshHandler = () => {
    const params = getSearchParams(pagination)
    fetchTableData(params)
  }

  /**
   * 多选时存储的数据
   */
  const multipleSelection = ref<any[]>([])
  /**
   * 多选
   */
  const handleSelectionChange = (val: []) => {
    multipleSelection.value = val
  }

  const exportLoading = ref(false)
  const exportTitle = ref('导出')
  /**
   * 导出
   */
  const handleExport = (ExportOptions: ExportProps = {}) => {
    if (exportLoading.value) return
    exportLoading.value = true
    exportTitle.value = '导出中'
    const func = ExportOptions.exportFunc ? ExportOptions.exportFunc : exportDataHooksUse
    func(ExportOptions.queryData || queryParams).then(res => {
      ElNotification({
        title: '成功',
        message: '导出成功！请查看下载列表',
        type: 'success'
      })
      const fileName = getContentDispositionFileName(res)
      console.log(fileName)
      downloadBlob(res.data, fileName)
    }).finally(() => {
      exportLoading.value = false
      exportTitle.value = '导出'
    })
  }

  onMounted(() => {
    searchHandler()
  })

  return {
    queryCreateDate,
    pagination,
    dataCount,
    queryPending,
    pageChangeHandler,
    getSearchParams,
    searchHandler,
    resetHandler,
    getDefaultPagination,
    setPaginationInfos,
    changeCreateDate,
    refreshHandler,
    tableData,
    multipleSelection,
    handleSelectionChange,
    handleExport,
    exportLoading,
    exportTitle
  }
}

```

## 8. useMap

```ts
import { onMounted, shallowRef } from 'vue'

export interface IPoint {
  lng: number | string,
  lat: number | string
}
interface Options {
  BMapGLLibFlag: boolean
}
/**
 * 返回地图相关内容
 * @param HTMLID 地图ID
 * @param point 地图中心坐标点（lng: 经度， lat: 纬度）
 * @param zoom 放大比例
 * @param callback 地图绘制完成之后的方法
 * @param options
 */
export function useMap(HTMLID: string, point: IPoint, zoom: number, callback: () => void, options: Options = { BMapGLLibFlag: false }) {
  /**
   * BMapGL
   */
  const BMapGL = shallowRef()
  /**
   * 当前地图对象Map
   */

  const bdMap = shallowRef()
  const BMapGLLib = shallowRef()

  /**
   * 加载百度地图api
   * @returns BMapGL
   */
  const loadBMapGL = () => {
    return new Promise((resolve) => {
      if (typeof (window as any).BMapGL !== 'undefined') {
        resolve((window as any).BMapGL)
        return
      }
      (window as any).onBMapGLCallback = function() {
        resolve((window as any).BMapGL)
      }
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://api.map.baidu.com/api?type=webgl&v=1.0&ak=uCIMMTpuU6Vf58c4RWzTOFK8YROukeTu&callback=onBMapGLCallback'
      // script.onerror = reject
      document.body.appendChild(script)
    })
  }

  const loadBMapGLLib = () => {
    return new Promise((resolve) => {
      if (typeof (window as any).BMapGLLib !== 'undefined') {
        resolve((window as any).BMapGLLib)
        return
      }
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://mapopen.cdn.bcebos.com/github/BMapGLLib/DrawingManager/src/DrawingManager.min.js'
      script.onload = () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://mapopen.cdn.bcebos.com/github/BMapGLLib/DrawingManager/src/DrawingManager.min.css';
        link.onload = () => {
          resolve((window as any).BMapGLLib)
        }
        document.head.appendChild(link);
      }
      document.body.appendChild(script)
    })


  }

  const init = () => {
    bdMap.value = new BMapGL.value.Map(HTMLID)
    const p = new BMapGL.value.Point(point.lng, point.lat)
    bdMap.value.centerAndZoom(p, zoom)
    callback()
  }
  onMounted(async () => {
    BMapGL.value = await loadBMapGL()
    options.BMapGLLibFlag && (BMapGLLib.value = await loadBMapGLLib())
    init()
  })
  return {
    BMapGL,
    loadBMapGL,
    bdMap,
    BMapGLLib
  }
}

```

## 9. useMapFunc

```ts
export function useMapFunc() {
  let dist: any
  const drawAreaOverly = (map: any, BMapGL: any, cityName: any, prokind: any) => {
    map.removeDistrictLayer(dist);
    dist = new BMapGL.DistrictLayer({
      name: '(' + cityName + ')',
      kind: prokind,
      fillColor: "#007BD9",
      strokeWeight: 2,
      strokeColor: '#007BD9',
      fillOpacity: 0.15,
      strokeOpacity: 0.5,
      viewport: true
    });
    map.addDistrictLayer(dist);
  }
  const clearMarkers = (map: any, BMapGL: any) => {
    // 获取所有覆盖物
    const overlayArray = map.getOverlays()
    // 遍历所有覆盖物
    for (let i = 0; i < overlayArray.length; i++) {
      // 判断当前覆盖物是否为标记
      if (overlayArray[i] instanceof BMapGL.Marker) {
        // 如果是标记，就将它从地图中移除
        map.removeOverlay(overlayArray[i]);
      }
    }
  }

  const clearMarkersCircle = (map: any, BMapGL: any) => {
    // 获取所有覆盖物
    const overlayArray = map.getOverlays()
    // 遍历所有覆盖物
    for (let i = 0; i < overlayArray.length; i++) {
      // 判断当前覆盖物是否为标记
      if (overlayArray[i] instanceof BMapGL.Marker || overlayArray[i] instanceof BMapGL.Circle) {
        // 如果是标记，就将它从地图中移除
        map.removeOverlay(overlayArray[i]);
      }
    }
  }

  /**
   * 清除所有覆盖物（marker，circle，infoWindow，自定义dom）
   */
  const clearAllOverlays = (map: any, BMapGL: any, customOverlay: any) => {
    map.clearOverlays()
    // 关闭信息窗口
    map.closeInfoWindow()
    // 移除dom覆盖物
    clearDomOverlay(map, customOverlay)
  }

  const clearOverlaysButLine = (map: any, BMapGL: any, customOverlay: any) => {
    clearMarkersCircle(map, BMapGL)
    // 关闭信息窗口
    map.closeInfoWindow()
    // 移除dom覆盖物
    clearDomOverlay(map, customOverlay)
  }

  const clearDomOverlay = (map: any, customOverlay: any) => {
    // 移除dom覆盖物
    if (customOverlay) {
      map.removeOverlay(customOverlay)
    }
  }

  /**
   * 判断之前是否存在区域覆盖物，就不用重复加了
   * @param map
   * @param BMapGL
   */
  const checkPolygonOverlaysExist = (map: any, BMapGL: any) => {
    const allOverlays = map.getOverlays();
    for (let i = 0; i < allOverlays.length; i++) {
      const overlay = allOverlays[i];

      if (overlay instanceof BMapGL.Polygon) {
        // 如果是多边形覆盖物，执行相应的操作（如打印信息、修改样式等）
        // 或者您可以返回 true，表示已经存在多边形覆盖物
        return true;
      }
    }

    // 或者返回 false，表示不存在多边形覆盖物
    return false;
  }

  // 全屏
  const full = () => {
    const document = window.document as any
    const Element = window.Element as any
    if (!document.fullscreenElement &&
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  return {
    drawAreaOverly,
    clearMarkers,
    clearMarkersCircle,
    clearAllOverlays,
    clearOverlaysButLine,
    clearDomOverlay,
    checkPolygonOverlaysExist,
    full
  }
}

```

## 10. useTreeRegion

```ts
import { GetTreeRegion } from "@/api/common/common"
import { CascaderProps } from "element-plus";
import { reduceDupMunicipality } from '@/utils/municipality'

export interface ITreeRegion {
    children:    ITreeRegion | any;
    childList:    ITreeRegion | any;
    createBy:    string;
    createDate:  string;
    details:     string;
    id:          number;
    latitude:    string;
    longitude:   string;
    parentCode:  string;
    regionCode:  string;
    regionLevel: number;
    regionName:  string;
    regionPath:  string;
    revokeFlag:  number;
    topCode:     string;
    updateBy:    string;
    updateDate:  string;
}
/**
 * 省市区县树hooks
 */
export function useTreeRegion() {
  /**
   * 级联选择器props
   */
  const regionProp: CascaderProps = {
    label: 'regionName',
    value: 'regionCode',
    children: 'children'
  }
  const regionFilterProp: CascaderProps = {
    checkStrictly: true,
    label: 'regionName',
    value: 'regionCode',
    children: 'children'
  }

  /**
   * 区域树
   */
  const treeRegion = ref<ITreeRegion[]>([])
  /**
   * 获取区域树
   */
  const getTreeRegion = () => {
    GetTreeRegion().then(res => {
      treeRegion.value = res.data
      // treeRegion.value = reduceDupMunicipality(res.data)

    })
  }
  
  onMounted(() => {
    getTreeRegion()
  })

  return {
    regionProp,
    regionFilterProp,
    treeRegion,
    getTreeRegion
  }
}
```