import { WkInputCounter } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkInputCounter', () => {
  it('renders root element', () => {
    const w = mount(WkInputCounter)
    expect(w.classes()).toContain('ui-input-counter')
    w.unmount && w.unmount()
  })

  const sizes = ['xs', 'sm', 'md', 'lg']
  sizes.forEach(size => {
    it(`applies size class for "${size}"`, () => {
      const w = mount(WkInputCounter, { props: { size } })
      expect(w.classes()).toContain(`ui-input-counter--size-${size}`)
      w.unmount && w.unmount()
    })
  })

  it('applies roundness class for round', () => {
    const w = mount(WkInputCounter, { props: { roundness: 'round' } })
    expect(w.classes()).toContain('ui-input-counter--round-round')
    w.unmount && w.unmount()
  })

  it('applies error class when error=true', () => {
    const w = mount(WkInputCounter, { props: { error: true } })
    expect(w.classes()).toContain('ui-input-counter--error')
    w.unmount && w.unmount()
  })

  it('applies disabled class when disabled=true', () => {
    const w = mount(WkInputCounter, { props: { disabled: true } })
    expect(w.classes()).toContain('ui-input-counter--disabled')
    w.unmount && w.unmount()
  })

  it('displays the value in the input field', () => {
    const w = mount(WkInputCounter, { props: { value: 42 } })
    expect(w.find('.ui-input-counter__field').element.value).toBe('42')
    w.unmount && w.unmount()
  })

  it('displays modelValue when provided', () => {
    const w = mount(WkInputCounter, { props: { modelValue: 7 } })
    expect(w.find('.ui-input-counter__field').element.value).toBe('7')
    w.unmount && w.unmount()
  })

  it('renders increment and decrement buttons', () => {
    const w = mount(WkInputCounter)
    expect(w.find('.ui-input-counter__btn--minus').exists()).toBe(true)
    expect(w.find('.ui-input-counter__btn--add').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('emits change and update:modelValue on increment', async () => {
    const w = mount(WkInputCounter, { props: { value: 5 } })
    await w.find('.ui-input-counter__btn--add').trigger('click')
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBe(6)
    expect(w.emitted('update:modelValue')).toBeTruthy()
    w.unmount && w.unmount()
  })

  it('emits change and update:modelValue on decrement', async () => {
    const w = mount(WkInputCounter, { props: { value: 5 } })
    await w.find('.ui-input-counter__btn--minus').trigger('click')
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBe(4)
    w.unmount && w.unmount()
  })

  it('does not emit change when disabled', async () => {
    const w = mount(WkInputCounter, { props: { value: 5, disabled: true } })
    await w.find('.ui-input-counter__btn--add').trigger('click')
    expect(w.emitted('change')).toBeFalsy()
    w.unmount && w.unmount()
  })

  it('disables increment button at max', () => {
    const w = mount(WkInputCounter, { props: { value: 10, max: 10 } })
    expect(w.find('.ui-input-counter__btn--add').attributes('disabled')).toBeDefined()
    w.unmount && w.unmount()
  })

  it('disables decrement button at min', () => {
    const w = mount(WkInputCounter, { props: { value: 0, min: 0 } })
    expect(w.find('.ui-input-counter__btn--minus').attributes('disabled')).toBeDefined()
    w.unmount && w.unmount()
  })

  it('clamps value to max on increment', async () => {
    const w = mount(WkInputCounter, { props: { value: 9, max: 10 } })
    await w.find('.ui-input-counter__btn--add').trigger('click')
    expect(w.emitted('change')[0][0]).toBe(10)
    w.unmount && w.unmount()
  })

  it('renders prefix slot', () => {
    const w = mount(WkInputCounter, {
      slots: { prefix: '<span class="my-prefix">$</span>' }
    })
    expect(w.find('.ui-input-counter__prefix').exists()).toBe(true)
    expect(w.find('.my-prefix').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('renders suffix slot', () => {
    const w = mount(WkInputCounter, {
      slots: { suffix: '<span class="my-suffix">USD</span>' }
    })
    expect(w.find('.ui-input-counter__suffix').exists()).toBe(true)
    expect(w.find('.my-suffix').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('respects step prop', async () => {
    const w = mount(WkInputCounter, { props: { value: 0, step: 5 } })
    await w.find('.ui-input-counter__btn--add').trigger('click')
    expect(w.emitted('change')[0][0]).toBe(5)
    w.unmount && w.unmount()
  })

  it('renders placeholder', () => {
    const w = mount(WkInputCounter, { props: { placeholder: 'Enter qty' } })
    expect(w.find('.ui-input-counter__field').attributes('placeholder')).toBe('Enter qty')
    w.unmount && w.unmount()
  })
})
