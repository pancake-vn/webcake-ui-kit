import { WkInput } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkInput', () => {
  it('renders with default value and placeholder', () => {
    const w = mount(WkInput, { props: { value: 'hello', placeholder: 'Type...' } })
    expect(w.find('input').element.value).toBe('hello')
    expect(w.find('input').attributes('placeholder')).toBe('Type...')
    expect(w.classes()).toContain('ui-input')
  })

  it('prefers modelValue over value', () => {
    const w = mount(WkInput, { props: { value: 'a', modelValue: 'b' } })
    expect(w.find('input').element.value).toBe('b')
  })

  const sizes = ['tiny', 'xs', 'sm', 'md', 'lg']
  sizes.forEach(size => {
    it(`applies size class for "${size}"`, () => {
      const w = mount(WkInput, { props: { size } })
      expect(w.classes()).toContain(`ui-input--size-${size}`)
    })
  })

  it('emits input, update:modelValue and change on user typing', async () => {
    const w = mount(WkInput)
    const input = w.find('input')
    input.element.value = 'abc'
    await input.trigger('input')
    expect(w.emitted('input')[0][0]).toBe('abc')
    expect(w.emitted('update:modelValue')[0][0]).toBe('abc')
    expect(w.emitted('change')).toBeTruthy()
  })

  it('emits pressEnter on Enter key', async () => {
    const w = mount(WkInput, { props: { value: 'go' } })
    await w.find('input').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('pressEnter')).toBeTruthy()
    expect(w.emitted('pressEnter')[0][0]).toBe('go')
  })

  it('renders prefix and suffix slots', () => {
    const w = mount(WkInput, {
      slots: { prefix: '<i class="prefix-icon"/>', suffix: '<i class="suffix-icon"/>' }
    })
    expect(w.find('.prefix-icon').exists()).toBe(true)
    expect(w.find('.suffix-icon').exists()).toBe(true)
  })

  it('error and disabled props apply state classes', () => {
    const w = mount(WkInput, { props: { error: true, disabled: true } })
    expect(w.classes()).toContain('ui-input--error')
    expect(w.classes()).toContain('ui-input--disabled')
    expect(w.find('input').attributes('disabled')).toBeDefined()
  })
})
