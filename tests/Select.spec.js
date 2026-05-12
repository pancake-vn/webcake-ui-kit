import { WkSelect } from '../src/index.js'
import { mount } from './_utils.js'

const FRUITS = ['Apple', 'Banana', 'Cherry']

afterEach(() => {
  document.body.querySelectorAll('.ui-select__dropdown').forEach(el => {
    if (el.parentNode) el.parentNode.removeChild(el)
  })
})

describe('WkSelect', () => {
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

  it('applies size class', () => {
    for (const size of ['mini', 'sm', 'default', 'lg']) {
      const w = mount(WkSelect, { props: { size, options: FRUITS } })
      expect(w.classes()).toContain(`ui-select--${size}`)
    }
  })

  it('applies error class', () => {
    const w = mount(WkSelect, { props: { error: true, options: FRUITS } })
    expect(w.classes()).toContain('ui-select--error')
  })

  it('applies disabled class', () => {
    const w = mount(WkSelect, { props: { disabled: true, options: FRUITS } })
    expect(w.classes()).toContain('ui-select--disabled')
  })

  it('applies loading class', () => {
    const w = mount(WkSelect, { props: { loading: true, options: FRUITS } })
    expect(w.classes()).toContain('ui-select--loading')
  })

  it('opens dropdown on click', async () => {
    const w = mount(WkSelect, { props: { options: FRUITS } })
    await w.trigger('click')
    expect(w.classes()).toContain('ui-select--open')
    expect(document.body.querySelector('.ui-select__dropdown')).not.toBeNull()
  })

  it('does not open when disabled', async () => {
    const w = mount(WkSelect, { props: { disabled: true, options: FRUITS } })
    await w.trigger('click')
    expect(w.classes()).not.toContain('ui-select--open')
  })

  it('does not open when loading', async () => {
    const w = mount(WkSelect, { props: { loading: true, options: FRUITS } })
    await w.trigger('click')
    expect(w.classes()).not.toContain('ui-select--open')
  })

  it('renders prepend text', () => {
    const w = mount(WkSelect, { props: { prepend: 'Currency:', options: FRUITS } })
    expect(w.find('.ui-select__prepend').text()).toBe('Currency:')
  })

  it('renders spinner icon when loading', () => {
    const w = mount(WkSelect, { props: { loading: true, options: FRUITS } })
    expect(w.find('.ui-spinner').exists()).toBe(true)
  })

  it('renders chevron when not loading', () => {
    const w = mount(WkSelect, { props: { options: FRUITS } })
    expect(w.find('.ui-select__chevron').exists()).toBe(true)
  })
})
