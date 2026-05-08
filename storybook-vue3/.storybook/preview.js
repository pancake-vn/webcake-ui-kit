import '../../src/styles/index.css'

import { addons } from '@storybook/addons'
import { DOCS_RENDERED } from '@storybook/core-events'
import { themes } from '@storybook/theming'
import { light, dark } from './theme'

const channel = addons.getChannel()

const applyDark = isDark => {
  const targets = [document.documentElement, document.body]
  targets.forEach(el => {
    if (!el) return
    el.classList.toggle('dark', isDark)
    el.style.background = isDark ? '#1c2128' : '#ffffff'
    el.style.colorScheme = isDark ? 'dark' : 'light'
  })
}

channel.on('DARK_MODE', applyDark)
channel.on(DOCS_RENDERED, () => {
  channel.emit('DARK_MODE_REQUEST')
})

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },

  layout: 'centered',

  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    },
    expanded: true
  },

  options: {
    storySort: {
      order: ['Introduction', 'Foundations', 'Components', ['Button', 'Badge', '*'], '*']
    }
  },

  darkMode: {
    current: 'light',
    light: { ...themes.normal, ...light },
    dark: { ...themes.dark, ...dark },
    stylePreview: true,
    classTarget: 'html',
    darkClass: 'dark',
    lightClass: 'light'
  },

  docs: {
    source: { state: 'open' }
  }
}
