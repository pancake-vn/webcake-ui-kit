import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'webcake-ui-kit': path.resolve(__dirname, '../src'),
      '@vue/test-utils': path.resolve(__dirname, 'node_modules/@vue/test-utils'),
      vue: path.resolve(__dirname, 'node_modules/vue')
    },
    dedupe: ['vue']
  },
  server: {
    fs: { allow: [path.resolve(__dirname, '..')] }
  },
  test: {
    environment: 'jsdom',
    include: [path.resolve(__dirname, '../tests/**/*.spec.js')],
    globals: true
  }
})
