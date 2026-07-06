import { WkSelectOption } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkSelectOption (standalone, no WkSelect context)', () => {
  it('renders label text', () => {
    const w = mount(WkSelectOption, { props: { value: 'foo', label: 'Foo' } })
    expect(w.text()).toContain('Foo')
  })

  it('falls back to value when no label', () => {
    const w = mount(WkSelectOption, { props: { value: 'bar' } })
    expect(w.text()).toContain('bar')
  })

  it('renders default slot over label/value', () => {
    const w = mount(WkSelectOption, { props: { value: 'x' }, slots: { default: 'Custom content' } })
    expect(w.text()).toContain('Custom content')
  })

  it('applies disabled class', () => {
    const w = mount(WkSelectOption, { props: { value: 'x', disabled: true } })
    expect(w.classes()).toContain('ui-select-option--disabled')
  })

  it('applies large class for size lg', () => {
    const w = mount(WkSelectOption, { props: { value: 'x', size: 'lg' } })
    expect(w.classes()).toContain('ui-select-option--lg')
  })

  it('applies destructive class for variant destructive', () => {
    const w = mount(WkSelectOption, { props: { value: 'x', variant: 'destructive' } })
    expect(w.classes()).toContain('ui-select-option--destructive')
  })

  it('does not apply selected class when no select context', () => {
    const w = mount(WkSelectOption, { props: { value: 'x' } })
    expect(w.classes()).not.toContain('ui-select-option--selected')
  })

  it('renders prefix slot inside .ui-select-option__prefix', () => {
    const w = mount(WkSelectOption, { props: { value: 'x' }, slots: { prefix: '<span class="icon">★</span>' } })
    expect(w.find('.ui-select-option__prefix').exists()).toBe(true)
    expect(w.find('.ui-select-option__prefix').text()).toContain('★')
  })

  it('renders suffix slot inside .ui-select-option__suffix', () => {
    const w = mount(WkSelectOption, { props: { value: 'x' }, slots: { suffix: '<span>Ctrl+K</span>' } })
    expect(w.find('.ui-select-option__suffix').exists()).toBe(true)
    expect(w.find('.ui-select-option__suffix').text()).toContain('Ctrl+K')
  })

  it('does not render prefix wrapper when prefix slot is absent', () => {
    const w = mount(WkSelectOption, { props: { value: 'x' } })
    expect(w.find('.ui-select-option__prefix').exists()).toBe(false)
  })

  it('does not render suffix wrapper when suffix slot is absent', () => {
    const w = mount(WkSelectOption, { props: { value: 'x' } })
    expect(w.find('.ui-select-option__suffix').exists()).toBe(false)
  })
})
