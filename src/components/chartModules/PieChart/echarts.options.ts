import { scientificCounting } from '@/utils'
import { ComposeOption } from 'echarts/core'
import { PieSeriesOption } from 'echarts/charts'
import { GridComponentOption, TitleComponentOption, TooltipComponentOption, LegendComponentOption } from 'echarts/components'
/**
 *  饼图Option
 */
export type PieOption = ComposeOption<PieSeriesOption | TitleComponentOption | TooltipComponentOption | GridComponentOption | LegendComponentOption>

export interface DataOption {
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
  roseType?: 'radius' | 'area',
  labelShow?: boolean,
}

export function getOptions(data: DataOption): PieOption {
  return {
    color: data.color,
    title: {},
    legend: {
      show: data.legendShow,
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
        show: data.labelShow !== false
      },
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
