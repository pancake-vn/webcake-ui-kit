import { WkDatePicker } from '../src/index.js'
import { mount } from './_utils.js'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('WkDatePicker', () => {
  // --- trigger / display ---

  it('renders the trigger element', () => {
    const w = mount(WkDatePicker)
    expect(w.find('.ui-dp-trigger').exists()).toBe(true)
  })

  it('shows default placeholder when no value', () => {
    const w = mount(WkDatePicker)
    const text = w.find('.ui-dp-trigger__text')
    expect(text.classes()).toContain('is-placeholder')
    expect(text.text()).toBe('Select date')
  })

  it('shows custom placeholder prop', () => {
    const w = mount(WkDatePicker, { props: { placeholder: 'Pick a date' } })
    expect(w.find('.ui-dp-trigger__text').text()).toBe('Pick a date')
  })

  it('shows display text when value is set', () => {
    const w = mount(WkDatePicker, { props: { value: '2024-03-15' } })
    const text = w.find('.ui-dp-trigger__text')
    expect(text.text()).toBe('2024-03-15')
    expect(text.classes()).not.toContain('is-placeholder')
  })

  it('prefers modelValue over value', () => {
    const w = mount(WkDatePicker, { props: { value: '2024-01-01', modelValue: '2024-06-15' } })
    expect(w.find('.ui-dp-trigger__text').text()).toBe('2024-06-15')
  })

  it('formats the display with a custom format', () => {
    const w = mount(WkDatePicker, { props: { value: '2024-03-15', format: 'DD/MM/YYYY' } })
    expect(w.find('.ui-dp-trigger__text').text()).toBe('15/03/2024')
  })

  // --- size / state classes ---

  it('applies size class for each size', () => {
    for (const size of ['xs', 'sm', 'md', 'lg']) {
      const w = mount(WkDatePicker, { props: { size } })
      expect(w.find('.ui-dp-trigger').classes()).toContain(`ui-dp-trigger--${size}`)
    }
  })

  it('applies is-disabled class when disabled', () => {
    const w = mount(WkDatePicker, { props: { disabled: true } })
    expect(w.find('.ui-dp-trigger').classes()).toContain('is-disabled')
  })

  it('sets role=combobox and aria-expanded on the trigger', () => {
    const w = mount(WkDatePicker)
    const trigger = w.find('.ui-dp-trigger')
    expect(trigger.attributes('role')).toBe('combobox')
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  // --- open / close ---

  it('opens on trigger click', async () => {
    const w = mount(WkDatePicker)
    await w.find('.ui-dp-trigger').trigger('click')
    await w.vm.$nextTick()
    expect(w.vm.isOpen).toBe(true)
  })

  it('does not open when disabled', async () => {
    const w = mount(WkDatePicker, { props: { disabled: true } })
    await w.find('.ui-dp-trigger').trigger('click')
    await w.vm.$nextTick()
    expect(w.vm.isOpen).toBe(false)
  })

  it('closes on second trigger click', async () => {
    const w = mount(WkDatePicker)
    w.vm.isOpen = true
    await w.find('.ui-dp-trigger').trigger('click')
    await w.vm.$nextTick()
    expect(w.vm.isOpen).toBe(false)
  })

  it('open() and close() methods toggle isOpen', () => {
    const w = mount(WkDatePicker)
    w.vm.open()
    expect(w.vm.isOpen).toBe(true)
    w.vm.close()
    expect(w.vm.isOpen).toBe(false)
  })

  // --- clear ---

  it('shows clear button when clearable and has value', () => {
    const w = mount(WkDatePicker, { props: { value: '2024-03-15', clearable: true } })
    expect(w.find('.ui-dp-trigger__clear').exists()).toBe(true)
  })

  it('does not show clear button when no value', () => {
    const w = mount(WkDatePicker, { props: { clearable: true } })
    expect(w.find('.ui-dp-trigger__clear').exists()).toBe(false)
  })

  it('does not show clear button when clearable=false', () => {
    const w = mount(WkDatePicker, { props: { value: '2024-03-15', clearable: false } })
    expect(w.find('.ui-dp-trigger__clear').exists()).toBe(false)
  })

  it('does not show clear button when disabled', () => {
    const w = mount(WkDatePicker, { props: { value: '2024-03-15', clearable: true, disabled: true } })
    expect(w.find('.ui-dp-trigger__clear').exists()).toBe(false)
  })

  it('emits change + update:modelValue with null on clear', async () => {
    const w = mount(WkDatePicker, { props: { value: '2024-03-15', clearable: true } })
    await w.find('.ui-dp-trigger__clear').trigger('click')
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBeNull()
    expect(w.emitted('update:modelValue')[0][0]).toBeNull()
    expect(w.emitted('clear')).toBeTruthy()
  })

  // --- single mode selection ---

  it('single mode: selecting a date emits value and closes', () => {
    const w = mount(WkDatePicker, { props: { valueFormat: 'YYYY-MM-DD' } })
    w.vm.isOpen = true
    w.vm.onSelectDate('2024-03-10')
    expect(w.emitted('change')[0][0]).toBe('2024-03-10')
    expect(w.emitted('update:modelValue')[0][0]).toBe('2024-03-10')
    expect(w.vm.isOpen).toBe(false)
  })

  it('single mode: emits a Date object by default (no valueFormat)', () => {
    const w = mount(WkDatePicker)
    w.vm.onSelectDate('2024-03-10')
    expect(w.emitted('change')[0][0]).toBeInstanceOf(Date)
  })

  // --- multiple mode ---

  it('multiple mode: shows comma-separated display text', () => {
    const w = mount(WkDatePicker, { props: { mode: 'multiple', value: ['2024-01-01', '2024-01-02'] } })
    const text = w.find('.ui-dp-trigger__text').text()
    expect(text).toContain('2024-01-01')
    expect(text).toContain('2024-01-02')
  })

  it('multiple mode: selecting toggles values and keeps open', () => {
    const w = mount(WkDatePicker, { props: { mode: 'multiple', value: ['2024-01-01'], valueFormat: 'YYYY-MM-DD' } })
    w.vm.isOpen = true
    w.vm.onSelectDate('2024-01-02')
    expect(w.emitted('change')[0][0]).toEqual(['2024-01-01', '2024-01-02'])
    expect(w.vm.isOpen).toBe(true)
  })

  it('multiple mode: selecting an already-selected date removes it', () => {
    const w = mount(WkDatePicker, {
      props: { mode: 'multiple', value: ['2024-01-01', '2024-01-02'], valueFormat: 'YYYY-MM-DD' }
    })
    w.vm.onSelectDate('2024-01-01')
    expect(w.emitted('change')[0][0]).toEqual(['2024-01-02'])
  })

  it('multiple mode: maxCount trims the oldest selection', () => {
    const w = mount(WkDatePicker, {
      props: { mode: 'multiple', maxCount: 2, value: ['2024-01-01', '2024-01-02'], valueFormat: 'YYYY-MM-DD' }
    })
    w.vm.onSelectDate('2024-01-03')
    expect(w.emitted('change')[0][0]).toEqual(['2024-01-02', '2024-01-03'])
  })

  // --- presets ---

  it('exposes presets prop and selects a single preset value', () => {
    const presets = [{ label: 'A date', value: '2024-05-20' }]
    const w = mount(WkDatePicker, { props: { presets, valueFormat: 'YYYY-MM-DD' } })
    expect(w.vm.presets).toEqual(presets)
    w.vm.onSelectPreset('2024-05-20')
    expect(w.emitted('change')[0][0]).toBe('2024-05-20')
  })

  it('onSelectPreset ignores array values in single picker', () => {
    const w = mount(WkDatePicker)
    w.vm.onSelectPreset(['2024-01-01', '2024-01-31'])
    expect(w.emitted('change')).toBeFalsy()
  })

  // --- view navigation ---

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

  it('months prop is clamped to 1..3 (monthsCount drives view count)', () => {
    const w1 = mount(WkDatePicker, { props: { months: 2 } })
    expect(w1.vm.monthsCount).toBe(2)
    expect(w1.vm.views.length).toBe(2)
    const w2 = mount(WkDatePicker, { props: { months: 9 } })
    expect(w2.vm.monthsCount).toBe(3)
  })

  it('canPrev is true when no minDate; canNext true when no maxDate', () => {
    const w = mount(WkDatePicker)
    expect(w.vm.canPrev).toBe(true)
    expect(w.vm.canNext).toBe(true)
  })

  // --- methods smoke ---

  it('focus and blur methods are callable without throwing', () => {
    const w = mount(WkDatePicker, { attachTo: document.body })
    expect(() => w.vm.focus()).not.toThrow()
    expect(() => w.vm.blur()).not.toThrow()
    w.unmount && w.unmount()
  })
})
