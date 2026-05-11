import { Checkbox } from '../src/index.js'
import { mount } from './_utils.js'

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    const w = mount(Checkbox)
    expect(w.find('input').element.checked).toBe(false)
    expect(w.classes()).toContain('ui-checkbox')
  })

  it('reflects checked prop', () => {
    const w = mount(Checkbox, { props: { checked: true } })
    expect(w.find('input').element.checked).toBe(true)
  })

  it('prefers modelValue over checked when both set', () => {
    const w = mount(Checkbox, { props: { checked: false, modelValue: true } })
    expect(w.find('input').element.checked).toBe(true)
  })

  it('emits change and update:modelValue on user toggle', async () => {
    const w = mount(Checkbox, { props: { checked: false } })
    await w.find('input').setChecked(true)
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBe(true)
    expect(w.emitted('update:modelValue')).toBeTruthy()
  })

  it('applies error class', () => {
    const w = mount(Checkbox, { props: { error: true } })
    expect(w.classes()).toContain('ui-checkbox--error')
  })

  it('disabled prop blocks input and applies class', () => {
    const w = mount(Checkbox, { props: { disabled: true } })
    expect(w.classes()).toContain('ui-checkbox--disabled')
    expect(w.find('input').attributes('disabled')).toBeDefined()
  })
})
