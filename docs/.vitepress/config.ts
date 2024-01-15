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
        text: '可视化',
        items: [
          { text: 'Echarts', link: '/Echarts/vue/echarts-basic' },
          { text: '百度地图', link: '/bdMap/intro' }
        ]
      },
      {
        text: '跨平台',
        items: [
          { text: 'Flutter', link: '/Flutter/flutter-basic' },
          { text: 'uni-app', link: '/uni-app' }
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
            { text: 'Echarts 基础', link: '/Echarts/vue/echarts-basic' }
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
      '/uni-app/': []
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mengfanfei/vue-knowledge' }
    ]
  }
})
