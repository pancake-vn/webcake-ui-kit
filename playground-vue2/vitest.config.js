import { defineConfig } from 'vitest/config'
import vue2 from '@vitejs/plugin-vue2'
import path from 'path'

export default defineConfig({
  plugins: [vue2()],
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
    setupFiles: [path.resolve(__dirname, '../tests/_setup.js')],
    globals: true
  }
})
