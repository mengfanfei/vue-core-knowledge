import { GetTreeRegion } from "@/api/common/common"
import { CascaderProps } from "element-plus";
import { reduceDupMunicipality } from '@/utils/municipality'

export interface ITreeRegion {
    children:    ITreeRegion | any;
    childList:    ITreeRegion | any;
    createBy:    string;
    createDate:  string;
    details:     string;
    id:          number;
    latitude:    string;
    longitude:   string;
    parentCode:  string;
    regionCode:  string;
    regionLevel: number;
    regionName:  string;
    regionPath:  string;
    revokeFlag:  number;
    topCode:     string;
    updateBy:    string;
    updateDate:  string;
}
/**
 * 省市区县树hooks
 */
export function useTreeRegion() {
  /**
   * 级联选择器props
   */
  const regionProp: CascaderProps = {
    label: 'regionName',
    value: 'regionCode',
    children: 'children'
  }
  const regionFilterProp: CascaderProps = {
    checkStrictly: true,
    label: 'regionName',
    value: 'regionCode',
    children: 'children'
  }

  /**
   * 区域树
   */
  const treeRegion = ref<ITreeRegion[]>([])
  /**
   * 获取区域树
   */
  const getTreeRegion = () => {
    GetTreeRegion().then(res => {
      // treeRegion.value = res.data
      treeRegion.value = reduceDupMunicipality(res.data)

    })
  }
  
  onMounted(() => {
    getTreeRegion()
  })

  return {
    regionProp,
    regionFilterProp,
    treeRegion,
    getTreeRegion
  }
}