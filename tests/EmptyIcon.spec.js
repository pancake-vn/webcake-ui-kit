import { WkEmptyIcon } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkEmptyIcon', () => {
  it('renders ui-empty-icon root', () => {
    const w = mount(WkEmptyIcon)
    expect(w.classes()).toContain('ui-empty-icon')
  })

  it('renders the inner frame element', () => {
    const w = mount(WkEmptyIcon)
    expect(w.find('.ui-empty-icon__frame').exists()).toBe(true)
  })

  it('renders slotted content inside frame', () => {
    const w = mount(WkEmptyIcon, { slots: { default: '<svg class="test-icon" />' } })
    expect(w.find('.test-icon').exists()).toBe(true)
  })
})
