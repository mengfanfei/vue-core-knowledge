<template>
  <div
    class="scale-frame"
    :style="viewStyleStr"
  >
    <slot></slot>
  </div>
</template>

<script>
import { debounce } from '@/utils/common'

export default {
  name: 'BaseResizeFrame',
  props: {
    baseWidth: {
      type: Number,
      default: 1920
    },
    baseHeight: {
      type: Number,
      default: 1080
    }
  },

  data () {
    return {
      viewStyleStr: '',
      sacleScope: {
        widthRatio: 1,
        heightRatio: 1,
        screenRatio: 1
      }
    }
  },

  methods: {
    /**
     * resizeHandler
     */
    domResizeHandler () {
      const [baseWidth, baseHeight] = [this.baseWidth, this.baseHeight]
      //
      const { innerHeight, innerWidth } = window

      const heightRatio = innerHeight / baseHeight
      const widthRatio = innerWidth / baseWidth
      const screenRatio = innerWidth / innerHeight

      this.sacleScope = { heightRatio, widthRatio, screenRatio }

      const baseStyleStr = `width: ${baseWidth}px; height: ${baseHeight}px; `
      // 宽度过长，以height为准
      const targetScale = heightRatio <= widthRatio ? heightRatio : widthRatio
      const left = (innerWidth - baseWidth) / 2
      const top = (innerHeight - baseHeight) / 2

      requestAnimationFrame(() => {
        // targetScale *= 1.5 // only for debug, fix 减少会瞎的几率
        this.viewStyleStr = `${baseStyleStr}; transform: scale(${targetScale}); left: ${left}px; top: ${top}px;`
        
        // 进行广播通知
        this.$nextTick(() => this.$cast.baseFrameResize.send())
      })
    },
    
    /**
     * window resize handler
     */
    windowResizeHandler: debounce(function () {
      this.domResizeHandler()
    }, 16.67)
  },

  mounted () {
    // 初始化主动触发
    this.domResizeHandler()
    window.addEventListener('resize', this.windowResizeHandler)
  },

  beforeUnmount () {
    window.removeEventListener('resize', this.windowResizeHandler)
  }
}
</script>

<style lang="less" scoped>
  @bgc: #0d0e14;

  .scale-frame {
    position: absolute;
    // top: 0;
    // left: 0;
    width: 1920px; // 默认样式，会被js替换调
    height: 1080px;

    // left: 50%;
    // top: 50%;
    // transform-origin: 40px 0;

    background-size: 1919px 929px;
    background-repeat: no-repeat;
    background-position: 0 151px;
  }
</style>
