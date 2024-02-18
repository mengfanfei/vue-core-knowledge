import {getEntDetail} from "@/api/product/enterpriseIndustryMap";

import { getIcon } from "./getIcon"
const { getClickIcon, getDefaultIcon } = getIcon()

export function useViewDetail (currentMarkerId: any) {

  const getWindowInfoJSX = (info: any, obj: any) => {
    let titleInfo
    let messageInfo
    messageInfo = `
    <div class="infoWindow">
      <div class="name">${info.name}</div>
      <div style="display: flex;" class="mt-12">
        <div class="flex-title">所属行业：</div>
        <div class="message-info categoryName ${obj.categoryClass}">${info.categoryName}</div>
      </div>
      <div style="display: flex" class="mt-12">
        <div class="flex-title">详细地址：</div>
        <div class="message-info">${info.positionDesc}</div>
      </div>
      <div style="display: flex" class="mt-12">
        <div class="flex-title">附近企业：</div>
        <div class="nearby_btn" :class="{'actived': curRadius == '5'}" onclick='__providerDetailMap.searchNearBy(${JSON.stringify(info)}, "5")'>5公里</div>
        <div class="nearby_btn" onclick='__providerDetailMap.searchNearBy(${JSON.stringify(info)}, "10")'>10公里</div>
      </div>
      ${info.businessScope && info.businessScope !== '' ? `<div style="display: flex" class="mt-12">
        <div class="flex-title">经营范围：</div>
        <div class="message-info">${info.businessScope}</div>
      </div>` : ''}
    </div>
  `
    titleInfo = `
    <div style="display: flex">
    <div class="top_title">企业详情</div>
    <div class="close_btn" onclick='__providerDetailMap.closeInfoWindow()'><img src="${closeImg}" alt="" style="width: 20px; height: 20px"></div>
</div>
  `
    return {
      messageInfo,
      titleInfo
    }
  }

  /**
   * 查看当前企业详情（当前数据和marker都保持高亮）
   * @param id
   */
  const closeImg = require('@/assets/imgs/map/cha.webp')
  const viewDetail = (val: any, map: any, BMapGL: any, pointMap: any, chainRootList: any, legend: any, rightRef: any, leftRef: any) => {
    // 先手动关闭信息窗口，以防自己触发关闭，清空id
    map.closeInfoWindow()

    currentMarkerId.value = val.id
    getEntDetail(val.id).then((res: any) => {
      if (!pointMap.size) return
      // 触发列表选中状态

      let marker = pointMap.get(val.longitude + '_' + val.latitude + '_' + val.id)

      marker?.setIcon(getClickIcon(val.category, chainRootList, BMapGL))
      if (res.code === 200) {
        let info = res.data
        const obj = legend.filter((item: any) => info.category == item.id)[0]
        let point = new BMapGL.Point(Number(info.longitude), Number(info.latitude))
        var opts = {
          width : 432,     // 信息窗口宽度
          height: 210,     // 信息窗口高度
          // maxWidth: 450,
          // maxHeight: 270,
          title: getWindowInfoJSX(info, obj).titleInfo, // 信息窗口标题
          // message:messageInfo
          offset: new BMapGL.Size(-20, -65),
          enableAutoPan: true, // 开启自动平移
          enableCloseOnClick: false // 禁止点击地图关闭信息窗口
        }
        var infoWindow = new BMapGL.InfoWindow(getWindowInfoJSX(info, obj).messageInfo, opts);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow, point);
        // 阻止滚动冒泡
        setTimeout(() => {
          document.getElementsByClassName('infoWindow')[0]?.addEventListener('mousewheel', (event) => {
            event.stopPropagation()
          })
        }, 500)
        if (rightRef) {
          rightRef.fromFather(val.id)
        }
        if (leftRef) {
          leftRef.fromFather(val.id)
        }
        infoWindow.addEventListener('close', function(e: any) {
          currentMarkerId.value = ''
          if (rightRef) {
            rightRef.fromFather('')
          }
          if (leftRef) {
            leftRef.fromFather('')
          }
          // 关闭信息窗口后，icon恢复默认
          marker?.setIcon(getDefaultIcon(info.category, chainRootList, BMapGL))
        });
      }
    })
  }

  return {
    viewDetail
  }
}