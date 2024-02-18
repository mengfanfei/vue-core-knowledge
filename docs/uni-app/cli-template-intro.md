---
outline: [2,3]
---


# uniapp模板介绍（cli模式）


## 前言
平时在使用uniapp开发小程序时通常使用的是HbuilderX工具创建项目，但是不能跟Vue一样用上vscode，webstorm这种神器就感觉手痒（此处狗头），所以我通过***使用cli的方式搭建了一个uniapp项目，并介绍项目结构的组成和各个部分的功能***。可以用来当作模板，提高开发效率。模板地址：
## 一、初始化项目
### 1. 环境安装
全局安装vue-cli
```shell
npm install -g @vue/cli
```
### 2. 创建uniapp项目
- 由于我使用的是vue3，vite，typescript，所以标出与之相同的命令，其他版本可以查阅uniapp官网，[点击直达地址](https://uniapp.dcloud.net.cn/quickstart-cli.html)
```shell
npx degit dcloudio/uni-preset-vue#vite-ts uniapp-template
```
##### 注意
- Vue3/Vite版要求 node 版本`^14.18.0 || >=16.0.0`

至此，一个简单的项目初始化完成，下面将根据自己的需求，想法为项目添加其他依赖

## 二、目录结构

src目录是我们的主要工作目录

- api：存放**接口请求**
- components：存放应用的**公共组件**
- config：存放应用的**公共配置**
- hooks：存放应用的**公共vue3 hook**
- pages：存放应用的**页面组件**
- static：存放应用的**静态资源**
- stores：存放应用的**状态管理**
- styles：存放应用的**公共样式**
- utils: 存放应用的**公共工具类**
- App.vue：应用的主页面
- main.ts：应用的入口文件，初始化应用
- pages.json：页面管理配置文件，包括：页面路由注册、页面参数配置（原生标题栏、下拉刷新...）、首页tabbar等众多功能。类似微信小程序的app.json的**页面管理**部分
- manifest.json：配置应用名称、appid、logo、版本等打包信息
- uni.scss：存放应用的**常用样式变量**
### 1. main.ts
```ts
import { createSSRApp } from "vue"
import * as Pinia from "pinia" // 使用pinia状态管理工具，后面会介绍
import App from "./App.vue"
import StorageUtil from "./utils/storage" // 本地存储工具类，后面介绍
import Tips from "./utils/tips"           // 封装提示类，如loading,成功，失败等，后面介绍
import Broadcast from "./utils/broadcast" // 广播类，就是eventBus相关
import Modal from "./utils/modal"         // 确认弹窗，confirm，后面介绍
export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia()) // 必须
  app.config.globalProperties.$storageUtil = StorageUtil // 全局声明
  app.config.globalProperties.$tips = Tips               // 全局声明
  app.config.globalProperties.$cast = Broadcast          // 全局声明
  app.config.globalProperties.$modal = Modal             // 全局声明
  return {
    app,
    Pinia // 必须返回
  }
}
```

### 2. stores
stores文件夹下存放与状态管理相关的内容，vue3版本下从vuex换成官方更推荐使用的pinia
> 与 Vuex 相比，Pinia 不仅提供了一个更简单的 API，也提供了符合组合式 API 风格的 API，最重要的是，搭配 TypeScript 一起使用时有非常可靠的类型推断支持。

更多优点以及与vuex的对比，请移步[pinia官网](https://pinia.vuejs.org/zh/)，这里不再赘述，看看如何实现一个store吧
```ts
// 文件路径 stores/user.ts
import { defineStore } from 'pinia'
import StorageUtil from '@/utils/storage' // 本地存储
import { ACCESS_TOKEN, COMPANYINFO, USERINFO } from '@/config/storage.config' // 全局一些常量配置
import { Logout, getUserInfo, getCompanyInfo } from '@/api/user' // api接口

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，
// 同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
// 这个名字 ，也被用作 id ，是必须传入的， Pinia 将用它来连接 store 和 devtools。为了养成习惯性的用法，将返回的函数命名为 use...  是一个符合组合式函数风格的约定。

// `defineStore()` 的第二个参数可接受两类值：Setup 函数或 Option 对象。
// 下面这个例子使用Option对象
// pinia没有了mutation，只有state，getters，actions
export const useUserStore = defineStore('user', {
  state: () => ({
    token: StorageUtil.getStorage(ACCESS_TOKEN) || '',
    userInfo: StorageUtil.getStorage(USERINFO) || {},
    companyInfo: StorageUtil.getStorage(COMPANYINFO) || {}
  }),
  getters: {
    /**
     * 登录用户的手机号
     * @return {string}用户登录手机号
     */
    loginUserPhone(state): string {
      const userInfo = state.userInfo || {}
      return userInfo.username || userInfo.mobile
    },
    /**
     * 当前是否已经登录用户
     * @return {Boolean} 是否已经登录
     */
    isUserLogin(state): boolean {
      const { token } = state
      return Boolean(token)
    },
    /**
     * 当前是否是已认证的企业用户
     * @return {Boolean} 是/否 认证过的企业用户
     */
    isCompany(state): boolean {
      return Boolean(state.companyInfo.id || '')
    },
    /**
     * 用户昵称，没有昵称显示手机号
     * @return {String} 显示文本
     */
    userNickName(state): string {
      const { name, mobile } = state.userInfo || {}
      const nickName = name || ''
      const phoneNumber = mobile || ''

      return nickName || phoneNumber || ''
    },
  },
  actions: {
    SET_TOKEN(token: string) {
      this.token = token
      StorageUtil.setStorage(ACCESS_TOKEN, token)
    },
    SET_COMPANY_INFO(obj: any) {
      this.companyInfo = obj
      StorageUtil.setStorage(COMPANYINFO, obj)
    },
    SET_USER_INFO(obj: any) {
      this.userInfo = obj
      StorageUtil.setStorage(USERINFO, obj)
    },
    /**
     * 退出登录
     */
    LogoutSystem() {
      Logout()
      this.ClearUserInfo()
    },
    /**
     * 清空用户信息
     */
    ClearUserInfo() {
      this.SET_TOKEN('')
      this.SET_COMPANY_INFO({})
      this.SET_USER_INFO({})
    },
    /**
     * 登录成功后调用的方法，存储token，获取用户信息
     * @param userInfo 登录成功后返回的信息
     */
    LoginSuccHandlerByInternet (userInfo: any) {
      const { access_token } = userInfo
      this.SET_TOKEN(access_token)
      this.GetUserInfo()
    },
    /**
     * 获取用户信息
    */
    async GetUserInfo() {
      try {
        const result: any = await getUserInfo()
        if (result.code === 200) {
          this.SET_USER_INFO(result.data)
          // this.SET_TOKEN(this.token)
          this.GetCompanyInfo()
        }
        return result
      } catch (error) {
        return error
      }
    },
    /**
     * 获取企业信息
    */
    async GetCompanyInfo() {
      try {
        const result: any = await getCompanyInfo()
        this.SET_COMPANY_INFO(result.data)
        return result
      } catch (error) {
        return error
      }
    }
  }
})
```
如此，就成功声明了一个userStore，接下来看一下如何使用：
```vue
<template>
  <view class="content">
    <view class="text-area">
      <text class="title">{{ userStore.token }}</text> // 直接在template中使用
    </view>
  </view>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
userStore.GetUserInfo() // 调用actions方法

// ❌ 这将不起作用，因为它破坏了响应性 
// 这就和直接解构 `props` 一样
const { token } = userStore

// `token` 是响应式的 ref 
// 同时通过插件添加的属性也会被提取为 ref 
// 并且会跳过所有的 action 或非响应式 (不是 ref 或 reactive) 的属性
// ✅
const { token } = storeToRefs(userSotre) 
// 作为 action 的 GetUserInfo 可以直接解构
const { GetUserInfo } = store
</script>
```
现在一个store的创建和简单使用已经完成了，对于pinia一些其他的方法，`$reset` `$patch`  ...等等，就在业务中尽情的探索吧
### 3. pages
pages文件夹存放一些业务中的页面，每个人的习惯不同，根据自己的习惯喜好来规范就好，给出一个例子：
```
├─pages                 业务页面文件存放的目录
│  └─index
│    └─components
│          └─comp1.vue       index页面自己的组件
│    └─hooks
│       └─useHook.vue       index页面自己的hooks
│    └─index.vue       index页面
│  └─list
│    └─components
│          └─comp1.vue       list页面自己的组件
│    └─hooks
│       └─useHook.vue       list页面自己的hooks
│    └─list.vue        list页面
```
### 4. components
- **组件库（如：uni-ui）**

**安装**
```shell
npm i @dcloudio/uni-ui   或   yarn add @dcloudio/uni-ui   或   pnpm add @dcloudio/uni-ui
```
**配置easycom**

使用 `npm` 安装好 `uni-ui` 之后，需要配置 `easycom` 规则，让 `npm` 安装的组件支持 `easycom`

打开项目根目录下的 `pages.json` 并添加 `easycom` 节点：
```json
// pages.json
{
	"easycom": {
		"autoscan": true,
		"custom": {
			// uni-ui 规则如下配置
			"^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
		}
	},
	
	// 其他内容
	pages:[
		// ...
	]
}
```
注意：uni-ui 现在只推荐使用 `easycom` ，如自己引用组件，可能会出现组件找不到的问题

- **自定义业务组件**
1. 使用符合`easycom`规范的组件无须注册，直接template中使用，规范：`components/组件名称/组件名称.vue`
2. 如果不使用easycom，手动引用和注册vue组件，则需要分3步写如下代码：
>  1.  import导入组件
>  2.  components里注册组件(`<scrpt setup>`方式不需要这一步)
>  3.  template中使用组件

**3. 注意：微信开发者工具经常会出现组件找不到等之类的报错，重启开发者工具或者清缓存可以解决问题**


4. 如何封装组件，详见[vue组件封装](https://uniapp.dcloud.net.cn/tutorial/vue-components.html)

### 5. styles
styles文件夹中存放一些css样式，如全局使用的css或者定义变量

首先安装依赖sass

```js
pnpm add sass
```
比如：定义一些全局css样式
```scss
// 路径：styles/index.scss
// 项目的公共样式

/* 防止图片闪一下 */
image {
  will-change: transform;
}
.flex {
    display: flex;
}
...
```
在App.vue中使用
```scss
<style lang="scss">
  /*每个页面公共css */
  @import 'styles/index.scss';

  /* #ifndef APP-NVUE */
  // 设置整个项目的背景色
  page {
    background-color: #f5f8fb;
  }

  /* #endif */
</style>

```
uni-ui.scss 还提供了一批辅助样式 ，目的是供用户完成快速布局。 需要用户决定是否使用 ，如果使用的话css会增大 `27kb` 左右 使用需在 App.vue `<style lang='scss'>` 中引入
```scss
@import '/node_modules/@dcloudio/uni-ui/lib/uni-scss/index.scss';
```
例：
```html
<view class="uni-primary">主色</view>
<view class="uni-success">成功色</view>
<view class="uni-warning">警告色</view>
<view class="uni-error">错误色</view>
```

如果使用uni-ui组件库并且想修改不同场景下的颜色，想修改组件的默认颜色，需要先安装sass依赖，然后在**uni.scss**文件中重新赋值变量值，官方给的例子：
```scss
/* 需要放到文件最上面 */
@import '/node_modules/@dcloudio/uni-ui/lib/uni-scss/variables.scss';

/**
 * 以下变量是默认值，如不需要修改可以不用给下面的变量重新赋值
 */
// 主色
$uni-primary: #2979ff;
$uni-primary-disable:mix(#fff,$uni-primary,50%);
$uni-primary-light: mix(#fff,$uni-primary,80%);

// 辅助色
// 除了主色外的场景色，需要在不同的场景中使用（例如危险色表示危险的操作）。
$uni-success: #18bc37;
$uni-success-disable:mix(#fff,$uni-success,50%);
$uni-success-light: mix(#fff,$uni-success,80%);

$uni-warning: #f3a73f;
$uni-warning-disable:mix(#fff,$uni-warning,50%);
$uni-warning-light: mix(#fff,$uni-warning,80%);

$uni-error: #e43d33;
$uni-error-disable:mix(#fff,$uni-error,50%);
$uni-error-light: mix(#fff,$uni-error,80%);

$uni-info: #8f939c;
$uni-info-disable:mix(#fff,$uni-info,50%);
$uni-info-light: mix(#fff,$uni-info,80%);

// 中性色
// 中性色用于文本、背景和边框颜色。通过运用不同的中性色，来表现层次结构。
$uni-main-color: #3a3a3a; 			// 主要文字
$uni-base-color: #6a6a6a;			// 常规文字
$uni-secondary-color: #909399;	// 次要文字
$uni-extra-color: #c7c7c7;			// 辅助说明

// 边框颜色
$uni-border-1: #F0F0F0;
$uni-border-2: #EDEDED;
$uni-border-3: #DCDCDC;
$uni-border-4: #B9B9B9;

// 常规色
$uni-black: #000000;
$uni-white: #ffffff;
$uni-transparent: rgba($color: #000000, $alpha: 0);

// 背景色
$uni-bg-color: #f7f7f7;

/* 水平间距 */
$uni-spacing-sm: 8px;
$uni-spacing-base: 15px;
$uni-spacing-lg: 30px;

// 阴影
$uni-shadow-sm:0 0 5px rgba($color: #d8d8d8, $alpha: 0.5);
$uni-shadow-base:0 1px 8px 1px rgba($color: #a5a5a5, $alpha: 0.2);
$uni-shadow-lg:0px 1px 10px 2px rgba($color: #a5a4a4, $alpha: 0.5);

// 蒙版
$uni-mask: rgba($color: #000000, $alpha: 0.4);

```
当前我们也可以在这里定义我们自己需要的变量，并且在使用时不用import此文件

### 6. static
将图片，视频，音频，字体等静态资源存放到static目录下，有了static目录，编译器就会把这个目录整体复制到最终编译包内。这样只要运行时确实能获取到这个图片，就可以显示。

注意事项，如果static里有一些没有使用的废文件，也会被打包到编译包里，造成体积变大。

`css`、`less/scss` 等资源不要放在 `static` 目录下。

**引用资源**

> #### 模板内引入静态资源
> `template`内引入静态资源，如`image`、`video`等标签的`src`属性时，可以使用相对路径或者绝对路径，形式如下
> ```html 
> <!-- 绝对路径，/static指根目录下的static目录，在cli项目中/static指src目录下的static目录 -->
> <image class="logo" src="/static/logo.png"></image>
> <image class="logo" src="@/static/logo.png"></image>
> <!-- 相对路径 -->
> <image class="logo" src="../../static/logo.png"></image>
> ```
> **注意**
> -   `@`开头的绝对路径以及相对路径会经过 base64 转换规则校验
> -   引入的静态资源在非 h5 平台，均不转为 base64。
> -   H5 平台，小于 4kb 的资源会被转换成 base64，其余不转。
> -   自`HBuilderX 2.6.6`起`template`内支持`@`开头路径引入静态资源，旧版本不支持此方式
> -   App 平台自`HBuilderX 2.6.9`起`template`节点中引用静态资源文件时（如：图片），调整查找策略为【基于当前文件的路径搜索】，与其他平台保持一致
> -   支付宝小程序组件内 image 标签不可使用相对路径
>
> **建议**
>
> 直接使用绝对路径 `/static/***.png` `@/static/***.png`
> #### css引入静态资源
> `css`文件或`style标签`内引入`css`文件时（scss、less 文件同理），可以使用相对路径或绝对路径（`HBuilderX 2.6.6`）
> ```css
> /* 绝对路径 */
> @import url('/common/uni.css');
> @import url('@/common/uni.css');
> /* 相对路径 */
> @import url('../../common/uni.css');
> ```
> `css`文件或`style标签`内引用的图片路径可以使用相对路径也可以使用绝对路径，需要注意的是，有些小程序端 css 文件不允许引用本地文件（请看注意事项）。
> ```css
> /* 绝对路径 */
> background-image: url(/static/logo.png);
> background-image: url(@/static/logo.png);
> /* 相对路径 */
> background-image: url(../../static/logo.png);
> ```
> **Tips**
> -   引入字体图标请参考，[字体图标](https://uniapp.dcloud.net.cn/tutorial/syntax-css.html#%E5%AD%97%E4%BD%93%E5%9B%BE%E6%A0%87)
> -   `@`开头的绝对路径以及相对路径会经过 base64 转换规则校验
> -   不支持本地图片的平台，小于 40kb，一定会转 base64。（共四个平台 mp-weixin, mp-qq, mp-toutiao, app v2）
> -   h5 平台，小于 4kb 会转 base64，超出 4kb 时不转。
> -   其余平台不会转 base64
> ### 静态资源引入注意事项
> 通常项目中规定根目录下的 static 为静态资源文件夹（目前暂不支持修改），资源存放此处后，可在任意文件直接使用相对或者绝对路径引用,具体参考上述模板 `css/js/uts` 中引入静态资源的说明。
>
> 而非 `static` 目录的静态资源，不支持直接引用，需要在 `js/uts` 中使用 `import` 来引入，确保路径正确。
>
> 综上所述，我们总结一下静态资源引用的注意事项：
>
> -   在模板或者 `css` 文件使用 `static` 目录中的静态资源，无需特殊处理，可直接通过相对路径或者绝对路径直接引入。
> -   在 `js/uts` 文件使用静态资源，需要使用 `import` 来引入。
> -   不管在任何文件引入非 `static` 目中的静态资源，均需在 `js/uts` 文件使用 `import` 来引入。
>
> **更详细内容请查看[官方文档](https://uniapp.dcloud.net.cn/tutorial/page-static-assets.html)**

### 7. config
config文件夹存放一些全局的配置文件，比如：api前缀配置，app全局配置，storage存储配置等，声明一次就可以不用修改的东西，不同的项目可以改成不同的值。在创建utils类中可以使用到全局定义的配置key

例：
```ts
// config/api.config.ts
/**
 * 平台项目接口前缀
 * @description 根据后端微服务拆分的接口前缀
 * 遵循的规则：${portal}/${route}/${path} -> /portal端/route网关/path接口
 */
export const portalPrefix = '/portal'

export const entPrefix = `${portalPrefix}/ent`
export const bmsPrefix = `${portalPrefix}/bms`
export const userPrefix = `${portalPrefix}/user`
export const basicfrefix = `${portalPrefix}/basic`
export const appealfrefix = `${portalPrefix}/appeal`
export const financefrefix = `${portalPrefix}/finance`
export const contentfrefix = `${portalPrefix}/content`
export const casesfrefix = `${portalPrefix}/cases`
export const servePrefix = `${portalPrefix}/serve`
export const socialPrefix = `${portalPrefix}/social`
export const messagePrefix = `${portalPrefix}/message`
export const policyPrefix = `${portalPrefix}/policy`
export const govPrefix = `${portalPrefix}/gov`
export const screenPrefix = `${portalPrefix}/screen`
export const providerPrefix = `${portalPrefix}/provider`
```
```ts
// config/app.config.ts
class AppConfig {
  static title: string = 'uniappTemplate' // 应用名称
  static clientId = 'test_client' // 客户端id test_client
  static clientSecret = 'test_secret' // 客户端密钥 test_secret
  static storageKey: string = 'uniappTemplate' // 用于存储，存储主键，不同的项目可以更换
  static oauthHeaderAuthKey = 'Authorization' // 接口请求header中要添加字段
}

export default AppConfig
```
```ts
// config/storage.config.ts
import AppConfig from "./app.config"

const { storageKey } = AppConfig

export const ACCESS_TOKEN = `${storageKey}-access-token`
export const USERINFO = `${storageKey}-user-info`
export const COMPANYINFO = `${storageKey}-company-info`
```
### 8. utils
###### 8.1 request.ts
封装request请求，可以全局处理request参数或者response内容，对一些错误代码进行统一处理
```ts
// @ts-ignore
import RequestOptions = UniNamespace.RequestOptions
import StorageUtil from '@/utils/storage'
import { ACCESS_TOKEN, COMPANYINFO, USERINFO } from '@/config/storage.config'
import AppConfig from '@/config/app.config'

const { oauthHeaderAuthKey } = AppConfig


export function getBaseAuthHeader(token: string) {
  const _token = token || StorageUtil.getStorage(ACCESS_TOKEN)
  return `Bearer ${_token}`
}

/**
 *
 * @param config
 * @param {String} customToken 指定token, 否则从storage中取
 */
export function setBaseRequestHeader (config: RequestOptions, customToken: string) {
  if (!config) throw new Error('[setBaseRequestHeader] instance config is required')
  config.header[oauthHeaderAuthKey] = getBaseAuthHeader(customToken)
}

export default {
  common: {
    baseURL: import.meta.env.VITE_BASE_SERVER,
    // #ifdef H5
    // @ts-ignore
    baseURL: import.meta.env.VITE_BASE_URL,
    // #endif
    header: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: {},
    dataType: 'json'
  },
  request(options: RequestOptions) {
    // 组织参数
    options.url = this.common.baseURL + options.url
    options.header = options.header || this.common.header
    options.data = options.data || this.common.data
    options.method = options.method || 'GET'
    options.dataType = options.dataType || this.common.dataType

    const noToken = options.header.noToken || false

    let token = StorageUtil.getStorage(ACCESS_TOKEN)
    // 默认带token
    setBaseRequestHeader(options, token)

    if (noToken) {
      delete options.header[oauthHeaderAuthKey]
    }
    // 请求
    return new Promise((res, rej) => {
      // 请求中...
      uni.request({
        ...options,
        success: (result) => {
          const {
            data,
            statusCode
          } = result
          if (statusCode == 401) {
            StorageUtil.removeStorage(ACCESS_TOKEN)
            StorageUtil.removeStorage(COMPANYINFO)
            StorageUtil.removeStorage(USERINFO)
          }
          if (statusCode == 400 || statusCode == 403) {
            uni.showToast({
              // @ts-ignore
              title: data.errMsg || '请求失败',
              icon: 'none'
            }).then()
          }
          return res(data)
        },
        fail: (error) => {
          uni.showToast({
            // @ts-ignore
            title: error.message || '请求失败',
            icon: 'none'
          }).then()
          return rej(error)
        }
      })
    })
  },
  // get请求
  get(options: RequestOptions) {
    options.method = 'GET'
    return this.request(options)
  },
  // post请求
  post(options: RequestOptions) {
    options.method = 'POST'
    return this.request(options)
  },
  // delete请求
  del(options: RequestOptions) {
    options.method = 'DELETE'
    return this.request(options)
  }
}
```
###### 8.2 modal.ts
modal类，用于弹窗提示，比如：确认弹窗等等
```ts
class Modal {
  static confirm({
    title = '提示',
    content = '这是一个模态弹窗',
    confirmButtonText = '确定',
    cancelButtonText = '取消',
    isShowCancelBtn = true,
  }, okCallback?: () => void, cancelCallback?: () => void): void {
    uni.showModal({
      title,
      content,
      showCancel: isShowCancelBtn,
      confirmText: confirmButtonText,
      confirmColor: '#00468C',
      cancelText: cancelButtonText,
      success: function(res) {
        if (res.confirm) {
          okCallback && okCallback()
        } else if (res.cancel) {
          cancelCallback && cancelCallback()
        }
      }
    })
  }
}

export default Modal
```
###### 8.3 tips.ts
tips类，简单提示, loading，信息提示弹窗等等
```ts

type IconType = "none" | "success" | "loading" | "error" | "fail" | "exception" | undefined

class Tips {
  static isLoad: boolean = false
  static toast(title: string, duration = 1500, mask = false, icon: IconType = 'none') {
   if (!Boolean(title)) {
    return
   }
   // #ifdef APP-PLUS
   plus.nativeUI.toast(title)
   // #endif
   // #ifndef APP-PLUS
   uni.showToast({
    title,
    duration,
    mask,
    icon
   })
   // #endif
  }
  static loading(title: string, mask = true) {
   if (this.isLoad) {
    return
   }
   this.isLoad = true;
   // #ifdef APP-PLUS
   plus.nativeUI.showWaiting(title)
   // #endif
   // #ifndef APP-PLUS
   uni.showLoading({
    title: title,
    mask: mask
   });
   // #endif
  }
  static loaded() {
   if (!this.isLoad) {
    return
   }
   this.isLoad = false
   // #ifdef APP-PLUS
   plus.nativeUI.closeWaiting()
   // #endif
   // #ifndef APP-PLUS
   uni.hideLoading()
   // #endif
  }
}

export default Tips
```
###### 8.4 storage.ts
数据持久化，本地储存类，封装一个方法类，包含存，取，删，以及过期时间
```ts
class StorageUtil {
  constructor() {}
  // 设置存储
  static setStorage(key: string, data: any) {
    const obj = expireSet(key, data)
    uni.setStorageSync(key, obj)
  }
  // 获取存储
  static getStorage(key: string) {
    const data = uni.getStorageSync(key)
    return expireGet(key, data)
  }
  // 删除存储
  static removeStorage(key: string) {
    uni.removeStorageSync(key)
  }
}

// 默认存一周 604800000
function expireSet(key: string, data: any, expire = 604800000){
  return {[key]: data, expire: Date.now() + expire}
}
interface IStorageData {
  expire: number
  [key: string]: any
}
function expireGet(key: string, data: IStorageData){
  let now = Date.now()
  if (data.expire < now) {  // 过期
   StorageUtil.removeStorage(key)
    return null
  } else {
   return data[key] || ''
  }
}

export default StorageUtil
```
###### 8.5 broadcast广播（eventBus）
- eventBus使用`mitt`第三方库，体积小
```ts
// eventBus.ts
import mitt from 'mitt'

const eventBus = mitt()

export default eventBus
```
- 创建`BroadcastEvent`类
```ts
// model.ts
import EventBus from './eventBus'

type handlerFunc = (args: any) => void

class BroadcastEvent {
  register: handlerFunc
  remove: handlerFunc
  send: (args?: any) => void
  broadcast: (args?: any) => void
  constructor (name: string) {
    // 注册handler绑定
    this.register = handler => EventBus.on(name, handler)
    // 关闭cast监听
    this.remove = handler => EventBus.off(name, handler)
    // 发送广播
    this.send = data => EventBus.emit(name, data)
    
    this.broadcast = this.send
  }
}

export default BroadcastEvent
```
- 创建广播集合
```ts
// index.ts
import BroadcastEvent from './model'
import { REQUEST_LOGIN, SCROLL_TO, AUTH_STATE, MODAL_BY_STATE } from './types'

const Broadcast = {
  requestLogin: new BroadcastEvent(REQUEST_LOGIN),
  // scrollTop: new BroadcastEvent(SCROLL_TOP),

  authState: new BroadcastEvent(AUTH_STATE),
  modalByState: new BroadcastEvent(MODAL_BY_STATE),

  scrollTo: new BroadcastEvent(SCROLL_TO)

}

export default Broadcast
```
```ts
// types.ts
/**
 * 广播类型
 */


// 请求登录(登录模态框)
export const REQUEST_LOGIN = 'requestLogin'

export const SCROLL_TO = 'scrollTo'
// 企业认证
export const AUTH_STATE = 'authState'
// 通过状态值展示不同状态下的弹窗
export const MODAL_BY_STATE = 'modalByState'
```
###### 8.6 validate.ts
此文件存放一些项目中用到的积累的校验规则等等, 推荐一个插件：any-rule，在vscode和webstorm中都能搜到，用来查找正则的
```ts
// utils/validate.ts
/**
 * 校验银行卡号 10-30位，覆盖对公/私账户
 * @param accountNumber 银行卡号
 * @returns 
 */
export function validateBankAccount(accountNumber: string): boolean {
  const regex = /^[1-9]\d{9,29}$/
  return regex.test(accountNumber)
}

/**
 * 校验手机号
 * @param phone 手机号
 * @returns 
 */
export function validatePhone(phone: string): boolean {
  const regex = /^(?:(?:+|00)86)?1[3-9]\d{9}$/
  return regex.test(phone)
}

/**
 * 校验座机号
 * @param tel 座机号
 * @returns
 */
export function validateTel(tel: string): boolean {
  const regex = /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/
  return regex.test(tel)
}


/**
 * 校验邮箱
 * @param email 邮箱账号
 * @returns 
 */
export function validateEmail(email: string): boolean {
  const regex = /^(([^<>()[]\.,;:\s@"]+(.[^<>()[]\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/
  return regex.test(email)
}

/**
 * 是否含有小写字母、大写字母、数字、特殊符号的两种及以上
 * @param password 密码
 * @returns 
 */
export function checkPassword(password: string) {
  const reg = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/
  return reg.test(password)
}

/**
 * 校验社会信用代码
 * @param code 信用代码
 * @returns
 */
export function validateCreditCode(code: string): boolean {
  const regex = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/
  return regex.test(code)
}
// ...
```
### 9. hooks
存放hooks
### 10. api
存放api
### 11. env环境变量
通过设置不同的环境变量，实现不同环境的配置，例如：

- 开发环境
.env.development
- 测试环境
.env.test
- 生产环境
.env.production

比如开发环境
```env
NODE_ENV=development
VITE_BASE_SERVER = 'http://localhost:3000'

VITE_BASE_URL = ''

```

然后在package.json中设置
```json
{
  "scripts": {
    "dev:mp-weixin": "uni -p mp-weixin --mode development",
    "build:mp-weixin": "uni build -p mp-weixin --mode production"
  }
}
```
通过不同的命令，启动不同环境下的配置。
### 12. pages.json 和 manifest.json
pages.json 配置页面路由、导航条、选项卡等页面类信息，manifest.json 配置应用的名称、图标、版本等打包类信息。

pages.json
```json
{
	"pages": [
		{
			"path": "pages/index/index",
			"style": {
				"navigationBarTitleText": "uni-app"
			}
		},
		{
			"path": "pages/echarts/echarts",
			"style": {
				"navigationBarTitleText": "echarts"
			}
		}
	],
	"tabBar": {
		"color": "#7A7E83",
		"selectedColor": "#3cc51f",
		"borderStyle": "black",
		"backgroundColor": "#ffffff",
		"list": [{
			"pagePath": "pages/index/index",
			"text": "首页"
		}, {
			"pagePath": "pages/echarts/echarts",
			"text": "图表"
		}]
	},
	"globalStyle": {
		"navigationBarTextStyle": "black",
		"navigationBarTitleText": "uni-app",
		"navigationBarBackgroundColor": "#F8F8F8",
		"backgroundColor": "#F8F8F8"
	},
	"easycom": {
		"autoscan": true,
		"custom": {
			"^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
		}
	}
}
```

manifest.json

```json
{
    "name" : "",
    "appid" : "",
    "description" : "",
    "versionName" : "1.0.0",
    "versionCode" : "100",
    "transformPx" : false,
    "app-plus" : {
        "usingComponents" : true,
        "nvueStyleCompiler" : "uni-app",
        "compilerVersion" : 3,
        "splashscreen" : {
            "alwaysShowBeforeRender" : true,
            "waiting" : true,
            "autoclose" : true,
            "delay" : 0
        },
        "modules" : {},
        "distribute" : {
            "android" : {
                "permissions" : [
                    "<uses-permission android:name=\"android.permission.CHANGE_NETWORK_STATE\"/>",
                    "<uses-permission android:name=\"android.permission.MOUNT_UNMOUNT_FILESYSTEMS\"/>",
                    "<uses-permission android:name=\"android.permission.VIBRATE\"/>",
                    "<uses-permission android:name=\"android.permission.READ_LOGS\"/>",
                    "<uses-permission android:name=\"android.permission.ACCESS_WIFI_STATE\"/>",
                    "<uses-feature android:name=\"android.hardware.camera.autofocus\"/>",
                    "<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\"/>",
                    "<uses-permission android:name=\"android.permission.CAMERA\"/>",
                    "<uses-permission android:name=\"android.permission.GET_ACCOUNTS\"/>",
                    "<uses-permission android:name=\"android.permission.READ_PHONE_STATE\"/>",
                    "<uses-permission android:name=\"android.permission.CHANGE_WIFI_STATE\"/>",
                    "<uses-permission android:name=\"android.permission.WAKE_LOCK\"/>",
                    "<uses-permission android:name=\"android.permission.FLASHLIGHT\"/>",
                    "<uses-feature android:name=\"android.hardware.camera\"/>",
                    "<uses-permission android:name=\"android.permission.WRITE_SETTINGS\"/>"
                ]
            },
            "ios" : {},
            "sdkConfigs" : {}
        }
    },
    "quickapp" : {},
    "mp-weixin" : {
        "appid" : "",
        "setting" : {
            "urlCheck" : false,
            "minified": true
        },
        "usingComponents" : true,
        "lazyCodeLoading": "requiredComponents",
        "optimization": {
          "subPackages": true
        }
    },
    "mp-alipay" : {
        "usingComponents" : true
    },
    "mp-baidu" : {
        "usingComponents" : true
    },
    "mp-toutiao" : {
        "usingComponents" : true
    },
    "uniStatistics": {  
        "enable": false
    },
    "vueVersion" : "3"
}

```
