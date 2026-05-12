import { WkCheckboxGroup } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkCheckboxGroup', () => {
  it('renders label via prop', () => {
    const w = mount(WkCheckboxGroup, { props: { label: 'Accept terms' } })
    expect(w.text()).toContain('Accept terms')
    expect(w.classes()).toContain('ui-checkbox-group')
  })

  it('renders default slot over label', () => {
    const w = mount(WkCheckboxGroup, {
      props: { label: 'fallback' },
      slots: { default: 'slotted' }
    })
    expect(w.text()).toContain('slotted')
    expect(w.text()).not.toContain('fallback')
  })

  it('applies layout class', () => {
    const w = mount(WkCheckboxGroup, { props: { layout: 'block', label: 'x' } })
    expect(w.classes()).toContain('ui-checkbox-group--block')
  })

  it('applies disabled class', () => {
    const w = mount(WkCheckboxGroup, { props: { disabled: true, label: 'x' } })
    expect(w.classes()).toContain('ui-checkbox-group--disabled')
  })

  it('emits change and update:modelValue when inner checkbox toggles', async () => {
    const w = mount(WkCheckboxGroup, { props: { checked: false, label: 'x' } })
    await w.find('input[type="checkbox"]').setChecked(true)
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBe(true)
    expect(w.emitted('update:modelValue')).toBeTruthy()
  })

  it('uses modelValue when provided', () => {
    const w = mount(WkCheckboxGroup, { props: { modelValue: true, checked: false, label: 'x' } })
    expect(w.find('input').element.checked).toBe(true)
  })
})
