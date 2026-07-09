import { WkDatePicker } from '../src/index.js'
import { mount } from './_utils.js'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('WkDatePicker', () => {
  it('renders trigger element', () => {
    const w = mount(WkDatePicker)
    expect(w.find('.ui-date-picker__trigger').exists()).toBe(true)
  })

  it('shows default placeholder when no value', () => {
    const w = mount(WkDatePicker)
    expect(w.find('.ui-date-picker__text').classes()).toContain('is-placeholder')
    expect(w.find('.ui-date-picker__text').text()).toBe('Select date')
  })

  it('shows custom placeholder prop', () => {
    const w = mount(WkDatePicker, { props: { placeholder: 'Pick a date' } })
    expect(w.find('.ui-date-picker__text').text()).toBe('Pick a date')
  })

  it('shows display text when value is set', () => {
    const w = mount(WkDatePicker, { props: { value: '2024-03-15' } })
    expect(w.find('.ui-date-picker__text').text()).toBe('2024-03-15')
    expect(w.find('.ui-date-picker__text').classes()).not.toContain('is-placeholder')
  })

  it('prefers modelValue over value', () => {
    const w = mount(WkDatePicker, { props: { value: '2024-01-01', modelValue: '2024-06-15' } })
    expect(w.find('.ui-date-picker__text').text()).toBe('2024-06-15')
  })

  it('applies size class for each size', () => {
    for (const size of ['sm', 'md', 'lg']) {
      const w = mount(WkDatePicker, { props: { size } })
      expect(w.find('.ui-date-picker__trigger').classes()).toContain(`ui-date-picker__trigger--${size}`)
    }
  })

  it('applies is-disabled class when disabled', () => {
    const w = mount(WkDatePicker, { props: { disabled: true } })
    expect(w.find('.ui-date-picker__trigger').classes()).toContain('is-disabled')
  })

  it('does not open when disabled', async () => {
    const w = mount(WkDatePicker, { props: { disabled: true } })
    await w.find('.ui-date-picker__trigger').trigger('click')
    await w.vm.$nextTick()
    expect(w.vm.isOpen).toBe(false)
  })

  it('opens on click', async () => {
    const w = mount(WkDatePicker)
    await w.find('.ui-date-picker__trigger').trigger('click')
    await w.vm.$nextTick()
    expect(w.vm.isOpen).toBe(true)
  })

  it('closes on second click', async () => {
    const w = mount(WkDatePicker)
    w.vm.isOpen = true
    await w.find('.ui-date-picker__trigger').trigger('click')
    await w.vm.$nextTick()
    expect(w.vm.isOpen).toBe(false)
  })

  it('shows clear button when clearable and has value', () => {
    const w = mount(WkDatePicker, { props: { value: '2024-03-15', clearable: true } })
    expect(w.find('.ui-date-picker__clear').exists()).toBe(true)
  })

  it('does not show clear button when no value', () => {
    const w = mount(WkDatePicker, { props: { clearable: true } })
    expect(w.find('.ui-date-picker__clear').exists()).toBe(false)
  })

  it('does not show clear button when clearable=false', () => {
    const w = mount(WkDatePicker, { props: { value: '2024-03-15', clearable: false } })
    expect(w.find('.ui-date-picker__clear').exists()).toBe(false)
  })

  it('does not show clear button when disabled', () => {
    const w = mount(WkDatePicker, { props: { value: '2024-03-15', clearable: true, disabled: true } })
    expect(w.find('.ui-date-picker__clear').exists()).toBe(false)
  })

  it('emits change and update:modelValue with null on clear', async () => {
    const w = mount(WkDatePicker, { props: { value: '2024-03-15', clearable: true } })
    await w.find('.ui-date-picker__clear').trigger('click')
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBeNull()
    expect(w.emitted('update:modelValue')[0][0]).toBeNull()
    expect(w.emitted('clear')).toBeTruthy()
  })

  it('range mode: shows default placeholder', () => {
    const w = mount(WkDatePicker, { props: { mode: 'range' } })
    expect(w.find('.ui-date-picker__text').text()).toBe('Start date - End date')
  })

  it('range mode: shows selected range text', () => {
    const w = mount(WkDatePicker, { props: { mode: 'range', value: ['2024-01-01', '2024-01-31'] } })
    const text = w.find('.ui-date-picker__text').text()
    expect(text).toContain('2024-01-01')
    expect(text).toContain('2024-01-31')
  })

  it('range mode: hasValue is true when start is set', () => {
    const w = mount(WkDatePicker, { props: { mode: 'range', value: ['2024-01-01', null] } })
    expect(w.vm.hasValue).toBe(true)
  })

  it('multiple mode: shows comma-separated display text', () => {
    const w = mount(WkDatePicker, { props: { mode: 'multiple', value: ['2024-01-01', '2024-01-02'] } })
    const text = w.find('.ui-date-picker__text').text()
    expect(text).toContain('2024-01-01')
    expect(text).toContain('2024-01-02')
  })

  it('focus and blur methods are callable without throwing', () => {
    const w = mount(WkDatePicker, { attachTo: document.body })
    expect(() => w.vm.focus()).not.toThrow()
    expect(() => w.vm.blur()).not.toThrow()
    w.unmount && w.unmount()
  })

  it('open() and close() methods toggle isOpen', () => {
    const w = mount(WkDatePicker)
    w.vm.open()
    expect(w.vm.isOpen).toBe(true)
    w.vm.close()
    expect(w.vm.isOpen).toBe(false)
  })

  it('shiftMonth moves viewISO forward by one month', () => {
    const w = mount(WkDatePicker, { props: { value: '2024-01-15' } })
    const before = w.vm.viewISO
    w.vm.shiftMonth(1)
    expect(w.vm.viewISO).not.toBe(before)
  })

  it('shiftYear moves viewISO forward by one year', () => {
    const w = mount(WkDatePicker, { props: { value: '2024-01-15' } })
    const before = w.vm.viewISO
    w.vm.shiftYear(1)
    expect(w.vm.viewISO).not.toBe(before)
  })

  it('canPrev is true when no minDate', () => {
    const w = mount(WkDatePicker)
    expect(w.vm.canPrev).toBe(true)
  })

  it('canNext is true when no maxDate', () => {
    const w = mount(WkDatePicker)
    expect(w.vm.canNext).toBe(true)
  })

  it('confirmVisible defaults to false when showTime=false', () => {
    const w = mount(WkDatePicker, { props: { showTime: false } })
    expect(w.vm.confirmVisible).toBe(false)
  })

  it('confirmVisible is true when showTime=true', () => {
    const w = mount(WkDatePicker, { props: { showTime: true } })
    expect(w.vm.confirmVisible).toBe(true)
  })

  it('role="combobox" and aria-expanded on trigger', () => {
    const w = mount(WkDatePicker)
    const trigger = w.find('.ui-date-picker__trigger')
    expect(trigger.attributes('role')).toBe('combobox')
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })
})
