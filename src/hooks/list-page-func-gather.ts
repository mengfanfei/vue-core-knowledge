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
