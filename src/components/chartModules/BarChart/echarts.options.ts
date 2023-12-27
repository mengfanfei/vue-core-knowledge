import { ComposeOption } from 'echarts/core'
import { BarSeriesOption, DatasetComponentOption } from 'echarts'
import {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption
} from 'echarts/components'
import { OptionDataItemOriginal, OptionDataValue, OptionSourceData } from 'echarts/types/src/util/types'

/**
 * 柱状图Option
 */
export type BarOption = ComposeOption<BarSeriesOption | TooltipComponentOption | GridComponentOption | DatasetComponentOption | LegendComponentOption>

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
  }
}
export function getOptions(data: BarDataOptions): BarOption {


  const getSeries = () => {
    let series: BarSeriesOption[] = []
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
          }
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
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
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
        axisLabel: {
          show: true,
          fontSize: 12,
          padding: [8, 0, 0, 0],
          color: 'rgba(89, 89, 89, 1)'
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          // lineStyle: {
          //   color: 'rgba(217, 217, 217, 1)'
          // }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(217, 217, 217, 1)'
          }
        }
      },
    ],
    yAxis: [
      {

      }
    ],
    series: getSeries()
  }
}
