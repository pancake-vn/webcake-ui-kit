import { WkRichSwitchGroup } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkRichSwitchGroup', () => {
  it('renders label text', () => {
    const w = mount(WkRichSwitchGroup, { props: { label: 'Dark mode' } })
    expect(w.text()).toContain('Dark mode')
  })

  it('renders default slot over label prop', () => {
    const w = mount(WkRichSwitchGroup, { slots: { default: 'Slot label' } })
    expect(w.text()).toContain('Slot label')
  })

  it('applies flipped class', () => {
    const w = mount(WkRichSwitchGroup, { props: { flipped: true } })
    expect(w.classes()).toContain('ui-rich-switch-group--flipped')
  })

  it('applies disabled class', () => {
    const w = mount(WkRichSwitchGroup, { props: { disabled: true } })
    expect(w.classes()).toContain('ui-rich-switch-group--disabled')
  })

  it('renders description prop', () => {
    const w = mount(WkRichSwitchGroup, { props: { label: 'x', description: 'Some detail' } })
    expect(w.text()).toContain('Some detail')
  })

  it('renders description slot', () => {
    const w = mount(WkRichSwitchGroup, { slots: { description: '<em class="desc-slot">Custom</em>' } })
    expect(w.find('.desc-slot').exists()).toBe(true)
  })

  it('does not render description element when no description', () => {
    const w = mount(WkRichSwitchGroup, { props: { label: 'x' } })
    expect(w.find('.ui-rich-switch-group__description').exists()).toBe(false)
  })

  it('emits change and input when switch is toggled', async () => {
    const w = mount(WkRichSwitchGroup, { props: { value: false } })
    await w.find('.ui-switch').trigger('click')
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBe(true)
    expect(w.emitted('input')[0][0]).toBe(true)
  })

  it('does not emit when disabled', async () => {
    const w = mount(WkRichSwitchGroup, { props: { value: false, disabled: true } })
    await w.find('.ui-switch').trigger('click')
    expect(w.emitted('change')).toBeFalsy()
  })
})
