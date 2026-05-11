import { Badge } from '../src/index.js'
import { mount } from './_utils.js'

describe('Badge', () => {
  it('renders label prop', () => {
    const w = mount(Badge, { props: { label: 'New' } })
    expect(w.text()).toContain('New')
    expect(w.classes()).toContain('ui-badge')
  })

  it('renders default slot over label', () => {
    const w = mount(Badge, {
      props: { label: 'fallback' },
      slots: { default: 'slotted' }
    })
    expect(w.text()).toContain('slotted')
    expect(w.text()).not.toContain('fallback')
  })

  const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'info', 'warning']
  variants.forEach(variant => {
    it(`applies variant class for "${variant}"`, () => {
      const w = mount(Badge, { props: { label: 'x', variant } })
      expect(w.classes()).toContain(`ui-badge--${variant}`)
    })
  })

  it('applies roundness class', () => {
    const w = mount(Badge, { props: { label: 'x', roundness: 'round' } })
    expect(w.classes()).toContain('ui-badge--round-round')
  })

  it('renders left and right icon slots', () => {
    const w = mount(Badge, {
      props: { label: 'x' },
      slots: { 'icon-left': '<i class="left-icon"/>', 'icon-right': '<i class="right-icon"/>' }
    })
    expect(w.find('.left-icon').exists()).toBe(true)
    expect(w.find('.right-icon').exists()).toBe(true)
  })
})
