import { onMounted, shallowRef } from "vue"

interface IPoint {
  lng: number,
  lat: number
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
 */
export function useMap(HTMLID: string, point: IPoint, zoom: number, callback: Function, options: Options = { BMapGLLibFlag: false }) {
  /**
   * BMapGL
   */
  let BMapGL = shallowRef()
  /**
   * 当前地图对象Map
   */

  let bdMap = shallowRef()
  let BMapGLLib = shallowRef()

  /**
   * 加载百度地图api
   * @returns BMapGL
   */
  const loadBMapGL = () => {
    return new Promise((resolve, reject) => {
      if (typeof window.BMapGL !== 'undefined') {
        resolve(window.BMapGL)
        return
      }
      window.onBMapGLCallback = function() {
        resolve(window.BMapGL)
      }
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://api.map.baidu.com/api?type=webgl&v=1.0&ak=uCIMMTpuU6Vf58c4RWzTOFK8YROukeTu&callback=onBMapGLCallback'
      // script.onerror = reject
      document.body.appendChild(script)
    })
  }

  const loadBMapGLLib = () => {
    return new Promise((resolve, reject) => {
      if (typeof (window as any).BMapGLLib !== 'undefined') {
        resolve((window as any).BMapGLLib)
        return
      }
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://mapopen.cdn.bcebos.com/github/BMapGLLib/DrawingManager/src/DrawingManager.min.js'
      script.onload = () => {
        let link = document.createElement('link');
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
