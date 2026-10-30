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
    const val = w.find('.ui-base-select__value')
    expect(val.text()).toContain('Pick one')
    expect(val.classes()).toContain('ui-base-select__value--placeholder')
  })

  it('renders selected label when value is set', () => {
    const w = mount(WkSelect, { props: { value: 'Banana', options: FRUITS } })
    const val = w.find('.ui-base-select__value')
    expect(val.text()).toContain('Banana')
    expect(val.classes()).not.toContain('ui-base-select__value--placeholder')
  })

  it('resolves label from object options', () => {
    const w = mount(WkSelect, { props: { value: 'banana', options: FRUIT_OBJS } })
    expect(w.find('.ui-base-select__value').text()).toContain('Banana')
  })

  it('normalizes string options to {value, label, disabled}', () => {
    const w = mount(WkSelect, { props: { options: FRUITS } })
    expect(w.vm.normalizedOptions[0]).toMatchObject({
      value: 'Apple',
      label: 'Apple',
      disabled: false
    })
  })

  it('normalizes object options and resolves disabled', () => {
    const w = mount(WkSelect, { props: { options: FRUIT_OBJS } })
    expect(w.vm.normalizedOptions[2]).toMatchObject({ value: 'cherry', label: 'Cherry', disabled: true })
  })

  // --- classes / state ---

  it('applies size class for all sizes', () => {
    for (const size of ['xs', 'sm', 'md', 'lg']) {
      const w = mount(WkSelect, { props: { size, options: FRUITS } })
      expect(w.find('.ui-base-select').classes()).toContain(`ui-base-select--${size}`)
    }
  })

  it('applies error class', () => {
    const w = mount(WkSelect, { props: { error: true, options: FRUITS } })
    expect(w.find('.ui-base-select').classes()).toContain('ui-base-select--error')
  })

  it('applies disabled class', () => {
    const w = mount(WkSelect, { props: { disabled: true, options: FRUITS } })
    expect(w.find('.ui-base-select').classes()).toContain('ui-base-select--disabled')
  })

  it('applies loading class and renders a spinner', () => {
    const w = mount(WkSelect, { props: { loading: true, options: FRUITS } })
    expect(w.find('.ui-base-select').classes()).toContain('ui-base-select--loading')
    expect(w.find('.ui-spinner').exists()).toBe(true)
  })

  it('renders the chevron arrow when not loading', () => {
    const w = mount(WkSelect, { props: { options: FRUITS } })
    expect(w.find('.ui-base-select__arrow').exists()).toBe(true)
  })

  // --- open / close ---

  it('opens the dropdown on click (portal appears in body)', async () => {
    const w = mount(WkSelect, { props: { options: FRUITS }, attachTo: document.body })
    await w.find('.ui-base-select').trigger('click')
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).not.toBeNull()
    w.unmount && w.unmount()
  })

  it('does not open when disabled', async () => {
    const w = mount(WkSelect, { props: { disabled: true, options: FRUITS }, attachTo: document.body })
    await w.find('.ui-base-select').trigger('click')
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).toBeNull()
    w.unmount && w.unmount()
  })

  it('renders option items inside the portal when open', async () => {
    const w = mount(WkSelect, { props: { options: FRUITS }, attachTo: document.body })
    await w.find('.ui-base-select').trigger('click')
    await w.vm.$nextTick()
    const items = document.body.querySelectorAll('.ui-select__options .ui-menuitem')
    expect(items.length).toBe(3)
    w.unmount && w.unmount()
  })

  // --- selection (single) ---

  it('onSelect emits update:value and change in single mode', () => {
    const w = mount(WkSelect, { props: { options: FRUITS } })
    w.vm.onSelect('Apple')
    expect(w.emitted('update:value')[0][0]).toBe('Apple')
    expect(w.emitted('change')[0][0]).toBe('Apple')
  })

  it('change payload includes the resolved option as second arg', () => {
    const w = mount(WkSelect, { props: { options: FRUIT_OBJS } })
    w.vm.onSelect('banana')
    expect(w.emitted('change')[0][1]).toMatchObject({ value: 'banana', label: 'Banana' })
  })

  it('builds displayValues from the current value', () => {
    const w = mount(WkSelect, { props: { value: 'banana', options: FRUIT_OBJS } })
    expect(w.vm.displayValues).toEqual([{ value: 'banana', label: 'Banana' }])
  })

  // --- multiple mode ---

  describe('mode=multiple', () => {
    it('applies ui-base-select--multiple class', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: [] } })
      expect(w.find('.ui-base-select').classes()).toContain('ui-base-select--multiple')
    })

    it('renders a tag per selected value', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: ['Apple', 'Cherry'] } })
      expect(w.findAll('.ui-tag').length).toBe(2)
    })

    it('onSelect adds a value and emits the array', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: ['Apple'] } })
      w.vm.onSelect('Cherry')
      expect(w.emitted('update:value')[0][0]).toEqual(['Apple', 'Cherry'])
      expect(w.emitted('change')[0][0]).toEqual(['Apple', 'Cherry'])
    })

    it('onSelect toggles off an already-selected value', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: ['Apple', 'Cherry'] } })
      w.vm.onSelect('Apple')
      expect(w.emitted('update:value')[0][0]).toEqual(['Cherry'])
    })

    it('handleDeselect removes a value and emits', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: ['Apple', 'Banana'] } })
      w.vm.handleDeselect('Apple')
      expect(w.emitted('update:value')[0][0]).toEqual(['Banana'])
    })

    it('does not mutate the original value prop array', () => {
      const val = ['Apple', 'Banana']
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: val } })
      w.vm.onSelect('Cherry')
      expect(val).toEqual(['Apple', 'Banana'])
    })

    it('renders search input in multiple mode with showSearch', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', showSearch: true, options: FRUITS, value: [] } })
      expect(w.find('.ui-base-select__search').exists()).toBe(true)
    })

    it('does not render search input without showSearch', () => {
      const w = mount(WkSelect, { props: { mode: 'multiple', options: FRUITS, value: [] } })
      expect(w.find('.ui-base-select__search').exists()).toBe(false)
    })
  })

  // --- searchable (single) ---

  describe('searchable', () => {
    it('renders a search input when showSearch=true', () => {
      const w = mount(WkSelect, { props: { showSearch: true, options: FRUITS } })
      expect(w.find('.ui-base-select__search').exists()).toBe(true)
    })

    it('does not render search input in plain single mode', () => {
      const w = mount(WkSelect, { props: { options: FRUITS } })
      expect(w.find('.ui-base-select__search').exists()).toBe(false)
    })

    it('onSearch sets searchValue and filters flattenOptions (case-insensitive)', () => {
      const w = mount(WkSelect, { props: { showSearch: true, options: FRUITS } })
      w.vm.onSearch('ban')
      expect(w.vm.searchValue).toBe('ban')
      expect(w.vm.flattenOptions).toHaveLength(1)
      expect(w.vm.flattenOptions[0]).toMatchObject({ value: 'Banana', label: 'Banana' })
    })

    it('flattenOptions returns all options when searchValue is empty', () => {
      const w = mount(WkSelect, { props: { showSearch: true, options: FRUITS } })
      expect(w.vm.flattenOptions.length).toBe(3)
    })
  })

  // --- tags mode ---

  describe('mode=tags', () => {
    it('applies multiple class and always renders the search input', () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: [] } })
      expect(w.find('.ui-base-select').classes()).toContain('ui-base-select--multiple')
      expect(w.find('.ui-base-select__search').exists()).toBe(true)
    })

    it('handleEnterSearch creates a custom tag and emits', () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: [] } })
      w.vm.handleEnterSearch('Mango')
      expect(w.emitted('update:value')[0][0]).toEqual(['Mango'])
      expect(w.vm.tagOptions.some(o => o.value === 'Mango')).toBe(true)
    })

    it('handleEnterSearch matches an existing option label and reuses its value', () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUIT_OBJS, value: [] } })
      w.vm.handleEnterSearch('apple')
      // existing label "Apple" matches (case-insensitive) → emits the option's value, not the typed text
      expect(w.emitted('update:value')[0][0]).toEqual(['apple'])
    })

    it('handleEnterSearch does not emit when value already contains the tag', () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: ['Apple'] } })
      w.vm.handleEnterSearch('Apple')
      expect(w.emitted('update:value')).toBeFalsy()
    })

    it('handleEnterSearch ignores empty/whitespace input', () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: [] } })
      w.vm.handleEnterSearch('   ')
      expect(w.emitted('update:value')).toBeFalsy()
    })

    it('custom tags appear in flattenOptions (tags mode)', () => {
      const w = mount(WkSelect, { props: { mode: 'tags', options: FRUITS, value: [] } })
      w.vm.tagOptions = [{ label: 'Mango', value: 'Mango', disabled: false }]
      expect(w.vm.flattenOptions.some(o => o.value === 'Mango')).toBe(true)
    })
  })

  // --- clear ---

  it('handleClear emits null in single mode', () => {
    const w = mount(WkSelect, { props: { value: 'Apple', options: FRUITS } })
    w.vm.handleClear()
    expect(w.emitted('update:value')[0][0]).toBeNull()
    expect(w.emitted('change')[0][0]).toBeNull()
  })

  it('handleClear emits [] in multiple mode', () => {
    const w = mount(WkSelect, { props: { mode: 'multiple', value: ['Apple'], options: FRUITS } })
    w.vm.handleClear()
    expect(w.emitted('update:value')[0][0]).toEqual([])
  })

  it('handleClear resets tagOptions in tags mode', () => {
    const w = mount(WkSelect, { props: { mode: 'tags', options: [], value: ['Mango'] } })
    w.vm.tagOptions = [{ label: 'Mango', value: 'Mango', disabled: false }]
    w.vm.handleClear()
    expect(w.vm.tagOptions).toEqual([])
  })
})
