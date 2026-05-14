import { WkEmpty } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkEmpty', () => {
  it('renders ui-empty root', () => {
    const w = mount(WkEmpty)
    expect(w.classes()).toContain('ui-empty')
  })

  const variants = ['default', 'outline', 'background', 'outline-dashed']
  variants.forEach(variant => {
    it(`applies variant class for "${variant}"`, () => {
      const w = mount(WkEmpty, { props: { variant } })
      expect(w.classes()).toContain(`ui-empty--${variant}`)
    })
  })

  it('renders title from prop', () => {
    const w = mount(WkEmpty, { props: { title: 'No results' } })
    expect(w.find('.ui-empty__title').exists()).toBe(true)
    expect(w.find('.ui-empty__title').text()).toContain('No results')
  })

  it('renders description from prop', () => {
    const w = mount(WkEmpty, { props: { description: 'Try again later' } })
    expect(w.find('.ui-empty__description').exists()).toBe(true)
    expect(w.find('.ui-empty__description').text()).toContain('Try again later')
  })

  it('renders title from slot', () => {
    const w = mount(WkEmpty, { slots: { title: '<b class="t">Custom title</b>' } })
    expect(w.find('.ui-empty__title').exists()).toBe(true)
    expect(w.find('.t').exists()).toBe(true)
  })

  it('renders description from slot', () => {
    const w = mount(WkEmpty, { slots: { description: '<span class="d">Custom desc</span>' } })
    expect(w.find('.ui-empty__description').exists()).toBe(true)
    expect(w.find('.d').exists()).toBe(true)
  })

  it('renders media slot', () => {
    const w = mount(WkEmpty, { slots: { media: '<img class="media-img" />' } })
    expect(w.find('.ui-empty__media').exists()).toBe(true)
    expect(w.find('.media-img').exists()).toBe(true)
  })

  it('does not render media section without media slot', () => {
    const w = mount(WkEmpty, { props: { title: 'Empty' } })
    expect(w.find('.ui-empty__media').exists()).toBe(false)
  })

  it('renders footer from default slot', () => {
    const w = mount(WkEmpty, { slots: { default: '<button class="action">Add</button>' } })
    expect(w.find('.ui-empty__footer').exists()).toBe(true)
    expect(w.find('.action').exists()).toBe(true)
  })

  it('does not render footer without default slot', () => {
    const w = mount(WkEmpty, { props: { title: 'Empty' } })
    expect(w.find('.ui-empty__footer').exists()).toBe(false)
  })

  it('does not render text block when neither title nor description is provided', () => {
    const w = mount(WkEmpty)
    expect(w.find('.ui-empty__text').exists()).toBe(false)
  })
})
