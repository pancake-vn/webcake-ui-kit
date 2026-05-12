import { WkSidebarItem } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkSidebarItem', () => {
  it('renders label text', () => {
    const w = mount(WkSidebarItem, { props: { label: 'Dashboard' } })
    expect(w.text()).toContain('Dashboard')
  })

  it('renders default slot over label prop', () => {
    const w = mount(WkSidebarItem, { slots: { default: 'Slot label' } })
    expect(w.text()).toContain('Slot label')
  })

  it('applies active class and aria-current', () => {
    const w = mount(WkSidebarItem, { props: { active: true } })
    expect(w.classes()).toContain('ui-sidebar-item--active')
    expect(w.attributes('aria-current')).toBe('page')
  })

  it('applies disabled class and sets tabindex -1', () => {
    const w = mount(WkSidebarItem, { props: { disabled: true } })
    expect(w.classes()).toContain('ui-sidebar-item--disabled')
    expect(w.attributes('tabindex')).toBe('-1')
  })

  it('applies large class for size large', () => {
    const w = mount(WkSidebarItem, { props: { size: 'large' } })
    expect(w.classes()).toContain('ui-sidebar-item--large')
  })

  it('applies level-2 class', () => {
    const w = mount(WkSidebarItem, { props: { level: 2 } })
    expect(w.classes()).toContain('ui-sidebar-item--level-2')
  })

  it('renders badge text', () => {
    const w = mount(WkSidebarItem, { props: { badge: '7' } })
    expect(w.find('.ui-sidebar-item__badge').text()).toBe('7')
  })

  it('does not render badge element when badge is empty', () => {
    const w = mount(WkSidebarItem, { props: { badge: '' } })
    expect(w.find('.ui-sidebar-item__badge').exists()).toBe(false)
  })

  it('emits click when clicked without children', async () => {
    const w = mount(WkSidebarItem, { props: { label: 'x' } })
    await w.trigger('click')
    expect(w.emitted('click')).toBeTruthy()
    expect(w.emitted('toggle')).toBeFalsy()
  })

  it('emits toggle (not click) when clicked with hasChildren', async () => {
    const w = mount(WkSidebarItem, { props: { hasChildren: true } })
    await w.trigger('click')
    expect(w.emitted('toggle')).toBeTruthy()
    expect(w.emitted('click')).toBeFalsy()
  })

  it('does not emit when disabled', async () => {
    const w = mount(WkSidebarItem, { props: { disabled: true } })
    await w.trigger('click')
    expect(w.emitted('click')).toBeFalsy()
    expect(w.emitted('toggle')).toBeFalsy()
  })

  it('applies has-children and expanded classes', () => {
    const w = mount(WkSidebarItem, { props: { hasChildren: true, expanded: true } })
    expect(w.classes()).toContain('ui-sidebar-item--has-children')
    expect(w.classes()).toContain('ui-sidebar-item--expanded')
  })

  it('renders icon slot', () => {
    const w = mount(WkSidebarItem, { slots: { icon: '<svg class="my-icon" />' } })
    expect(w.find('.my-icon').exists()).toBe(true)
    expect(w.find('.ui-sidebar-item__icon').exists()).toBe(true)
  })
})
