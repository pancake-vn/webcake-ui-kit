import { WkRichCheckboxGroup } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkRichCheckboxGroup', () => {
  it('renders label and description props', () => {
    const w = mount(WkRichCheckboxGroup, { props: { label: 'Notify me', description: 'via email' } })
    expect(w.text()).toContain('Notify me')
    expect(w.text()).toContain('via email')
  })

  it('renders description slot over prop', () => {
    const w = mount(WkRichCheckboxGroup, {
      props: { label: 'x', description: 'fallback' },
      slots: { description: 'slotted desc' }
    })
    expect(w.text()).toContain('slotted desc')
    expect(w.text()).not.toContain('fallback')
  })

  it('applies flipped class', () => {
    const w = mount(WkRichCheckboxGroup, { props: { flipped: true, label: 'x' } })
    expect(w.classes()).toContain('ui-rich-checkbox--flipped')
  })

  it('applies disabled class', () => {
    const w = mount(WkRichCheckboxGroup, { props: { disabled: true, label: 'x' } })
    expect(w.classes()).toContain('ui-rich-checkbox--disabled')
  })

  it('emits change and update:modelValue when inner checkbox toggles', async () => {
    const w = mount(WkRichCheckboxGroup, { props: { checked: false, label: 'x' } })
    await w.find('input[type="checkbox"]').setChecked(true)
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('update:modelValue')).toBeTruthy()
  })
})
