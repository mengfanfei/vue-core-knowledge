import { PaginationType, usePaginationSetting } from './list-page'
import { onMounted, ref } from 'vue'

interface IQueryParams {
  [propsName: string]: any
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
    refreshHandler
  }
}
