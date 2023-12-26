<script setup lang="ts">

import PieChart from '@/components/chartModules/PieChart/PieChart.vue'
import { ref } from 'vue'
import { DataOption } from '@/components/chartModules/PieChart/echarts.options'

const data1 = ref<DataOption>({
  legendShow: true,
  dataArr: [
    { value: 335, name: '直接访问' },
    { value: 310, name: '邮件营销' },
    { value: 234, name: '联盟广告' },
    { value: 135, name: '视频广告' },
    { value: 1548, name: '搜索引擎' },
  ]
})
const data2 = ref<DataOption>({
  legendShow: true,
  centerName: '访问来源',
  centerNamePosition: {
    left: '29%',
    top: '40%',
  },
  sum: 192384678,
  sumPosition: {
    left: '29%',
    top: '50%',
  },
  dataArr: [
    { value: 335, name: '直接访问' },
    { value: 310, name: '邮件营销' },
    { value:  234, name: '联盟广告' },
    { value: 135, name: '视频广告' },
    { value: 1548, name: '搜索引擎' },
  ],
  radius: ['50%', '70%'],
  labelShow: false,
  legendPosition: {
    right: 20,
    top: 'center',
  },
  legendWidth: '50%',
  pieCenter: ['30%', '50%']
})
const data3 = ref<DataOption>({
  legendShow: true,
  dataArr: [
    { value: 335, name: '直接访问' },
    { value: 310, name: '邮件营销' },
    { value: 234, name: '联盟广告' },
    { value: 135, name: '视频广告' },
    { value: 548, name: '搜索引擎' },
  ],
  radius: ['10%', '75%'],
  labelShow: true,
  roseType: 'area',
})
</script>

<template>
  <a-divider orientation="left">饼状图</a-divider>
  <a-row>
    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
      <PieChart :data="data1" style="height: 300px; width: 100%;"></PieChart>
    </a-col>
    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
      <PieChart :data="data2" style="height: 300px; width: 100%;"></PieChart>
    </a-col>
    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
      <PieChart :data="data3" style="height: 300px; width: 100%;"></PieChart>
    </a-col>
  </a-row>
</template>

<style scoped>
.ant-col {
  border: 1px solid rgba(0,0,0,0.1);
}
</style>
