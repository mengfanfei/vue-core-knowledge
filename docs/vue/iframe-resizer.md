# iframe高度自适应解决方案

使用iframe时，想要让iframe的高度只适应内容高度，使用`iframe-resizer`插件

## 安装

```shell
npm/pnpm/yarn install iframe-resizer
```

## 子页面引用文件

在安装的依赖中将 `iframeResizer.contentWindow.min.js` 文件放在iframe要嵌入的子页面中

## 封装指令

```js
// directives/iframeResize.js
import iframeResize from 'iframe-resizer/js/iframeResizer'

export default {
  beforeMount: (el, { value = {} }) => {
    el.addEventListener('load', () => iframeResize(value, el))
  },
  unmounted: (el) => {
    el.iFrameResizer.removeListeners()
  }
}

// index.js
import iframeResize from './iframeResize'
app.directive('resize', iframeResize)

```

## 页面使用

```vue
<template>
  <div class="iframe-wrapper">
    <iframe
      v-resize="iFrameResizer"
      id="Iframe"
      width="100%"
      :src="url"
      frameborder="0"
      ></iframe>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { jumpOtherSSO } from '@/utils/sso/sso'
  import { openFunc } from '@/utils/util'
  export default {
    name: 'AppCenter',
    data () {
      return {
        iFrameResizer: {
          log: false,
          heightCalculationMethod: 'lowestElement',
          warningTimeout: 0
        },
        ssoUrl: ''
      }
    },
    mounted () {
      if (this.isUserLogin) {
        jumpOtherSSO('appCenter', { page: 1 }).then(res => {
          this.ssoUrl = res.data
        }).catch(() => {
          this.ssoUrl = this.$route.query.url
        })
      }
      window.addEventListener('message', (e) => {
        if (e.data.appId) {
          const routeData = this.$router.resolve({
            name: this.$routerNameMap.appCenterDetails,
            query: {
              url: process.env.VUE_APP_APPCENTER_URL + `/appStoreDetail?id=${e.data.appId}&sourceType=tx`,
              id: e.data.appId
            }
          })
          openFunc(routeData.href)
        }
      })
    },
    computed: {
      ...mapGetters(['isUserLogin']),
      url () {
        return !this.isUserLogin ? this.$route.query.url : this.ssoUrl
      }
    }
  }
</script>

<style lang="scss" scoped>
  .iframe-wrapper {
    width: 100%;
    height: 100%;
    border: 0;
  }
</style>
```