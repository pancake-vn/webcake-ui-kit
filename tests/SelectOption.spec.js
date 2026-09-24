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
    expect(w.find('.ui-select-option').classes()).toContain('ui-select-option--disabled')
  })

  it('applies large class for size lg', () => {
    const w = mount(WkSelectOption, { props: { value: 'x', size: 'lg' } })
    expect(w.find('.ui-select-option').classes()).toContain('ui-select-option--lg')
  })

  it('applies destructive class for variant destructive', () => {
    const w = mount(WkSelectOption, { props: { value: 'x', variant: 'destructive' } })
    expect(w.find('.ui-select-option').classes()).toContain('ui-select-option--destructive')
  })

  it('does not apply selected class when no select context', () => {
    const w = mount(WkSelectOption, { props: { value: 'x' } })
    expect(w.find('.ui-select-option').classes()).not.toContain('ui-select-option--selected')
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

  // --- children (columns rendered by Select at container level, not inline) ---

  const CHILDREN = [{ value: 'c1', label: 'Child 1', children: [] }]

  function makeSelectCtx(overrides) {
    return Object.assign(
      {
        expandedColumns: [],
        expandColumn() {},
        optionSize: null,
        size: 'md',
        effectiveValue: null,
        filterText: '',
        isMultiMode: false,
        showChecked: false,
        disabled: false,
        setSlotOptionVisible() {},
        removeSlotOption() {},
        registerOption() {}
      },
      overrides
    )
  }

  it('renders the expand chevron when the option has children', () => {
    const w = mount(WkSelectOption, { props: { value: 'p', label: 'Parent', children: CHILDREN } })
    expect(w.find('.ui-select-option__expand').exists()).toBe(true)
    expect(w.find('.ui-select-option').classes()).toContain('ui-select-option--has-children')
  })

  it('does not render the expand chevron for a leaf option', () => {
    const w = mount(WkSelectOption, { props: { value: 'x' } })
    expect(w.find('.ui-select-option__expand').exists()).toBe(false)
  })

  it('does not render inline submenu (column rendering is handled by Select)', () => {
    const w = mount(WkSelectOption, { props: { value: 'p', children: CHILDREN } })
    expect(w.find('.ui-select-option__submenu').exists()).toBe(false)
  })

  it('clicking an option with children calls select.expandColumn', async () => {
    const calls = []
    const ctx = makeSelectCtx({
      expandColumn(d, v) {
        calls.push({ d, v })
      }
    })
    const w = mount(WkSelectOption, {
      props: { value: 'p', children: CHILDREN },
      global: { provide: { select: ctx } }
    })
    await w.find('.ui-select-option').trigger('click')
    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ d: 0, v: 'p' })
  })

  it("clicking same option twice calls expandColumn twice (collapse is Select's responsibility)", async () => {
    const calls = []
    const ctx = makeSelectCtx({
      expandColumn() {
        calls.push(1)
      }
    })
    const w = mount(WkSelectOption, {
      props: { value: 'p', children: CHILDREN },
      global: { provide: { select: ctx } }
    })
    await w.find('.ui-select-option').trigger('click')
    await w.find('.ui-select-option').trigger('click')
    expect(calls).toHaveLength(2)
  })

  it('does not call expandColumn when disabled', async () => {
    const calls = []
    const ctx = makeSelectCtx({
      expandColumn() {
        calls.push(1)
      }
    })
    const w = mount(WkSelectOption, {
      props: { value: 'p', children: CHILDREN, disabled: true },
      global: { provide: { select: ctx } }
    })
    await w.find('.ui-select-option').trigger('click')
    expect(calls).toHaveLength(0)
  })

  it('applies expanded class when select context marks this option as expanded', () => {
    const ctx = makeSelectCtx({
      expandedColumns: [{ ownerValue: 'p', children: CHILDREN, width: null }]
    })
    const w = mount(WkSelectOption, {
      props: { value: 'p', children: CHILDREN },
      global: { provide: { select: ctx } }
    })
    expect(w.find('.ui-select-option').classes()).toContain('ui-select-option--expanded')
  })
})
