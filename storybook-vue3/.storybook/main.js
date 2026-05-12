module.exports = {
  stories: ['../stories/**/*.stories.js'],

  addons: ['@storybook/addon-essentials', 'storybook-dark-mode'],

  framework: '@storybook/vue3',

  core: {
    builder: 'webpack5'
  },

  // Lets stories `import md from '../../CHANGELOG.md'` and get the raw string.
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source'
    })
    return config
  }
}
