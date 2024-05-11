import { ComposeOption } from 'echarts/core'
import { MapSeriesOption, GeoComponentOption, VisualMapComponentOption } from 'echarts'
import {
  TooltipComponentOption
} from 'echarts/components'


/**
 * 地图option
 */
export type MapOption = ComposeOption<MapSeriesOption | TooltipComponentOption | GeoComponentOption | VisualMapComponentOption>

export interface MapDataOptions {
  mapJson: unknown
  mapName: string
  seriesData: any[],
  seriesName: string,
  nameProperty?: string
  pieces?: any[],
  zoom?: number,
  min?: number,
  max?: number
}

export function getOptions(data: MapDataOptions): MapOption {

  return {
    tooltip: {
      show: true
    },
    visualMap: {
      min: data.min,
      max: data.max,
      calculable: true,
      inRange: {
        color: [
          '#93f2fe',
          '#ace5ff',
          '#42c4ff',
          '#a8cfff',
          '#81b9ff',
          '#4296ff',
          '#0272ff',
          '#064CDD',
        ]
      },
      showLabel: true,
      pieces: data.pieces,
    },
    geo: [{
      map: data.mapName,
      zoom: data.zoom,
      zlevel: 5,
      label: {
        show: true,
        fontSize: '10',
        color: '#fff',
        formatter(params) {
          return '{dot|} ' + params.name
        },
        rich: {
          dot: {
            height: 4,
            width: 4,
            borderRadius: 2,
            backgroundColor: '#ffc441'
          }
        }
      },
      itemStyle: {
        borderWidth: 1,
        borderColor: '#9ff7ff',
        areaColor: '#A8CFFF',
      }
    },
    {
      map: data.mapName,
      zoom: data.zoom,
      zlevel: 4,
      label: {
        show: false
      },
      itemStyle: {
        borderWidth: 1,
        borderColor: 'transparent',
        areaColor: '#A8CFFF',
        shadowColor: '#A8CFFF',
        shadowOffsetX: 6,
        shadowOffsetY: 8,
        shadowBlur: 1
      },
      regions: [
        {
          name: "南海诸岛",
          itemStyle: {
            opacity: 0
          },
          label: {
            show: false // 隐藏文字
          }
        }
      ],
    }],
    series: {
      name: data.seriesName,
      type: 'map',
      map: data.mapName,
      data: data.seriesData,
      geoIndex: 0,
      label: {
        show: true
      }
    },
  }
}
