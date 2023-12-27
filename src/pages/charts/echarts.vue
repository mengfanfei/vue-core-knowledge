<script setup lang="ts">

import PieChart from '@/components/chartModules/PieChart/PieChart.vue'
import { ref } from 'vue'
import { PieDataOptions } from '@/components/chartModules/PieChart/echarts.options'
import BarChart from '@/components/chartModules/BarChart/BarChart.vue'
import { BarDataOptions } from '@/components/chartModules/BarChart/echarts.options'

const data1 = ref<PieDataOptions>({
  legendShow: true,
  dataArr: [
    { value: 335, name: '直接访问' },
    { value: 310, name: '邮件营销' },
    { value: 234, name: '联盟广告' },
    { value: 135, name: '视频广告' },
    { value: 1548, name: '搜索引擎' },
  ]
})
const data2 = ref<PieDataOptions>({
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
  legendWidth: '40%',
  pieCenter: ['30%', '50%']
})
const data3 = ref<PieDataOptions>({
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
const data4 = ref<BarDataOptions>({
  source: [
    ['项目', '2018', '2019', '2020', '2021'],
    ['项目1', 41.1, 30.4, 65.1, 53.3],
  ],
  barWidth: 12,
})
const data5 = ref<BarDataOptions>({
  legendShow: true,
  source: [
    ['项目', '2018', '2019', '2020', '2021'],
    ['项目1', 41.1, 30.4, 65.1, 53.3],
    ['项目2', 86.5, 92.1, 85.7, 83.1],
  ],
  barWidth: 12,
  color: ['#fac858', '#ee6666'],
  legendPosition: {
    right: '5%',
    top: 16
  }
})
const data6 = ref<BarDataOptions>({
  source: [
    ['项目', '2018', '2019', '2020', '2021'],
    ['项目1', 41.1, 30.4, 65.1, 53.3],
    ['项目2', 86.5, 92.1, 85.7, 83.1],
  ]
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
  <a-divider orientation="left">柱状图</a-divider>
  <a-row>
    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
      <BarChart :data="data4" style="height: 300px; width: 100%;"></BarChart>
    </a-col>
    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
      <BarChart :data="data5" style="height: 300px; width: 100%;"></BarChart>
    </a-col>
    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
      <BarChart :data="data6" style="height: 300px; width: 100%;"></BarChart>
    </a-col>
  </a-row>
</template>

<style scoped>
.ant-col {
  border: 1px solid rgba(0,0,0,0.1);
}
</style>
