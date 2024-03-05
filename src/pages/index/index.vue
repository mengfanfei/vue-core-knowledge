<template>
  <div class="flex items-center justify-center h-screen flex-col">
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="@/assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <div>
      <button @click="handleClick('canvas')">canvas</button>
      <button @click="handleClick('charts/echarts')">Echarts</button>
      <button>webGL</button>
      <button>three.js</button>
      <button @click="handleClick('tauri/index')">Tauri</button>
      <button @click="handleClick('bdMap/index')">百度地图</button>
      <button @click="handleClick('socket/chat')">聊天室</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const handleClick = (path: string) => {
    router.push('/' + path)
  }
</script>

<style scoped>
a {
  display: inline-block;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
button + button {
  margin-left: 20px;
}
</style>
