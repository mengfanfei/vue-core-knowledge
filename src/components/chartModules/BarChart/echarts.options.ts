import { ComposeOption } from 'echarts/core'
import { BarSeriesOption, DatasetComponentOption, LineSeriesOption } from 'echarts'
import {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption
} from 'echarts/components'
import { OptionDataItemOriginal, OptionDataValue, OptionSourceData } from 'echarts/types/src/util/types'
import { LineDataItemOption } from 'echarts/types/src/chart/line/LineSeries'

/**
 * 柱状图Option
 */
export type BarOption = ComposeOption<BarSeriesOption | LineSeriesOption | TooltipComponentOption | GridComponentOption | DatasetComponentOption | LegendComponentOption>

export interface BarDataOptions {
  source?: OptionSourceData<OptionDataValue, OptionDataItemOriginal<OptionDataValue>>
  barWidth?: number,
  color?: string[],
  legendShow?: boolean,
  legendPosition?: {
    top?: string | number,
    left?: string | number,
    right?: string | number,
    bottom?: string | number
  },
  legendWidth?: number | string,
  legendHeight?: number | string,
  itemLabel?: boolean,
  gridPosition?: {
    top?: string | number,
    left?: string | number,
    right?: string | number,
    bottom?: string | number
  },
  stack?: string[],
  yAxisName?: string,
  unit?: string,
  lineSource?: LineDataItemOption[]
  lineStyle?: {
    color?: string[],
    unit?: string
  }
}
export function getOptions(data: BarDataOptions): BarOption {


  const getSeries = () => {
    let series: Array<BarSeriesOption|LineSeriesOption> = []
    if (data.source) {
      for (let i = 1; i < data.source.length; i++) {
        series.push({
          type: 'bar',
          seriesLayoutBy: 'row',
          barWidth: data.barWidth,
          barGap: 0.3,
          itemStyle: {
            color: data.color?.[i - 1]
          },
          label: {
            show: data.itemLabel,
            position: 'top'
          },
          stack: data.stack?.[i - 1]
        })
      }
    }
    if (data.lineSource) {
      for (let i = 0; i < data.lineSource.length; i++) {

        series.push({
          type: 'line',
          lineStyle: {
            color: data.lineStyle?.color?.[i - 1]
          },
          data: (data.lineSource as any)[i - 1]
        })
      }
    }
    return series
  }


  return {
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
      trigger: 'axis',
      axisPointer: {  // 坐标轴指示器，坐标轴触发有效
        type: 'shadow',
        label: {
          show: true,
          backgroundColor: 'rgba(0,0,0,0.7)'
        },
      },
      valueFormatter: (value) => `${value}${data.unit || ''}`
    },
    grid: {
      top: data.gridPosition?.top || 60,
      left: data.gridPosition?.left || '5%',
      right: data.gridPosition?.right || '5%',
      bottom: data.gridPosition?.bottom || 24,
      containLabel: true,
    },
    dataset: {
      source: data.source
    },
    xAxis: [
      {
        type: 'category',
        axisLabel: { // 坐标轴刻度标签的相关设置。
          show: true,
          fontSize: 12,
          // padding: [8, 0, 0, 0],
          color: 'rgba(89, 89, 89, 1)' // 刻度标签颜色值
        },
        axisTick: { // 坐标轴刻度相关设置。
          show: true,
          alignWithLabel: true,
          lineStyle: {
            color: 'rgba(217, 217, 217, 1)' // 刻度线颜色值
          }
        },
        axisLine: { // 坐标轴轴线相关设置。
          lineStyle: {
            color: 'rgba(217, 217, 217, 1)' // 轴线的颜色
          }
        }
      },
    ],
    yAxis: [
      {
        type: 'value',
        name:  data.unit ? `${data.yAxisName}(${data.unit})` : data.yAxisName,
        nameTextStyle: { // 坐标轴名称的相关设置。
          color: 'rgba(89, 89, 89, 1)',
          fontSize: 12,
          padding: [0, data.unit ? 12 : 20, 0, 0]
        },
        axisLabel: { // 坐标轴刻度标签的相关设置。
          show: true,
          fontSize: 12,
          color: 'rgba(89, 89, 89, 1)' // 刻度标签颜色值
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#ddd', // 分割线颜色值
            width: 0.5
          }
        },
        alignTicks: true
      },
      {
        show: true,
        position: 'right',
        type: 'value',
        axisLabel: {
          show: true,
          formatter: `{value}${data.lineStyle?.unit || ''}`
        },
        alignTicks: true
      }
    ],
    series: getSeries()
  }
}
