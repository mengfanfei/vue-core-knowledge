# 列表页状态留存

## 引言

在pc门户端，我们想要查看列表中的某一条数据，需要点击查看详情，但当我们退回时，页面又重新刷新了，又从头开始，没有定位到之前的数据项，
解决这个问题可以使用`keepAlive`来进行页面的缓存，但是新问题是从我们缓存之后，从非详情页进入就不可以重新刷新数据。
我们想要的效果是：

**1. 从列表页进入详情页，从详情页返回列表页，列表页的页面状态应该保持不变。**
**2. 从非详情页进入列表页刷新页面内容**


所以要想实现上述两点，需要通过`keepAlive`来实现页面缓存，同时需要通过`vue-router`的`beforeRouteLeave`钩子函数、`beforeEnter`钩子函数，`onActivited`钩子函数来进行配合处理。

## 实现

### 1. 路由配置

```js
{
  path: '/list',
  name: 'list',
  component: List,
  meta: {
    title: '列表页',
    keepAlive: true // 1. 需要缓存
  },
  component: () => import('@/views/list/index.vue'),
  // 2. 通过判断进入路由时是不是从详情来的以及详情页是不是有从列表页进入的标志，isFromList为从列表页进入的标志，此标志在列表页路由离开时进行赋值处理
  beforeEnter: (to: any, from: any, next: () => void) => {
    to.meta.isFromDetail = from.name === 'detail' && from.meta.isFromList
    next()
  }
},
{
  path: '/detail',
  name: 'detail',
  component: Detail,
  meta: {
    title: '详情页'
  },
  component: () => import('@/views/detail/index.vue')
}
```

### 2. 列表页


```js
import { onBeforeRouteLeave, useRoute } from 'vue-router'
let scrollTop = ''
onBeforeRouteLeave((to, from, next) => {
  // 3. 判断跳转的页面是否为详细，是的话则储存当前页面的高度
  if (to.name === 'detail') {
    to.meta.isFromList = true
    scrollTop = document.documentElement.scrollTop.toString()
  }
  next()
})

const route = useRoute()
onActivated(()=>{
  if (!route.meta.isFromDetail) {
    ...
    // 不是从详情页进入
    // 在此进行初始化请求操作
  } else {
    // 否则定位到之前的位置
    setTimeout(() => {
      proxy.$cast.scrollTo.broadcast({ x: 0, y: scrollTop, duration: 200 })
    }, 300)
  }
})
```

