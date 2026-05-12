import { WkSwitchGroup } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkSwitchGroup', () => {
  it('renders label text', () => {
    const w = mount(WkSwitchGroup, { props: { label: 'Dark mode' } })
    expect(w.text()).toContain('Dark mode')
  })

  it('renders default slot over label prop', () => {
    const w = mount(WkSwitchGroup, { slots: { default: 'Slot label' } })
    expect(w.text()).toContain('Slot label')
  })

  it('applies layout class', () => {
    const inline = mount(WkSwitchGroup, { props: { layout: 'inline' } })
    expect(inline.classes()).toContain('ui-switch-group--inline')

    const block = mount(WkSwitchGroup, { props: { layout: 'block' } })
    expect(block.classes()).toContain('ui-switch-group--block')
  })

  it('applies disabled class', () => {
    const w = mount(WkSwitchGroup, { props: { disabled: true } })
    expect(w.classes()).toContain('ui-switch-group--disabled')
  })

  it('emits change and input when switch is toggled', async () => {
    const w = mount(WkSwitchGroup, { props: { value: false } })
    await w.find('.ui-switch').trigger('click')
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBe(true)
    expect(w.emitted('input')[0][0]).toBe(true)
  })

  it('does not emit when disabled', async () => {
    const w = mount(WkSwitchGroup, { props: { value: false, disabled: true } })
    await w.find('.ui-switch').trigger('click')
    expect(w.emitted('change')).toBeFalsy()
  })
})
