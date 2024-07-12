import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
server: {
    host: '0.0.0.0',
    port: 5173,
    // 是否开启 https
    https: false,
    proxy: {  // 注意：proxy 应该是 server 的一个属性
      '/city': {
        target: 'http://localhost:8081/',
        changeOrigin: true,
      }
    }

  }
})
