import { WkTypography } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkTypography', () => {
  it('renders default variant (paragraph-regular) as a <p>', () => {
    const w = mount(WkTypography, { slots: { default: 'hello' } })
    expect(w.element.tagName).toBe('P')
    expect(w.classes()).toContain('ui-typography')
    expect(w.classes()).toContain('wk-paragraph-regular')
    expect(w.text()).toBe('hello')
  })

  it('falls back to `text` prop when slot is empty', () => {
    const w = mount(WkTypography, { props: { text: 'from prop' } })
    expect(w.text()).toBe('from prop')
  })

  it('prefers the default slot over `text` prop', () => {
    const w = mount(WkTypography, {
      props: { text: 'fallback' },
      slots: { default: 'slotted' }
    })
    expect(w.text()).toBe('slotted')
    expect(w.text()).not.toContain('fallback')
  })

  const variantToTag = {
    'heading-1': 'H1',
    'heading-2': 'H2',
    'heading-3': 'H3',
    'heading-4': 'H4',
    'paragraph-large': 'P',
    'paragraph-regular': 'P',
    'paragraph-small': 'P',
    'paragraph-mini': 'P',
    caption: 'SPAN',
    'caption-mini': 'SPAN',
    monospaced: 'SPAN'
  }

  Object.keys(variantToTag).forEach(variant => {
    it(`renders variant "${variant}" with wk-${variant} class and default tag <${variantToTag[variant].toLowerCase()}>`, () => {
      const w = mount(WkTypography, { props: { variant }, slots: { default: 'x' } })
      expect(w.classes()).toContain(`wk-${variant}`)
      expect(w.element.tagName).toBe(variantToTag[variant])
    })
  })

  it('respects `as` prop to override the rendered tag', () => {
    const w = mount(WkTypography, {
      props: { variant: 'heading-1', as: 'div' },
      slots: { default: 'x' }
    })
    expect(w.element.tagName).toBe('DIV')
    expect(w.classes()).toContain('wk-heading-1')
  })

  const weights = ['regular', 'medium', 'bold']
  weights.forEach(weight => {
    it(`applies wk-weight-${weight} when weight="${weight}"`, () => {
      const w = mount(WkTypography, { props: { weight }, slots: { default: 'x' } })
      expect(w.classes()).toContain(`wk-weight-${weight}`)
    })
  })

  it('does not apply a weight class when weight=""', () => {
    const w = mount(WkTypography, { slots: { default: 'x' } })
    expect(w.classes().some(c => c.startsWith('wk-weight-'))).toBe(false)
  })

  const aligns = ['left', 'center', 'right']
  aligns.forEach(align => {
    it(`applies wk-text-${align} when align="${align}"`, () => {
      const w = mount(WkTypography, { props: { align }, slots: { default: 'x' } })
      expect(w.classes()).toContain(`wk-text-${align}`)
    })
  })

  it('does not apply an align class when align="inherit"', () => {
    const w = mount(WkTypography, { slots: { default: 'x' } })
    expect(w.classes().some(c => c.startsWith('wk-text-'))).toBe(false)
  })

  it('applies inline color style when `color` prop is set', () => {
    const w = mount(WkTypography, { props: { color: 'muted-fg' }, slots: { default: 'x' } })
    // routed through a custom property so jsdom + Vue 2/3 all retain the value
    expect(w.attributes('style') || '').toMatch(/--ui-typography-color:\s*var\(--muted-fg\)/)
  })

  it('omits inline color when `color` is empty', () => {
    const w = mount(WkTypography, { slots: { default: 'x' } })
    const style = w.attributes('style') || ''
    expect(style).not.toMatch(/--ui-typography-color/)
  })
})
