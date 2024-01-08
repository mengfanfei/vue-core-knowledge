# 封装基础echarts组件--chartType.vue

## 1. 使用按需引入的方式引入echarts
优点：
  - 可以根据需要引入特定的echarts组件，减少打包体积
  - 便于维护和管理

缺点：
  - 需要手动引入每个需要的组件，如果组件不满足的话需要更新此组件代码，比如使用柱状图和折线图，就需要引入`BarChart`和`LineChart`，以及提示框`TooltipComponent`，标题`TitleComponent`等组件
```vue
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

```
## 2. 全量引入echarts
优点：
 - 使用简单 `import * as echarts from 'echarts'`

缺点：
 - 体积大，如果只用到了部分功能，会造成资源浪费

```vue
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

```

## 3. 实现思路

1. 监听`props.options`的变化，通过`watch`来监听变化，然后通过`setOption`来更新图表的配置。
2. 在`mounted`生命周期中调用`change`函数来初始化图表和监听窗口大小变化的事件。
3. 监听窗口大小变化，通过`elementResizeDetectorMaker`来获取窗口大小变化的事件，然后通过`debounce`来防抖处理。
4. 监听`click`事件，通过`on`来监听事件，然后通过`emit`来触发父组件的事件。

## 4. 使用方式
1. 在基础组件之上再封装一个组件，专注某一类型的图表
    - 请看 [封装某一类型的组件](/Echarts/vue/BarChart.md)
2. 直接使用chartType组件，更新options即可
