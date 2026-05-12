import { WkToggle } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkToggle (standalone)', () => {
  it('renders label and aria-pressed=false by default', () => {
    const w = mount(WkToggle, { props: { label: 'Bold' } })
    expect(w.text()).toContain('Bold')
    expect(w.attributes('aria-pressed')).toBe('false')
    expect(w.classes()).toContain('ui-toggle')
  })

  it('reflects active prop', () => {
    const w = mount(WkToggle, { props: { label: 'x', active: true } })
    expect(w.attributes('aria-pressed')).toBe('true')
    expect(w.classes()).toContain('ui-toggle--active')
  })

  it('emits change and update:modelValue on click, toggling the value', async () => {
    const w = mount(WkToggle, { props: { label: 'x', active: false } })
    await w.trigger('click')
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBe(true)
    expect(w.emitted('update:modelValue')[0][0]).toBe(true)
  })

  it('does not emit when disabled', async () => {
    const w = mount(WkToggle, { props: { label: 'x', disabled: true } })
    await w.trigger('click')
    expect(w.emitted('change')).toBeFalsy()
  })

  it('applies variant and size classes', () => {
    const w = mount(WkToggle, { props: { label: 'x', variant: 'ghost', size: 'lg' } })
    expect(w.classes()).toContain('ui-toggle--variant-ghost')
    expect(w.classes()).toContain('ui-toggle--lg')
  })

  it('marks icon-only when only icon slot is used', () => {
    const w = mount(WkToggle, { slots: { icon: '<svg class="i"/>' } })
    expect(w.classes()).toContain('ui-toggle--icon-only')
    expect(w.find('.i').exists()).toBe(true)
  })
})
