import { scientificCounting } from '@/utils'
import { ComposeOption } from 'echarts/core'
import { PieSeriesOption } from 'echarts/charts'
import { GridComponentOption, TitleComponentOption, TooltipComponentOption, LegendComponentOption } from 'echarts/components'
/**
 *  饼图Option
 */
export type PieOption = ComposeOption<PieSeriesOption | TitleComponentOption | TooltipComponentOption | GridComponentOption | LegendComponentOption>

export interface dataOption {
  /**
   * 颜色，顺序取值
   */
  color?: string[]
  /**
   * legend组件是否显示
   * 不显示的话，饼图位置居中
   * 显示的话
   */
  legendShow?: boolean
  /**
   * 饼图数据
   */
  dataArr: {name: string, value: number}[]
  /**
   *
   */
  radius?: string | number | (string | number)[]
}

export function getOptions(data: dataOption): PieOption {
  return {
    color: data.color,
    title: {},
    legend: {},
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      }
    },
    series: {
      type: 'pie',
      center: !data.legendShow ? ['50%', '50%'] : ['50%', '40%'],
      data: data.dataArr,
      radius: data.radius,
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
