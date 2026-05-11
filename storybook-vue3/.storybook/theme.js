import { create } from '@storybook/theming'
import logoLight from './logo-light.svg'
import logoDark from './logo-dark.svg'

const shared = {
  brandTitle: 'Webcake UI',
  brandUrl: 'https://github.com/pancake-vn/webcake-ui-kit',
  brandTarget: '_blank',

  colorPrimary: '#1DB954',
  colorSecondary: '#13823B',

  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, monospace',

  appBorderRadius: 8,
  inputBorderRadius: 6
}

export const light = create({
  base: 'light',
  ...shared,
  brandImage: logoLight,

  appBg: '#f7f8f8',
  appContentBg: '#ffffff',
  appBorderColor: '#e5e7eb',

  textColor: '#111827',
  textInverseColor: '#ffffff',
  textMutedColor: '#6b7280',

  barTextColor: '#6b7280',
  barSelectedColor: '#13823B',
  barBg: '#ffffff',

  inputBg: '#ffffff',
  inputBorder: '#d1d5db',
  inputTextColor: '#111827'
})

export const dark = create({
  base: 'dark',
  ...shared,
  brandImage: logoDark,

  colorPrimary: '#48E07D',
  colorSecondary: '#1DB954',

  appBg: '#161b22',
  appContentBg: '#1c2128',
  appBorderColor: '#30363d',

  textColor: '#e6edf3',
  textInverseColor: '#0d1117',
  textMutedColor: '#8b949e',

  barTextColor: '#8b949e',
  barSelectedColor: '#84F1AA',
  barBg: '#1c2128',

  inputBg: '#0d1117',
  inputBorder: '#30363d',
  inputTextColor: '#e6edf3'
})

export default light
