import { createApp } from 'vue'
import router from "@/router"
import 'virtual:uno.css'
// 样式重置
import '@unocss/reset/normalize.css'
import './style.css'
import App from './App.vue'

createApp(App).use(router).mount('#app')
