import { vi } from 'vitest'
import { WkSelect } from '../src/index.js'
import { mount } from './_utils.js'

const FRUITS = ['Apple', 'Banana', 'Cherry']
const FRUIT_OBJS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', disabled: true }
]

afterEach(() => {
  document.body.innerHTML = ''
})

describe('WkSelect', () => {
  // --- single mode (default) ---

  it('renders placeholder when no value', () => {
    const w = mount(WkSelect, { props: { placeholder: 'Pick one', options: FRUITS } })
    expect(w.find('.ui-select__value').text()).toContain('Pick one')
    expect(w.find('.ui-select__value').classes()).toContain('ui-select__value--placeholder')
  })

  it('renders selected label when value is set', () => {
    const w = mount(WkSelect, { props: { value: 'Banana', options: FRUITS } })
    expect(w.find('.ui-select__value').text()).toContain('Banana')
    expect(w.find('.ui-select__value').classes()).not.toContain('ui-select__value--placeholder')
  })

  it('resolves label from object options', () => {
    const w = mount(WkSelect, { props: { value: 'banana', options: FRUIT_OBJS } })
    expect(w.find('.ui-select__value').text()).toContain('Banana')
  })

  it('normalizes string options to {value, label, disabled}', () => {
    const w = mount(WkSelect, { props: { options: FRUITS } })
    expect(w.vm.normalizedOptions[0]).toMatchObject({
      value: 'Apple',
      label: 'Apple',
      disabled: false
    })
  })

  it('applies size class for all sizes', () => {
    for (const size of ['xs', 'sm', 'md', 'lg']) {
      const w = mount(WkSelect, { props: { size, options: FRUITS } })
      expect(w.find('.ui-select').classes()).toContain(`ui-select--${size}`)
    }
  })

  it('applies error class', () => {
    const w = mount(WkSelect, { props: { error: true, options: FRUITS } })
    expect(w.find('.ui-select').classes()).toContain('ui-select--error')
  })

  it('applies disabled class', () => {
    const w = mount(WkSelect, { props: { disabled: true, options: FRUITS } })
    expect(w.find('.ui-select').classes()).toContain('ui-select--disabled')
  })

  it('applies loading class', () => {
    const w = mount(WkSelect, { props: { loading: true, options: FRUITS } })
    expect(w.find('.ui-select').classes()).toContain('ui-select--loading')
  })

  it('opens dropdown on click', async () => {
    const w = mount(WkSelect, { props: { options: FRUITS } })
    await w.find('.ui-select').trigger('click')
    await w.vm.$nextTick()
    expect(w.find('.ui-select').classes()).toContain('ui-select--open')
  })

  it('does not open when disabled', async () => {
    const w = mount(WkSelect, { props: { disabled: true, options: FRUITS } })
    await w.find('.ui-select').trigger('click')
    await w.vm.$nextTick()
    expect(w.find('.ui-select').classes()).not.toContain('ui-select--open')
  })

  it('does not open when loading', async () => {
    const w = mount(WkSelect, { props: { loading: true, options: FRUITS } })
    await w.find('.ui-select').trigger('click')
    await w.vm.$nextTick()
    expect(w.find('.ui-select').classes()).not.toContain('ui-select--open')
  })

  it('renders prepend text', () => {
    const w = mount(WkSelect, { props: { prepend: 'Currency:', options: FRUITS } })
    expect(w.find('.ui-select__prepend').text()).toBe('Currency:')
  })

  it('renders spinner when loading', () => {
    const w = mount(WkSelect, { props: { loading: true, options: FRUITS } })
    expect(w.find('.ui-spinner').exists()).toBe(true)
  })

  it('renders chevron when not loading', () => {
    const w = mount(WkSelect, { props: { options: FRUITS } })
    expect(w.find('.ui-select__chevron').exists()).toBe(true)
  })

  it('emits change and update:modelValue on select', () => {
    const w = mount(WkSelect, { props: { options: FRUITS } })
    w.vm.select('Apple')
    expect(w.emitted('change')).toEqual([['Apple']])
    expect(w.emitted('update:modelValue')).toEqual([['Apple']])
  })

  it('closes dropdown after selecting in single mode', () => {
    const w = mount(WkSelect, { props: { options: FRUITS } })
    w.vm.isOpen = true
    w.vm.select('Apple')
    expect(w.vm.isOpen).toBe(false)
  })

  it('effectiveValue prefers modelValue over value', () => {
    const w = mount(WkSelect, { props: { value: 'Apple', modelValue: 'Banana', options: FRUITS } })
    expect(w.vm.effectiveValue).toBe('Banana')
  })

  // --- multiple mode ---

  describe('mode=multiple', () => {
    it('applies ui-select--multiple class', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: [] } })
      expect(w.find('.ui-select').classes()).toContain('ui-select--multiple')
    })

    it('does not render search input without searchable', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: [] } })
      expect(w.find('.ui-select__search').exists()).toBe(false)
    })

    it('selectedItems reflects value array with labels', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: ['Apple', 'Cherry'] } })
      expect(w.vm.selectedItems).toEqual([
        { value: 'Apple', label: 'Apple' },
        { value: 'Cherry', label: 'Cherry' }
      ])
    })

    it('selectedItems is empty array when value is not an array', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: null } })
      expect(w.vm.selectedItems).toEqual([])
    })

    it('select adds value and emits array', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: ['Apple'] } })
      w.vm.select('Cherry')
      expect(w.emitted('change')[0][0]).toEqual(['Apple', 'Cherry'])
      expect(w.emitted('update:modelValue')[0][0]).toEqual(['Apple', 'Cherry'])
    })

    it('select toggles off already-selected value', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: ['Apple', 'Cherry'] } })
      w.vm.select('Apple')
      expect(w.emitted('change')[0][0]).toEqual(['Cherry'])
    })

    it('select does not close dropdown in multiple mode', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: [] } })
      w.vm.isOpen = true
      w.vm.select('Apple')
      expect(w.vm.isOpen).toBe(true)
    })

    it('deselectItem removes value and emits', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: ['Apple', 'Banana'] } })
      w.vm.deselectItem('Apple')
      expect(w.emitted('change')[0][0]).toEqual(['Banana'])
      expect(w.emitted('update:modelValue')[0][0]).toEqual(['Banana'])
    })

    it('deselectItem is a no-op on non-present value', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: ['Apple'] } })
      w.vm.deselectItem('Cherry')
      expect(w.emitted('change')).toBeFalsy()
    })

    it('does not mutate the original value prop array', () => {
      const val = ['Apple', 'Banana']
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: val } })
      w.vm.select('Cherry')
      expect(val).toEqual(['Apple', 'Banana'])
    })

    it('renders search input in multiple mode with searchable=true', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', searchable: true, options: FRUITS, value: [] } })
      expect(w.find('.ui-select__search').exists()).toBe(true)
    })
  })

  // --- searchable (single mode) ---

  describe('searchable', () => {
    it('renders search input when searchable=true', () => {
      const w = mount(WkSelect, { props: { searchable: true, options: FRUITS } })
      expect(w.find('.ui-select__search').exists()).toBe(true)
    })

    it('renders search input when filterOption is provided', () => {
      const w = mount(WkSelect, { props: { filterOption: () => true, options: FRUITS } })
      expect(w.find('.ui-select__search').exists()).toBe(true)
    })

    it('does not render search input in plain single mode', () => {
      const w = mount(WkSelect, { props: { options: FRUITS } })
      expect(w.find('.ui-select__search').exists()).toBe(false)
    })

    it('applies ui-select--searchable class', () => {
      const w = mount(WkSelect, { props: { searchable: true, options: FRUITS } })
      expect(w.find('.ui-select').classes()).toContain('ui-select--searchable')
    })

    it('clicking input opens dropdown via openIfClosed', async () => {
      const w = mount(WkSelect, { props: { searchable: true, options: FRUITS } })
      await w.find('.ui-select__search').trigger('click')
      await w.vm.$nextTick()
      expect(w.vm.isOpen).toBe(true)
    })

    it('clicking input when already open keeps it open', async () => {
      const w = mount(WkSelect, { props: { searchable: true, options: FRUITS } })
      w.vm.isOpen = true
      await w.find('.ui-select__search').trigger('click')
      await w.vm.$nextTick()
      expect(w.vm.isOpen).toBe(true)
    })

    it('typing updates filterText and opens dropdown', async () => {
      const w = mount(WkSelect, { props: { searchable: true, options: FRUITS } })
      await w.find('.ui-select__search').setValue('Ban')
      expect(w.vm.filterText).toBe('Ban')
      expect(w.vm.isOpen).toBe(true)
    })

    it('filters options by label (case-insensitive)', () => {
      const w = mount(WkSelect, { props: { searchable: true, options: FRUITS } })
      w.vm.filterText = 'ban'
      expect(w.vm.filteredOptions).toHaveLength(1)
      expect(w.vm.filteredOptions[0]).toMatchObject({ value: 'Banana', label: 'Banana', disabled: false })
    })

    it('returns all options when filterText is empty', () => {
      const w = mount(WkSelect, { props: { searchable: true, options: FRUITS } })
      expect(w.vm.filteredOptions.length).toBe(3)
    })

    it('delegates to filterOption when provided', () => {
      const filterFn = vi.fn((input, opt) => opt.label.startsWith(input))
      const w = mount(WkSelect, { props: { filterOption: filterFn, options: FRUITS } })
      w.vm.filterText = 'Ch'
      expect(w.vm.filteredOptions.map(o => o.value)).toEqual(['Cherry'])
      expect(filterFn).toHaveBeenCalled()
    })

    it('clears filterText when dropdown closes', async () => {
      const w = mount(WkSelect, { props: { searchable: true, options: FRUITS } })
      w.vm.filterText = 'ban'
      w.vm.isOpen = true
      await w.vm.$nextTick()
      w.vm.isOpen = false
      await w.vm.$nextTick()
      expect(w.vm.filterText).toBe('')
    })

    it('Escape key closes dropdown', async () => {
      const w = mount(WkSelect, { props: { searchable: true, options: FRUITS } })
      w.vm.isOpen = true
      await w.vm.$nextTick()
      await w.find('.ui-select__search').trigger('keydown', { key: 'Escape' })
      expect(w.vm.isOpen).toBe(false)
    })
  })

  // --- tags mode ---

  describe('mode=tags', () => {
    it('applies both ui-select--multiple and ui-select--searchable classes', () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: [] } })
      expect(w.find('.ui-select').classes()).toContain('ui-select--multiple')
      expect(w.find('.ui-select').classes()).toContain('ui-select--searchable')
    })

    it('always renders search input', () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: [] } })
      expect(w.find('.ui-select__search').exists()).toBe(true)
    })

    it('Enter with new text creates custom tag option and emits', async () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: [] } })
      w.vm.filterText = 'Mango'
      await w.vm.$nextTick()
      await w.find('.ui-select__search').trigger('keydown', { key: 'Enter' })
      expect(w.emitted('change')[0][0]).toEqual(['Mango'])
      expect(w.vm.tagOptions.some(o => o.value === 'Mango')).toBe(true)
    })

    it('Enter clears filterText after creating tag', async () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: [] } })
      w.vm.filterText = 'Mango'
      await w.vm.$nextTick()
      await w.find('.ui-select__search').trigger('keydown', { key: 'Enter' })
      expect(w.vm.filterText).toBe('')
    })

    it('Enter matches existing option by label (case-insensitive) and uses its value', async () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: [] } })
      w.vm.filterText = 'apple'
      await w.vm.$nextTick()
      await w.find('.ui-select__search').trigger('keydown', { key: 'Enter' })
      expect(w.emitted('change')[0][0]).toEqual(['Apple'])
      expect(w.vm.tagOptions.length).toBe(0)
    })

    it('Enter does not emit when value already contains the tag', async () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: ['Apple'] } })
      w.vm.filterText = 'apple'
      await w.vm.$nextTick()
      await w.find('.ui-select__search').trigger('keydown', { key: 'Enter' })
      expect(w.emitted('change')).toBeFalsy()
    })

    it('Enter on empty input when closed opens the dropdown', async () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: [] } })
      await w.find('.ui-select__search').trigger('keydown', { key: 'Enter' })
      expect(w.vm.isOpen).toBe(true)
    })

    it('Backspace with empty input removes last selected value', async () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: ['Apple', 'Banana'] } })
      await w.find('.ui-select__search').trigger('keydown', { key: 'Backspace' })
      expect(w.emitted('change')[0][0]).toEqual(['Apple'])
    })

    it('Backspace removes custom tag from tagOptions', async () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: [], value: ['Mango'] } })
      w.vm.tagOptions = [{ label: 'Mango', value: 'Mango', disabled: false }]
      await w.find('.ui-select__search').trigger('keydown', { key: 'Backspace' })
      expect(w.vm.tagOptions.length).toBe(0)
    })

    it('Backspace with non-empty filterText does not remove last tag', async () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: ['Apple'] } })
      w.vm.filterText = 'Ban'
      await w.vm.$nextTick()
      await w.find('.ui-select__search').trigger('keydown', { key: 'Backspace' })
      expect(w.emitted('change')).toBeFalsy()
    })

    it('deselectItem removes value and emits', () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: ['Apple', 'Banana'] } })
      w.vm.deselectItem('Apple')
      expect(w.emitted('change')[0][0]).toEqual(['Banana'])
    })

    it('deselectItem removes custom option from tagOptions', () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: [], value: ['Mango'] } })
      w.vm.tagOptions = [{ label: 'Mango', value: 'Mango', disabled: false }]
      w.vm.deselectItem('Mango')
      expect(w.vm.tagOptions.length).toBe(0)
    })

    it('custom tags appear in normalizedOptions', () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: [] } })
      w.vm.tagOptions = [{ label: 'Mango', value: 'Mango', disabled: false }]
      expect(w.vm.normalizedOptions.some(o => o.value === 'Mango')).toBe(true)
    })

    it('custom tagOptions are excluded from non-tags normalizedOptions', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: [] } })
      w.vm.tagOptions = [{ label: 'Mango', value: 'Mango', disabled: false }]
      expect(w.vm.normalizedOptions.some(o => o.value === 'Mango')).toBe(false)
    })
  })
})
