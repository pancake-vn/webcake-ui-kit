import { WkRangePicker } from '../src/index.js'
import { mount } from './_utils.js'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('WkRangePicker', () => {
  // --- trigger / display ---

  it('renders the range trigger element', () => {
    const w = mount(WkRangePicker)
    expect(w.find('.ui-dp-range-trigger').exists()).toBe(true)
  })

  it('shows default start/end placeholders when empty', () => {
    const w = mount(WkRangePicker)
    const start = w.find('.ui-dp-range-trigger__start')
    const end = w.find('.ui-dp-range-trigger__end')
    expect(start.text()).toBe('Start date')
    expect(end.text()).toBe('End date')
    expect(start.classes()).toContain('is-placeholder')
    expect(end.classes()).toContain('is-placeholder')
  })

  it('shows custom placeholder array', () => {
    const w = mount(WkRangePicker, { props: { placeholder: ['From', 'To'] } })
    expect(w.find('.ui-dp-range-trigger__start').text()).toBe('From')
    expect(w.find('.ui-dp-range-trigger__end').text()).toBe('To')
  })

  it('shows formatted start and end when value is set', () => {
    const w = mount(WkRangePicker, { props: { value: ['2024-01-01', '2024-01-31'] } })
    expect(w.find('.ui-dp-range-trigger__start').text()).toBe('2024-01-01')
    expect(w.find('.ui-dp-range-trigger__end').text()).toBe('2024-01-31')
    expect(w.find('.ui-dp-range-trigger__start').classes()).not.toContain('is-placeholder')
  })

  it('formats display with a custom format', () => {
    const w = mount(WkRangePicker, { props: { value: ['2024-01-01', '2024-01-31'], format: 'DD/MM/YYYY' } })
    expect(w.find('.ui-dp-range-trigger__start').text()).toBe('01/01/2024')
    expect(w.find('.ui-dp-range-trigger__end').text()).toBe('31/01/2024')
  })

  // --- size / state classes ---

  it('applies size class for each size', () => {
    for (const size of ['xs', 'sm', 'md', 'lg']) {
      const w = mount(WkRangePicker, { props: { size } })
      expect(w.find('.ui-dp-range-trigger').classes()).toContain(`ui-dp-range-trigger--${size}`)
    }
  })

  it('applies is-disabled class when disabled', () => {
    const w = mount(WkRangePicker, { props: { disabled: true } })
    expect(w.find('.ui-dp-range-trigger').classes()).toContain('is-disabled')
  })

  it('sets role=combobox and aria-expanded on the trigger', () => {
    const w = mount(WkRangePicker)
    const trigger = w.find('.ui-dp-range-trigger')
    expect(trigger.attributes('role')).toBe('combobox')
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  // --- open / close ---

  it('opens on trigger click', async () => {
    const w = mount(WkRangePicker)
    await w.find('.ui-dp-range-trigger').trigger('click')
    await w.vm.$nextTick()
    expect(w.vm.isOpen).toBe(true)
  })

  it('does not open when disabled', async () => {
    const w = mount(WkRangePicker, { props: { disabled: true } })
    await w.find('.ui-dp-range-trigger').trigger('click')
    await w.vm.$nextTick()
    expect(w.vm.isOpen).toBe(false)
  })

  it('closes on second trigger click', async () => {
    const w = mount(WkRangePicker)
    w.vm.isOpen = true
    await w.find('.ui-dp-range-trigger').trigger('click')
    await w.vm.$nextTick()
    expect(w.vm.isOpen).toBe(false)
  })

  it('open() and close() methods toggle isOpen', () => {
    const w = mount(WkRangePicker)
    w.vm.open()
    expect(w.vm.isOpen).toBe(true)
    w.vm.close()
    expect(w.vm.isOpen).toBe(false)
  })

  // --- clear ---

  it('shows clear button when clearable and has value', () => {
    const w = mount(WkRangePicker, { props: { value: ['2024-01-01', '2024-01-31'], clearable: true } })
    expect(w.find('.ui-dp-range-trigger__clear').exists()).toBe(true)
  })

  it('does not show clear button when no value', () => {
    const w = mount(WkRangePicker, { props: { clearable: true } })
    expect(w.find('.ui-dp-range-trigger__clear').exists()).toBe(false)
  })

  it('does not show clear button when clearable=false', () => {
    const w = mount(WkRangePicker, { props: { value: ['2024-01-01', '2024-01-31'], clearable: false } })
    expect(w.find('.ui-dp-range-trigger__clear').exists()).toBe(false)
  })

  it('does not show clear button when disabled', () => {
    const w = mount(WkRangePicker, { props: { value: ['2024-01-01', '2024-01-31'], clearable: true, disabled: true } })
    expect(w.find('.ui-dp-range-trigger__clear').exists()).toBe(false)
  })

  it('emits change + update:modelValue with [null, null] on clear', async () => {
    const w = mount(WkRangePicker, { props: { value: ['2024-01-01', '2024-01-31'], clearable: true } })
    await w.find('.ui-dp-range-trigger__clear').trigger('click')
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toEqual([null, null])
    expect(w.emitted('update:modelValue')[0][0]).toEqual([null, null])
    expect(w.emitted('clear')).toBeTruthy()
  })

  it('hasValue is true when only the start is set', () => {
    const w = mount(WkRangePicker, { props: { value: ['2024-01-01', null] } })
    expect(w.vm.hasValue).toBe(true)
  })

  // --- two-click range selection ---

  it('first click sets the start and enters picking mode (calendar-change)', () => {
    const w = mount(WkRangePicker, { props: { valueFormat: 'YYYY-MM-DD' } })
    w.vm.isOpen = true
    w.vm.onSelectDate('2024-01-10')
    expect(w.vm.rangePicking).toBe(true)
    expect(w.vm.rangeStartSel).toBe('2024-01-10')
    expect(w.emitted('calendar-change')[0][0]).toEqual(['2024-01-10', null])
    // not committed yet
    expect(w.emitted('change')).toBeFalsy()
  })

  it('second click commits the ordered range and closes', () => {
    const w = mount(WkRangePicker, { props: { valueFormat: 'YYYY-MM-DD' } })
    w.vm.isOpen = true
    w.vm.onSelectDate('2024-01-10')
    w.vm.onSelectDate('2024-01-20')
    expect(w.emitted('change')[0][0]).toEqual(['2024-01-10', '2024-01-20'])
    expect(w.emitted('update:modelValue')[0][0]).toEqual(['2024-01-10', '2024-01-20'])
    expect(w.vm.isOpen).toBe(false)
  })

  it('orders the range when the second click is earlier than the first', () => {
    const w = mount(WkRangePicker, { props: { valueFormat: 'YYYY-MM-DD' } })
    w.vm.onSelectDate('2024-01-20')
    w.vm.onSelectDate('2024-01-10')
    expect(w.emitted('change')[0][0]).toEqual(['2024-01-10', '2024-01-20'])
  })

  // --- presets ---

  it('exposes presets prop and applies a range preset', () => {
    const presets = [{ label: 'Jan', value: ['2024-01-01', '2024-01-31'] }]
    const w = mount(WkRangePicker, { props: { presets, valueFormat: 'YYYY-MM-DD' } })
    expect(w.vm.presets).toEqual(presets)
    w.vm.onSelectPreset(['2024-02-01', '2024-02-28'])
    expect(w.emitted('change')[0][0]).toEqual(['2024-02-01', '2024-02-28'])
  })

  it('onSelectPreset ignores non-array values', () => {
    const w = mount(WkRangePicker)
    w.vm.onSelectPreset('2024-01-01')
    expect(w.emitted('change')).toBeFalsy()
  })

  // --- view navigation ---

  it('shiftMonth moves viewISO forward by one month', () => {
    const w = mount(WkRangePicker, { props: { value: ['2024-01-01', '2024-01-31'] } })
    const before = w.vm.viewISO
    w.vm.shiftMonth(1)
    expect(w.vm.viewISO).not.toBe(before)
  })
})
