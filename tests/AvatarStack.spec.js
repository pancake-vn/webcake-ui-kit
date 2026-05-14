import { WkAvatarStack } from '../src/index.js'
import { mount } from './_utils.js'

const ITEMS = [
  { name: 'Alice', src: '' },
  { name: 'Bob', src: '' },
  { name: 'Carol', src: '' }
]

describe('WkAvatarStack', () => {
  it('renders ui-avatar-stack root', () => {
    const w = mount(WkAvatarStack, { props: { items: ITEMS } })
    expect(w.classes()).toContain('ui-avatar-stack')
  })

  const sizes = ['regular', 'small']
  sizes.forEach(size => {
    it(`applies size class for "${size}"`, () => {
      const w = mount(WkAvatarStack, { props: { size, items: ITEMS } })
      expect(w.classes()).toContain(`ui-avatar-stack--${size}`)
    })
  })

  it('renders all items when no max is set', () => {
    const w = mount(WkAvatarStack, { props: { items: ITEMS } })
    expect(w.findAll('.ui-avatar').length).toBe(3)
  })

  it('shows overflow avatar when items exceed max', () => {
    const w = mount(WkAvatarStack, { props: { items: ITEMS, max: 2 } })
    expect(w.find('.ui-avatar-stack__overflow').exists()).toBe(true)
  })

  it('shows default +N overflow label', () => {
    const w = mount(WkAvatarStack, { props: { items: ITEMS, max: 2 } })
    expect(w.find('.ui-avatar-stack__overflow').text()).toContain('+1')
  })

  it('uses custom overflowLabel function', () => {
    const w = mount(WkAvatarStack, {
      props: { items: ITEMS, max: 2, overflowLabel: n => `${n} more` }
    })
    expect(w.find('.ui-avatar-stack__overflow').text()).toContain('1 more')
  })

  it('does not show overflow when items count is within max', () => {
    const w = mount(WkAvatarStack, { props: { items: ITEMS, max: 5 } })
    expect(w.find('.ui-avatar-stack__overflow').exists()).toBe(false)
  })

  const animations = ['pulse', 'bounce', 'ring']
  animations.forEach(animation => {
    it(`applies animation class for "${animation}"`, () => {
      const w = mount(WkAvatarStack, { props: { items: ITEMS, animation } })
      expect(w.find(`.ui-avatar-stack__item--animation-${animation}`).exists()).toBe(true)
    })
  })

  it('does not apply animation class when animation="none"', () => {
    const w = mount(WkAvatarStack, { props: { items: ITEMS, animation: 'none' } })
    expect(w.find('[class*="animation"]').exists()).toBe(false)
  })
})
