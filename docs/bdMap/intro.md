# 百度地图在vue中的使用

## 获取百度地图key

1. 进入百度地图官网，注册账号并登录
2. 进入控制台，创建应用
3. 获取API Key

## 在vue中异步方式引入百度地图

1. 封装百度地图hooks
```ts
import { onMounted, shallowRef } from 'vue'

export interface IPoint {
  lng: number | string,
  lat: number | string
}
interface Options {
  BMapGLLibFlag: boolean
}
/**
 * 返回地图相关内容
 * @param HTMLID 地图ID
 * @param point 地图中心坐标点（lng: 经度， lat: 纬度）
 * @param zoom 放大比例
 * @param callback 地图绘制完成之后的方法
 * @param options
 */
export function useMap(HTMLID: string, point: IPoint, zoom: number, callback: () => void, options: Options = { BMapGLLibFlag: false }) {
  /**
   * BMapGL
   */
  const BMapGL = shallowRef()
  /**
   * 当前地图对象Map
   */

  const bdMap = shallowRef()
  const BMapGLLib = shallowRef()

  /**
   * 加载百度地图api
   * @returns BMapGL
   */
  const loadBMapGL = () => {
    return new Promise((resolve) => {
      if (typeof (window as any).BMapGL !== 'undefined') {
        resolve((window as any).BMapGL)
        return
      }
      (window as any).onBMapGLCallback = function() {
        resolve((window as any).BMapGL)
      }
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://api.map.baidu.com/api?type=webgl&v=1.0&ak=你的百度key&callback=onBMapGLCallback'
      // script.onerror = reject
      document.body.appendChild(script)
    })
  }

  const loadBMapGLLib = () => {
    return new Promise((resolve) => {
      if (typeof (window as any).BMapGLLib !== 'undefined') {
        resolve((window as any).BMapGLLib)
        return
      }
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://mapopen.cdn.bcebos.com/github/BMapGLLib/DrawingManager/src/DrawingManager.min.js'
      script.onload = () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://mapopen.cdn.bcebos.com/github/BMapGLLib/DrawingManager/src/DrawingManager.min.css';
        link.onload = () => {
          resolve((window as any).BMapGLLib)
        }
        document.head.appendChild(link);
      }
      document.body.appendChild(script)
    })


  }

  const init = () => {
    bdMap.value = new BMapGL.value.Map(HTMLID)
    const p = new BMapGL.value.Point(point.lng, point.lat)
    bdMap.value.centerAndZoom(p, zoom)
    callback()
  }
  onMounted(async () => {
    BMapGL.value = await loadBMapGL()
    options.BMapGLLibFlag && (BMapGLLib.value = await loadBMapGLLib())
    init()
  })
  return {
    BMapGL,
    loadBMapGL,
    bdMap,
    BMapGLLib
  }
}

```
## 2. 在页面中使用hooks

