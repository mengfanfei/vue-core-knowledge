/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false, // 去掉 tailwindcss 的基础样式设置
  },
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

