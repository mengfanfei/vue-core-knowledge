# 列表页面使用的Hooks

## 代码实现

```ts
/*
 * @Description: 公共分页处理
 * const {pageStatus, listData, setDefaultPagination, getListData} = usePageFun(getSearchPageApp,searchParam)
 * @Param: (api方法,除了分页以外的参数)
 */
import { ref, onMounted } from 'vue'
import {onReachBottom} from "@dcloudio/uni-app"

export interface PaginationType {
  pageNo: number
  pageSize: number
}

export function usePageFun (getListFn: Function,myParams:Object) {
  const pageParams= ref<PaginationType>({
    pageNo: 1,
    pageSize: 10
  })
  const total = ref(0)
  const totalPages = ref(0)
  const pageStatus = ref("more") //more  loading  noMore
  const listData = ref<any[]>([])

  function setDefaultPagination () {
    pageParams.value = {
      pageNo: 1,
      pageSize: 10
    }
  }

  const getListData = async () => {
    const params={
      pageNo: pageParams.value.pageNo,
      pageNum: pageParams.value.pageNo,
      pageSize: pageParams.value.pageSize,
      ...myParams
    }
    pageStatus.value = "loading"

    await getListFn(params).then((res: any) => {
      pageStatus.value = "more"
      if (res.code === 200 && res.data) {
        if(pageParams.value.pageNo==1){
          listData.value=res.data.records
        }else{
          listData.value.push(...res.data.records)
        }
        totalPages.value=res.data.pages
        total.value=res.data.total
        if(pageParams.value.pageNo==totalPages.value){
          pageStatus.value = "noMore"
        }
      }
    })
  }

  onMounted(() => {
    getListData()
  })

  onReachBottom(() => {
    // console.log("上拉加载更多")
    if (pageStatus.value === 'more') {
      if(pageParams.value.pageNo==1||(pageParams.value.pageNo!==1&&pageParams.value.pageNo<totalPages.value)){
        pageParams.value.pageNo++
        getListData()
      }
    }
  })

  return {
    total,
    pageParams,
    pageStatus,
    listData,
    setDefaultPagination,
    getListData
  }
}

```

## 使用

```vue
<template>
  <view>
    <view class="total_info">为您找到<text>{{ total }}</text>个相关信息</view>
    <view class="list_container">
      <!-- 列表 -->
      <list-card class="custom_list_card" v-for="(i, index) in listData" :item="i" :key="index"></list-card>
    </view>
    <view  v-if="listData.length===0" style="margin-top: 80px;">
      <empty />
    </view>
    <uni-load-more v-if="listData.length > 0" :status="pageStatus"></uni-load-more>
  </view>
</template>

<script setup lang="ts">
import ListCard from './components/listCard/listCard.vue'
import { usePageFun } from '../../hooks/pages'
import { searchGlobal } from './api'

const queryParams = reactive({
  searchKey: ''
})

const { pageStatus, listData, total, setDefaultPagination, getListData  } = usePageFun(searchGlobal, queryParams)
</script>

```