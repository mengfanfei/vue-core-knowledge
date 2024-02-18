
import { getIcon } from "./getIcon"

const { getDefaultIcon, getClickIcon, getHoverIcon } = getIcon()

// import { useViewDetail } from "./useViewDetail"
// const { viewDetail } = useViewDetail()

export function useAddMarker (callback: Function) {
  var pointMap: any = new Map()
  const currentHoverMarkerId = ref<number>(0)
  // const currentMarkerId = ref(null)
  const addMarker = (lng: any, lat: any, category: any, id: any, chainRootList: any, currentMarkerId: any, legend: any, rightRef: any, leftRef: any, map: any, BMapGL: any) => {
    let marker:any = ''
    let point = new BMapGL.Point(Number(lng), Number(lat))

    marker = new BMapGL.Marker(point, { icon: getDefaultIcon(category, chainRootList, BMapGL) }) // 创建图像标注
    if (id === currentMarkerId) {
      marker?.setIcon(getClickIcon(category, chainRootList, BMapGL))
    }
    marker.info = {
      id: id,
      longitude: lng,
      latitude: lat,
      category: category
    } // 每个marker的id
   map.addOverlay(marker)
    // 将标注添加到地图
    pointMap.set(lng + '_' + lat + '_' + id, marker)

    marker.addEventListener('mouseover', (e: any) => {
      currentHoverMarkerId.value = e.target.info.id
      if (currentMarkerId !== e.target.info.id) {
        // 只有移出不是选中状态的marker，才会变成默认icon
        marker?.setIcon(getHoverIcon(category, chainRootList, BMapGL))
      }
    })
    marker.addEventListener('mouseout', (e: any) => {
      currentHoverMarkerId.value = 0
      if (currentMarkerId !== e.target.info.id) {
        // 只有移出不是选中状态的marker，才会变成默认icon
        marker?.setIcon(getDefaultIcon(category, chainRootList, BMapGL))
      }
    })
    marker.addEventListener('click', (e: any) => {
      currentMarkerId = e.target.info.id
      marker?.setIcon(getClickIcon(category, chainRootList, BMapGL))
      // viewDetail(e.target.info)
      callback(e.target.info, map, BMapGL, pointMap, chainRootList, legend, rightRef, leftRef)
    })

  }
  return {
    addMarker,
    pointMap,
    currentHoverMarkerId
  }
}