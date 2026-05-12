import { WkRadioGroup } from '../src/index.js'
import { mount } from './_utils.js'

const OPTIONS = ['Apple', 'Banana', 'Cherry']

describe('WkRadioGroup', () => {
  it('renders a radio for each string option', () => {
    const w = mount(WkRadioGroup, { props: { options: OPTIONS, value: '' } })
    expect(w.findAll('.ui-radio').length).toBe(3)
  })

  it('renders options from object array', () => {
    const opts = [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' }
    ]
    const w = mount(WkRadioGroup, { props: { options: opts, value: 'a' } })
    expect(w.findAll('.ui-radio').length).toBe(2)
    expect(w.text()).toContain('Option A')
  })

  it('applies direction class', () => {
    const v = mount(WkRadioGroup, { props: { options: OPTIONS, value: '', direction: 'vertical' } })
    expect(v.classes()).toContain('ui-radio-group--vertical')

    const h = mount(WkRadioGroup, { props: { options: OPTIONS, value: '', direction: 'horizontal' } })
    expect(h.classes()).toContain('ui-radio-group--horizontal')
  })

  it('marks the matching option as checked', () => {
    const w = mount(WkRadioGroup, { props: { options: OPTIONS, value: 'Banana' } })
    const radios = w.findAll('.ui-radio')
    expect(radios[1].classes()).toContain('checked')
    expect(radios[0].classes()).not.toContain('checked')
  })

  it('emits change with selected value when a radio fires change event', async () => {
    const w = mount(WkRadioGroup, { props: { options: OPTIONS, value: '' } })
    await w.findAll('input[type="radio"]')[0].trigger('change')
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBe('Apple')
  })

  it('propagates disabled to all radio items', () => {
    const w = mount(WkRadioGroup, { props: { options: OPTIONS, value: '', disabled: true } })
    w.findAll('.ui-radio').forEach(r => {
      expect(r.classes()).toContain('disabled')
    })
  })

  it('propagates error to all radio items', () => {
    const w = mount(WkRadioGroup, { props: { options: OPTIONS, value: '', error: true } })
    w.findAll('.ui-radio').forEach(r => {
      expect(r.classes()).toContain('error')
    })
  })
})
