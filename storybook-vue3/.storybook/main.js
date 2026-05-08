module.exports = {
  stories: ['../stories/**/*.stories.js'],

  addons: ['@storybook/addon-essentials', 'storybook-dark-mode'],

  framework: '@storybook/vue3',

  core: {
    builder: 'webpack5'
  }
}
