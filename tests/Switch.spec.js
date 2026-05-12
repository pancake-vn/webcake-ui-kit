import { WkSwitch } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkSwitch', () => {
  it('renders as a button with role="switch"', () => {
    const w = mount(WkSwitch, {})
    expect(w.element.tagName.toLowerCase()).toBe('button')
    expect(w.attributes('role')).toBe('switch')
  })

  it('has aria-checked="false" when value is false', () => {
    const w = mount(WkSwitch, { props: { value: false } })
    expect(w.attributes('aria-checked')).toBe('false')
  })

  it('has aria-checked="true" and on class when value is true', () => {
    const w = mount(WkSwitch, { props: { value: true } })
    expect(w.attributes('aria-checked')).toBe('true')
    expect(w.classes()).toContain('ui-switch--on')
  })

  it('emits change and input with toggled value on click', async () => {
    const w = mount(WkSwitch, { props: { value: false } })
    await w.trigger('click')
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBe(true)
    expect(w.emitted('input')[0][0]).toBe(true)
  })

  it('emits false when toggling from on to off', async () => {
    const w = mount(WkSwitch, { props: { value: true } })
    await w.trigger('click')
    expect(w.emitted('change')[0][0]).toBe(false)
  })

  it('does not emit when disabled', async () => {
    const w = mount(WkSwitch, { props: { value: false, disabled: true } })
    await w.trigger('click')
    expect(w.emitted('change')).toBeFalsy()
  })

  it('has disabled attribute when disabled prop is true', () => {
    const w = mount(WkSwitch, { props: { disabled: true } })
    expect(w.attributes('disabled')).toBeDefined()
  })
})
