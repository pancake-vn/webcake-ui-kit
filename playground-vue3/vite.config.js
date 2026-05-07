import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'webcake-ui-kit': path.resolve(__dirname, '../src')
    }
  },
  server: {
    port: 8001
  }
})