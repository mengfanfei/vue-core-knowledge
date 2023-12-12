<script setup lang="ts">
import * as echarts from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'
import { debounce } from 'lodash-es'
import { ref } from 'vue'

const chart = ref<echarts.ECharts>()
const chartRef = ref<HTMLDivElement>()

</script>

<template>
  <div id="box" ref="chart" style="width: 100%; height: 100%;"></div>
</template>

<style scoped>

</style>
