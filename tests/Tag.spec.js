import { Tag } from '../src/index.js'
import { mount } from './_utils.js'

describe('Tag', () => {
  it('renders label text', () => {
    const w = mount(Tag, { props: { label: 'Draft' } })
    expect(w.text()).toContain('Draft')
  })

  it('renders default slot over label prop', () => {
    const w = mount(Tag, { props: { label: 'ignored' }, slots: { default: 'Custom' } })
    expect(w.text()).toContain('Custom')
  })

  it('applies type class', () => {
    const outline = mount(Tag, { props: { type: 'outline' } })
    expect(outline.classes()).toContain('ui-tag--type-outline')

    const def = mount(Tag, { props: { type: 'default' } })
    expect(def.classes()).toContain('ui-tag--type-default')
  })

  it('applies size class', () => {
    for (const size of ['sm', 'md', 'lg']) {
      const w = mount(Tag, { props: { size } })
      expect(w.classes()).toContain(`ui-tag--${size}`)
    }
  })

  it('renders counter when > 0', () => {
    const w = mount(Tag, { props: { counter: 5 } })
    expect(w.find('.ui-tag__counter').exists()).toBe(true)
    expect(w.find('.ui-tag__counter').text()).toBe('5')
  })

  it('does not render counter when 0', () => {
    const w = mount(Tag, { props: { counter: 0 } })
    expect(w.find('.ui-tag__counter').exists()).toBe(false)
  })

  it('renders close button when closable', () => {
    const w = mount(Tag, { props: { closable: true } })
    expect(w.find('.ui-tag__close').exists()).toBe(true)
  })

  it('emits close when close button clicked', async () => {
    const w = mount(Tag, { props: { closable: true } })
    await w.find('.ui-tag__close').trigger('click')
    expect(w.emitted('close')).toBeTruthy()
  })

  it('does not render close button when not closable', () => {
    const w = mount(Tag, { props: { closable: false } })
    expect(w.find('.ui-tag__close').exists()).toBe(false)
  })

  it('renders icon slot and adds with-icon class', () => {
    const w = mount(Tag, { slots: { icon: '<svg class="my-icon" />' } })
    expect(w.classes()).toContain('ui-tag--with-icon')
    expect(w.find('.my-icon').exists()).toBe(true)
  })
})
