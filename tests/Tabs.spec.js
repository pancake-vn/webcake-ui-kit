import { WkTabs } from '../src/index.js'
import { mount } from './_utils.js'

const TABS = [
  { value: 'a', label: 'Overview' },
  { value: 'b', label: 'Activity', counter: 3 },
  { value: 'c', label: 'Settings', disabled: true }
]

describe('WkTabs', () => {
  it('renders a tab button for each entry', () => {
    const w = mount(WkTabs, { props: { tabs: TABS, value: 'a' } })
    expect(w.findAll('.ui-tabs__item').length).toBe(3)
  })

  it('applies active class to the selected tab', () => {
    const w = mount(WkTabs, { props: { tabs: TABS, value: 'b' } })
    const items = w.findAll('.ui-tabs__item')
    expect(items[1].classes()).toContain('ui-tabs__item--active')
    expect(items[0].classes()).not.toContain('ui-tabs__item--active')
  })

  it('applies disabled class to disabled tabs', () => {
    const w = mount(WkTabs, { props: { tabs: TABS, value: 'a' } })
    const items = w.findAll('.ui-tabs__item')
    expect(items[2].classes()).toContain('ui-tabs__item--disabled')
  })

  it('applies size class', () => {
    for (const size of ['xs', 'sm', 'md', 'lg']) {
      const w = mount(WkTabs, { props: { tabs: TABS, value: 'a', size } })
      expect(w.classes()).toContain(`ui-tabs--${size}`)
    }
  })

  it('emits change and input with the new value on click', async () => {
    const w = mount(WkTabs, { props: { tabs: TABS, value: 'a' } })
    await w.findAll('.ui-tabs__item')[1].trigger('click')
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBe('b')
    expect(w.emitted('input')[0][0]).toBe('b')
  })

  it('does not emit when clicking the already active tab', async () => {
    const w = mount(WkTabs, { props: { tabs: TABS, value: 'a' } })
    await w.findAll('.ui-tabs__item')[0].trigger('click')
    expect(w.emitted('change')).toBeFalsy()
  })

  it('renders counter badge', () => {
    const w = mount(WkTabs, { props: { tabs: TABS, value: 'a' } })
    expect(w.find('.ui-tabs__counter').text()).toBe('3')
  })
})
