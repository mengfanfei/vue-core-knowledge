# 饼图组件
- 只专注于饼图表
- 文件包括一个vue组件一个options.ts配置文件

## 1. PieChart组件

```vue
<script setup lang="ts">

  import ChartType from '@/components/ChartType.vue'
  import { PieDataOptions, PieOption, getOptions } from '@/components/chartModules/PieChart/echarts.options'
  import { onMounted, ref, watch } from 'vue'

  const props = defineProps<{
    data: PieDataOptions
  }>()

  const options = ref<PieOption>()

  const renderData = () => {
    if (props.data && props.data.dataArr) {
      options.value = getOptions(props.data)
    } else {
      options.value = {}
      console.log('props.data.dataArr is undefined')
    }
  }

  watch(()=> props.data, () => {
    renderData()
  }, { deep: true })

  onMounted(() => {
    renderData()
  })

</script>

<template>
  <div style="width: 100%; height: 100%; position: relative;">
    <ChartType :options="options" />
  </div>
</template>

<style scoped>

</style>

```
## 2. options.ts文件
```ts
import { scientificCounting } from '@/utils'
import { ComposeOption } from 'echarts/core'
import { PieSeriesOption } from 'echarts/charts'
import {
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption
} from 'echarts/components'

/**
 *  饼图Option
 */
export type PieOption = ComposeOption<PieSeriesOption | TitleComponentOption | TooltipComponentOption  | LegendComponentOption>

export interface PieDataOptions {
  centerName?: string,
  unit?: string,
  /**
   * 颜色，顺序取值
   */
  color?: string[]
  /**
   * legend组件是否显示
   * 不显示的话，饼图位置居中
   * 显示的话, 饼图位置请自定义，可不填，默认值: ['50%', '50%']
   */
  legendShow?: boolean
  /**
   * 饼图数据
   */
  dataArr: {name: string, value: number}[]
  /**
   * 饼图的半径
   * number：直接指定外半径值
   * string：例如，'20%'，表示外半径为可视区尺寸（容器高宽中较小一项）的 20% 长度。
   * Array.<number|string>：数组的第一项是内半径，第二项是外半径。每一项遵从上述 number string 的描述。
   */
  radius?: string | number | (string | number)[]
  /**
   * 饼图的原点，即配置中的series.center
   */
  pieCenter?: string | number | (string | number)[],
  /**
   * 南丁格尔玫瑰图
   */
  roseType?: 'radius' | 'area',
  /**
   * 饼图的文本标签是否展示
   */
  labelShow?: boolean,
  legendPosition?: {
    top?: string | number,
    left?: string | number,
    right?: string | number,
    bottom?: string | number
  },
  legendWidth?: number | string,
  legendHeight?: number | string,
  centerNamePosition?: {
    left?: string | number,
    top?: string | number,
  },
  sum?: number,
  showSum?: boolean,
  sumPosition?: {
    left?: string | number,
    top?: string | number,
  }
}

export function getOptions(data: PieDataOptions): PieOption {

  const getSum = () => {
    return data.dataArr.reduce((pre, cur) => pre + cur.value, 0).toString()
  }
  return {
    color: data.color,
    title: [
      {
        text: data.centerName ? `${data.centerName}${data.unit ? `(${data.unit})` : ''}` : '',
        textAlign: 'center',
        left: data.centerNamePosition?.left || 'center',
        top: data.centerNamePosition?.top || 'center',
        textStyle: {
          color: 'rgba(0, 0, 0, 1)',
          fontSize: 12,
          fontWeight: 'normal',
        }
      },
      {
        text: data.sum ? scientificCounting(data.sum) : data.showSum ? getSum() : '',
        textAlign: 'center',
        left: data.sumPosition?.left || 'center',
        top: data.sumPosition?.top || 'center',
        textStyle: {
          color: 'rgba(18, 18, 18, 1)',
          fontSize: 22,
          fontWeight: 600,
        }
      }
    ],
    legend: {
      show: data.legendShow,
      top: data.legendPosition?.top,
      left: data.legendPosition?.right ? undefined : data.legendPosition?.left || 'center',
      right: data.legendPosition?.right,
      bottom: data.legendPosition?.bottom,
      width: data.legendWidth || 'auto',
      height: data.legendHeight || 'auto',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 12,
      borderWidth: 0,
      itemStyle: {
        borderWidth: 0
      }
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      }
    },
    series: {
      type: 'pie',
      center: !data.legendShow ? ['50%', '50%'] : (data.pieCenter || ['50%', '50%']),
      data: data.dataArr,
      radius: data.radius || [0, '50%'],
      roseType: data.roseType,
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 0.5,
        // borderRadius: 5
      },
      label: {
        show: data.labelShow !== false,
        alignTo: 'none',
      },
      // labelLine: {
      //   length: 5,
      // },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  }
}

```
## 3. 实现思路
1. 在`onMounted`钩子中，初始化`options`的值。
2. 在`watchEffect`中，监听`props.data`的变化，当数据发生变化时，重新计算`options`的值。
3. 使用`ChartType`组件，传入options，实现图表的展示。

## 4. 使用方式

[//]: # (![饼图]&#40;../../assets/imgs/pieChartImg.png&#41;)
```vue
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

<script setup lang="ts">
  import PieChart from '@/components/chartModules/PieChart/PieChart.vue'
  import { ref } from 'vue'
  import { PieDataOptions } from '@/components/chartModules/PieChart/echarts.options'

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
</script>
```

- 改变data内容，图表将自动刷新
- 注意：图表的高度必须指定

## 5. 配置项

[//]: # ()
[//]: # (| 参数名                | 类型                                                                                                                      | 默认值                          | 描述                                                                                                                                             |)

[//]: # (|--------------------|-------------------------------------------------------------------------------------------------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|)

[//]: # (| dataArr            | \{name: string, value: number\}\[\]                                                                                     | -                            | 饼图数据                                                                                                                                           |)

[//]: # (| radius             | string &#124; number &#124; \&#40;string &#124; number\&#41;\[\]                                                                | \[0, '50%'\]                 | 饼图的半径，number：直接指定外半径值string：例如，'20%'，表示外半径为可视区尺寸（容器高宽中较小一项）的 20% 长度。Array.<number &#124; string>：数组的第一项是内半径，第二项是外半径。每一项遵从上述 number string 的描述。 |)

[//]: # (| labelShow          | boolean                                                                                                                 | undefined                    | 是否显示标签 ,默认展示，不展示请传false                                                                                                                        |)

[//]: # (| centerName         | string                                                                                                                  | -                            | 中心文字，默认不显示                                                                                                                                     |)

[//]: # (| centerNamePosition | \{left: string &#124; number,top: string &#124; number\}                                                                | left: 'center, top: 'center' | 中心文字的位置                                                                                                                                        |)

[//]: # (| unit               | string                                                                                                                  | -                            | 中心文字的单位，默认不显示                                                                                                                                  |)

[//]: # (| color              | string\[\]                                                                                                              | -                            | 饼图颜色，默认使用 theme 中的颜色                                                                                                                           |)

[//]: # (| legendShow         | boolean                                                                                                                 | true                         | 是否显示图例                                                                                                                                         |)

[//]: # (| legendPosition     | \{top?: string &#124; number,left?: string &#124; number, right?: string &#124; number, bottom?: string &#124; number\} | -                            | 图例位置, 有right时left不生效                                                                                                                           |)

[//]: # (| legendWidth        | number &#124; string                                                                                                    | -                            | 图例宽度                                                                                                                                           |)

[//]: # (| legendHeight       | number &#124; string                                                                                                    | -                            | 图例高度                                                                                                                                           |)

[//]: # (| pieCenter          | string &#124; number &#124; \&#40;string &#124; number\&#41;\[\]                                                                | \['50%', '50%'\]             | 饼图的原点，即配置中的series.center                                                                                                                       |)

[//]: # (| roseType           | 'radius' &#124; 'area'                                                                                                  | -                            | 是否展示成南丁格尔图                                                                                                                                     |)

[//]: # (| sum                | number                                                                                                                  | -                            | 数据总数                                                                                                                                           |)

[//]: # (| showSum            | boolean                                                                                                                 | false                        | 是否显示总数                                                                                                                                         |)

[//]: # (| sumPosition        | \{left: string &#124; number,top: string &#124; number\}                                                                | 'start'                      | 总数显示位置                                                                                                                                         |)
