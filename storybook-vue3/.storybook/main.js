module.exports = {
  stories: ['../stories/**/*.stories.js'],

  addons: ['@storybook/addon-essentials', 'storybook-dark-mode'],

  framework: '@storybook/vue3',

  staticDirs: ['../public'],

  core: {
    builder: 'webpack5'
  },

  // Lets stories `import md from '../../CHANGELOG.md'` and get the raw string.
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source'
    })
    // webpack 5 treats packages with "exports" as fully-specified ESM and
    // refuses bare specifiers like 'dayjs/plugin/customParseFormat'. This
    // rule opts out of that enforcement for .mjs/.js files.
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: { fullySpecified: false }
    })
    return config
  }
}
