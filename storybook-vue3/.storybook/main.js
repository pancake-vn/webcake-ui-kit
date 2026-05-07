module.exports = {
  stories: ['../stories/**/*.stories.js'],

  addons: ['@storybook/addon-essentials'],

  framework: '@storybook/vue3',

  core: {
    builder: 'webpack5'
  }
}