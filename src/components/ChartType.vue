<script setup lang="ts">
import * as echarts from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'
import { debounce } from 'lodash-es'

import { onMounted, ref, shallowRef, watch } from 'vue'
import { EChartsOption } from 'echarts'

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
