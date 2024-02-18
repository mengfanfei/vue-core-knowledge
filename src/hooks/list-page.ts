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