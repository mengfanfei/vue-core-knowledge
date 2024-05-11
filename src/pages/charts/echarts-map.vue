<template>
  <div class="echarts-map">
    <map-chart :data="mapDataOptions" />
  </div>
</template>

<script setup lang="ts">
import MapChart from '@/components/chartModules/MapChart/MapChart.vue'
import { onMounted, reactive } from 'vue'
import { MapDataOptions } from '@/components/chartModules/MapChart/echarts.options'
import ChinaMapJson from '@/assets/mapJson/china.map.json'
const data = [
  {
    "regionType": null,
    "regionCode": "120000",
    "regionName": "天津市",
    "projectTotal": 1134,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "110000",
    "regionName": "北京市",
    "projectTotal": 2046,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "310000",
    "regionName": "上海市",
    "projectTotal": 1448,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "500000",
    "regionName": "重庆市",
    "projectTotal": 1910,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "460000",
    "regionName": "海南省",
    "projectTotal": 107,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "130000",
    "regionName": "河北省",
    "projectTotal": 433,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "220000",
    "regionName": "吉林省",
    "projectTotal": 187,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "140000",
    "regionName": "山西省",
    "projectTotal": 214,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "520000",
    "regionName": "贵州省",
    "projectTotal": 225,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "420000",
    "regionName": "湖北省",
    "projectTotal": 832,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "150000",
    "regionName": "内蒙古自治区",
    "projectTotal": 47,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "350000",
    "regionName": "福建省",
    "projectTotal": 1879,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "540000",
    "regionName": "西藏自治区",
    "projectTotal": 14,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "430000",
    "regionName": "湖南省",
    "projectTotal": 1265,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "810000",
    "regionName": "香港特别行政区",
    "projectTotal": 0,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "330000",
    "regionName": "浙江省",
    "projectTotal": 2316,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "820000",
    "regionName": "澳门特别行政区",
    "projectTotal": 0,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "370000",
    "regionName": "山东省",
    "projectTotal": 2417,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "320000",
    "regionName": "江苏省",
    "projectTotal": 2008,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "360000",
    "regionName": "江西省",
    "projectTotal": 854,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "210000",
    "regionName": "辽宁省",
    "projectTotal": 329,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "630000",
    "regionName": "青海省",
    "projectTotal": 0,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "230000",
    "regionName": "黑龙江省",
    "projectTotal": 88,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "450000",
    "regionName": "广西壮族自治区",
    "projectTotal": 515,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "410000",
    "regionName": "河南省",
    "projectTotal": 643,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "640000",
    "regionName": "宁夏回族自治区",
    "projectTotal": 31,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "340000",
    "regionName": "安徽省",
    "projectTotal": 986,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "610000",
    "regionName": "陕西省",
    "projectTotal": 567,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "650000",
    "regionName": "新疆维吾尔自治区",
    "projectTotal": 83,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "620000",
    "regionName": "甘肃省",
    "projectTotal": 158,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "530000",
    "regionName": "云南省",
    "projectTotal": 322,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "440000",
    "regionName": "广东省",
    "projectTotal": 7614,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "510000",
    "regionName": "四川省",
    "projectTotal": 910,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  },
  {
    "regionType": null,
    "regionCode": "710000",
    "regionName": "台湾省",
    "projectTotal": 0,
    "policyTotal": null,
    "deptTotal": null,
    "regionStatistics": null
  }
]

const mapDataOptions = reactive<MapDataOptions>({
  mapName: 'china',
  seriesName: '政策数量',
  mapJson: ChinaMapJson,
  seriesData: [],
  min: 0,
  max: 3000,
  zoom: 1.2
})

onMounted(() => {
  mapDataOptions.seriesData = data.map(item => {
    return {
      name: item.regionName,
      value: item.projectTotal
    }
  })
})


</script>

<style scoped>
.echarts-map {
  width: 100vw;
  height: 100vh;
}
</style>
