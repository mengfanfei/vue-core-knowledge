import { ref, getCurrentInstance } from 'vue'
import { getCarouselAllList } from '@/api/common/banner'

export interface BannerItem {
  id: number,
  imageName: string,
  forwardUrl: string,
  imageUrl: string,
  title?: string,
  subTitle?: string,
  buttonMainName?: string
  buttonMainLink?: string
  [propName: string]: any
}

export function useBannerSetting (carChannel: string, themeBroadcast?: boolean) {
  const { proxy } = getCurrentInstance() as any
  const bannerList = ref<Array<BannerItem>>([])

  getCarouselAllList({ carChannel }).then((response: { data: { records: never[] } }) => {
    bannerList.value = response.data?.records || []

    themeBroadcast && themeChangeHandler(0)
  })

  function themeChangeHandler (index: number) {
    proxy.$cast.bannerColor.broadcast(bannerList.value[index])
  }

  return {
    bannerList,
    themeChangeHandler
  }
}