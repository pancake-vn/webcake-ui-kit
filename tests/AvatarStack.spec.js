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

  it('renders custom #avatar slot content for each item', () => {
    const Harness = {
      components: { WkAvatarStack },
      data: () => ({ items: ITEMS }),
      template: `
        <WkAvatarStack :items="items">
          <template #avatar="{ avatar }">
            <span class="custom-av">{{ avatar.name }}</span>
          </template>
        </WkAvatarStack>
      `
    }
    const w = mount(Harness)
    const customs = w.findAll('.custom-av')
    expect(customs.length).toBe(3)
    expect(customs[0].text()).toBe('Alice')
    expect(customs[1].text()).toBe('Bob')
  })

  it('passes size to the #avatar slot scope', () => {
    const received = []
    const Harness = {
      components: { WkAvatarStack },
      data: () => ({ items: ITEMS.slice(0, 1), received }),
      template: `
        <WkAvatarStack :items="items" size="small">
          <template #avatar="{ size }">
            <span :class="'sz-' + size">x</span>
          </template>
        </WkAvatarStack>
      `
    }
    const w = mount(Harness)
    expect(w.find('.sz-small').exists()).toBe(true)
  })

  it('assigns descending z-index so first item sits above last', () => {
    const w = mount(WkAvatarStack, { props: { items: ITEMS } })
    const items = w.findAll('.ui-avatar-stack__item')
    const z0 = parseInt(items[0].element.style.zIndex)
    const z2 = parseInt(items[2].element.style.zIndex)
    expect(z0).toBeGreaterThan(z2)
  })

  it('z-index works correctly with more than 4 items', () => {
    const many = Array.from({ length: 8 }, (_, i) => ({ name: `User${i}`, src: '' }))
    const w = mount(WkAvatarStack, { props: { items: many } })
    const items = w.findAll('.ui-avatar-stack__item')
    const z0 = parseInt(items[0].element.style.zIndex)
    const z7 = parseInt(items[7].element.style.zIndex)
    expect(z0).toBeGreaterThan(z7)
    expect(z0 - z7).toBe(7)
  })
})
