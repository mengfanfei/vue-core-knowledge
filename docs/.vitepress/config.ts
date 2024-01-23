import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/vue-knowledge/',
  title: "前端Meng",
  description: "一个前端工作者的笔记集合",
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      src: '/vitepress-logo-mini.svg',
      width: 24,
      height: 24
    },
    search: {
      provider: 'local',
    },
    nav: [
      {
        text: '基础能力',
        items: [
          { text: 'HTML', link: '/html/intro'},
          { text: 'CSS', link: '/css/intro' },
          { text: 'JavaScript', link: '/javascript/intro' },
          { text: 'TypeScript', link: '/typescript/intro' },
          { text: 'Vue', link: '/vue/intro' },
          // { text: 'Webpack', link: '/webpack/intro' }
        ]
      },
      {
        text: '可视化',
        items: [
          { text: 'Echarts', link: '/Echarts/vue/echarts-basic' },
          { text: '百度地图', link: '/bdMap/intro' },
          { text: '可视化大屏', link: '/visualization/intro' },
          { text: 'webGL+three.js', link: '/webGL/intro' }
        ]
      },
      {
        text: '跨平台',
        items: [
          { text: 'Flutter', link: '/Flutter/flutter-basic' },
          { text: 'uni-app', link: '/uni-app/cli-template-intro' },
          { text: 'electron', link: '/electron/electron-intro' }
        ]
      },
      {
        text: '多媒体',
        items: [
          { text: '音视频', link: '/multimedia/audio-video-intro' },
          { text: 'flv.js', link: '/flvjs/flvjs-intro' },
          { text: 'WebRTC', link: '/webrtc/webrtc-intro'}
        ]
      },
      {
        text: '运维',
        link: ''
      },
      {
        text: '其他',
        items: [
          { text: 'WebAssembly', link: '/WebAssembly/webAssembly-intro' },
          { text: 'Rust', link: '/rust/rust-intro' },
          { text: 'ArkTs', link: '/arkts/arkts-intro'}
        ]
      }
    ],

    sidebar: {
      '/Echarts/': [
        {
          text: 'Echarts + Vue',
          items: [
            { text: 'Echarts 基础', link: '/Echarts/vue/echarts-basic' },
            { text: '封装基础echarts组件', link: '/Echarts/vue/chartType' },
            { text: '封装某一类型的组件(柱状图)', link: '/Echarts/vue/barChart'},
            { text: '封装某一类型的组件(饼图)', link: '/Echarts/vue/pieChart'},
          ]
        },
        {
          text: 'Echarts + uni-app',
          items: [
            { text: 'Echarts在uniapp中的使用', link: '/Echarts/uniapp/echarts-intro' }
          ]
        }
      ],
      '/bdMap/': [
        {
          text: '百度地图',
          items: [
            { text: '百度地图在vue中的使用', link: '/bdMap/intro' },
            { text: '点选地址组件', link: '/bdMap/choicePosition'},
            { text: '常见问题总结', link: '/bdMap/question'}
          ]
        }
      ],
      '/Flutter/': [
        {
          text: 'Flutter',
          items: [
            { text: 'Flutter 基础', link: '/Flutter/flutter-basic' }
          ]
        }
      ],
      '/uni-app/': [
        {
          text: 'uniapp',
          items: [
            { text: 'uniapp模板介绍(cli模式)', link: '/uni-app/cli-template-intro' },
            { text: 'uniapp中使用echarts', link: '/Echarts/uniapp/echarts-intro'}
          ]
        }
      ],
      '/electron/': [
        {
          text: 'electron',
          items: [
            { text: 'electron打包介绍', link: '/electron/electron-intro' }
          ]
        }
      ],
      '/flvjs/': [
        {
          text: 'flv.js',
          items: [
            { text: 'flv.js的简单使用', link: '/flvjs/flvjs-intro' }
          ]
        }
      ]
    },
    outline: {
      label: '页面导航'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mengfanfei/vue-knowledge' }
    ]
  }
})
