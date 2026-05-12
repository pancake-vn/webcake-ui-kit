import { SidebarGroupLabel } from '../src/index.js'
import { mount } from './_utils.js'

describe('SidebarGroupLabel', () => {
  it('renders label text (static)', () => {
    const w = mount(SidebarGroupLabel, { props: { label: 'Projects' } })
    expect(w.text()).toContain('Projects')
  })

  it('renders default slot over label prop', () => {
    const w = mount(SidebarGroupLabel, { slots: { default: 'Slot text' } })
    expect(w.text()).toContain('Slot text')
  })

  it('renders a span (not a button) when not collapsible', () => {
    const w = mount(SidebarGroupLabel, { props: { label: 'x' } })
    expect(w.find('button').exists()).toBe(false)
    expect(w.find('.ui-sidebar-group-label__text').exists()).toBe(true)
  })

  it('renders a button trigger when collapsible', () => {
    const w = mount(SidebarGroupLabel, { props: { label: 'x', collapsible: true } })
    expect(w.find('button').exists()).toBe(true)
  })

  it('sets aria-expanded to "true" when collapsible and expanded', () => {
    const w = mount(SidebarGroupLabel, { props: { collapsible: true, expanded: true } })
    expect(w.find('button').attributes('aria-expanded')).toBe('true')
  })

  it('sets aria-expanded to "false" when collapsible and not expanded', () => {
    const w = mount(SidebarGroupLabel, { props: { collapsible: true, expanded: false } })
    expect(w.find('button').attributes('aria-expanded')).toBe('false')
  })

  it('applies collapsed class when collapsible and not expanded', () => {
    const w = mount(SidebarGroupLabel, { props: { collapsible: true, expanded: false } })
    expect(w.classes()).toContain('ui-sidebar-group-label--collapsed')
  })

  it('emits toggle when button is clicked', async () => {
    const w = mount(SidebarGroupLabel, { props: { collapsible: true, expanded: true } })
    await w.find('button').trigger('click')
    expect(w.emitted('toggle')).toBeTruthy()
  })

  it('renders action slot', () => {
    const w = mount(SidebarGroupLabel, {
      props: { label: 'x' },
      slots: { action: '<button class="add-btn">+</button>' }
    })
    expect(w.find('.add-btn').exists()).toBe(true)
  })
})
