<script setup lang="ts">
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts/core'
// 引入图表，图标后缀都为Chart
import { BarChart, PieChart, LineChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  TransformComponent,
  DatasetComponent
} from 'echarts/components'
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入canvas渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

import type { EChartsOption } from 'echarts'

// /**
//  *  折线图Option
//  */
// export type LineOption = ComposeOption<LineSeriesOption | TitleComponentOption | TooltipComponentOption | GridComponentOption | DatasetComponentOption>


echarts.use([
  BarChart,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])

import elementResizeDetectorMaker from 'element-resize-detector'
import { debounce } from 'lodash-es'

import { onMounted, ref, shallowRef, watch } from 'vue'

const props = defineProps<{
  options: EChartsOption
}>()

const emit = defineEmits(['click'])

const chartRef = ref<HTMLDivElement>()

const myChart = shallowRef<echarts.ECharts>()

watch(() =>props.options, (options) => {
  if (chartRef.value) {
    myChart.value?.setOption(options)
  }
}, { deep: true })

// 根据窗口的变化自动调整图表大小
const change = () => {
  if (!myChart.value) {
    myChart.value = echarts.init(chartRef.value)
  }
  let erd = elementResizeDetectorMaker()
  erd.listenTo((chartRef.value as HTMLDivElement), debounce(() => {
    myChart.value?.resize()
  }))
  myChart.value?.setOption(props.options || {})
  window.addEventListener('resize', debounce(() => {
    myChart.value?.resize()
  }))

  myChart.value.on('click', (params) => {
    if (params.dataType === 'node') {
      emit('click', params.data)
    }
  })
}

onMounted(() => {
  change()
})
// onBeforeUnmount(() => {
//   myChart.value?.dispose()
// })
</script>

<template>
  <div id="box" ref="chartRef" style="width: 100%; height: 100%;"></div>
</template>

<style scoped>

</style>
