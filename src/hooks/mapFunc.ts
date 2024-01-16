export function useMapFunc() {
  let dist: any
  const drawAreaOverly = (map: any, BMapGL: any, cityName: any, prokind: any) => {
    map.removeDistrictLayer(dist);
    dist = new BMapGL.DistrictLayer({
      name: '(' + cityName + ')',
      kind: prokind,
      fillColor: "#007BD9",
      strokeWeight: 2,
      strokeColor: '#007BD9',
      fillOpacity: 0.15,
      strokeOpacity: 0.5,
      viewport: true
    });
    map.addDistrictLayer(dist);
  }
  const clearMarkers = (map: any, BMapGL: any) => {
    // 获取所有覆盖物
    const overlayArray = map.getOverlays()
    // 遍历所有覆盖物
    for (let i = 0; i < overlayArray.length; i++) {
      // 判断当前覆盖物是否为标记
      if (overlayArray[i] instanceof BMapGL.Marker) {
        // 如果是标记，就将它从地图中移除
        map.removeOverlay(overlayArray[i]);
      }
    }
  }

  const clearMarkersCircle = (map: any, BMapGL: any) => {
    // 获取所有覆盖物
    const overlayArray = map.getOverlays()
    // 遍历所有覆盖物
    for (let i = 0; i < overlayArray.length; i++) {
      // 判断当前覆盖物是否为标记
      if (overlayArray[i] instanceof BMapGL.Marker || overlayArray[i] instanceof BMapGL.Circle) {
        // 如果是标记，就将它从地图中移除
        map.removeOverlay(overlayArray[i]);
      }
    }
  }

  /**
   * 清除所有覆盖物（marker，circle，infoWindow，自定义dom）
   */
  const clearAllOverlays = (map: any, BMapGL: any, customOverlay: any) => {
    map.clearOverlays()
    // 关闭信息窗口
    map.closeInfoWindow()
    // 移除dom覆盖物
    clearDomOverlay(map, customOverlay)
  }

  const clearOverlaysButLine = (map: any, BMapGL: any, customOverlay: any) => {
    clearMarkersCircle(map, BMapGL)
    // 关闭信息窗口
    map.closeInfoWindow()
    // 移除dom覆盖物
    clearDomOverlay(map, customOverlay)
  }

  const clearDomOverlay = (map: any, customOverlay: any) => {
    // 移除dom覆盖物
    if (customOverlay) {
      map.removeOverlay(customOverlay)
    }
  }

  /**
   * 判断之前是否存在区域覆盖物，就不用重复加了
   * @param map
   * @param BMapGL
   */
  const checkPolygonOverlaysExist = (map: any, BMapGL: any) => {
    const allOverlays = map.getOverlays();
    for (let i = 0; i < allOverlays.length; i++) {
      const overlay = allOverlays[i];

      if (overlay instanceof BMapGL.Polygon) {
        // 如果是多边形覆盖物，执行相应的操作（如打印信息、修改样式等）
        // 或者您可以返回 true，表示已经存在多边形覆盖物
        return true;
      }
    }

    // 或者返回 false，表示不存在多边形覆盖物
    return false;
  }

  // 全屏
  const full = () => {
    const document = window.document as any
    const Element = window.Element as any
    if (!document.fullscreenElement &&
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  return {
    drawAreaOverly,
    clearMarkers,
    clearMarkersCircle,
    clearAllOverlays,
    clearOverlaysButLine,
    clearDomOverlay,
    checkPolygonOverlaysExist,
    full
  }
}
