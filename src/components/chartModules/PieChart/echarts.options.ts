import { scientificCounting } from '@/utils'
import { ComposeOption } from 'echarts/core'
import { PieSeriesOption } from 'echarts/charts'
import {
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption
} from 'echarts/components'

/**
 *  饼图Option
 */
export type PieOption = ComposeOption<PieSeriesOption | TitleComponentOption | TooltipComponentOption | GridComponentOption | LegendComponentOption>

export interface DataOption {
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

export function getOptions(data: DataOption): PieOption {

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
      // itemWidth: 8,
      // itemHeight: 8,
      // itemGap: 12
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
