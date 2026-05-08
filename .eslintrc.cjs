module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'prettier'],
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'vue/multi-word-component-names': 'off',
    // "Button" is a deliberate component name in this UI kit.
    'vue/no-reserved-component-names': 'off',
    // The repo's dual-compat slot detection (`$scopedSlots || $slots`) is mandated by
    // CLAUDE.md / vue-dual-component skill — required for Vue 2.6+ v-slot users.
    'vue/no-deprecated-dollar-scopedslots-api': 'off'
  },
  overrides: [
    {
      // Library SFCs and entrypoint must remain pure Options API.
      files: ['src/**/*.vue', 'src/**/*.js'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'vue',
                importNames: [
                  'ref',
                  'reactive',
                  'computed',
                  'watch',
                  'watchEffect',
                  'onMounted',
                  'onBeforeMount',
                  'onUnmounted',
                  'onBeforeUnmount',
                  'onUpdated',
                  'onBeforeUpdate',
                  'defineComponent',
                  'defineAsyncComponent',
                  'defineProps',
                  'defineEmits',
                  'defineExpose',
                  'toRef',
                  'toRefs',
                  'shallowRef',
                  'shallowReactive',
                  'readonly',
                  'inject',
                  'provide'
                ],
                message:
                  'webcake-ui-kit ships pure Options API (Vue 2 + Vue 3 dual-compat). Composition API imports from "vue" are banned in src/.'
              }
            ]
          }
        ],
        'vue/no-v-model-argument': 'error',
        'vue/no-multiple-template-root': 'error'
      }
    },
    {
      files: ['playground-vue2/**/*.{js,vue}'],
      env: { browser: true },
      rules: {}
    },
    {
      files: ['playground-vue3/**/*.{js,vue}', 'storybook-vue3/**/*.{js,vue}'],
      env: { browser: true },
      rules: {}
    },
    {
      files: ['*.cjs', '.eslintrc.cjs', '*.config.js'],
      env: { node: true }
    }
  ]
}
