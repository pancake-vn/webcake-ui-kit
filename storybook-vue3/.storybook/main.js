const path = require('path')

module.exports = {
  stories: ['../stories/**/*.stories.js'],

  addons: ['@storybook/addon-essentials'],

  framework: '@storybook/vue3',

  core: {
    builder: 'storybook-builder-vite'
  },

  viteFinal: async (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),

      '@kit': path.resolve(__dirname, '../../src')
    }

    return config
  }
}