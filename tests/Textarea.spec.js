import { WkTextarea } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkTextarea', () => {
  it('renders smoke — textarea present, root has ui-textarea class', () => {
    const w = mount(WkTextarea)
    expect(w.find('textarea').exists()).toBe(true)
    expect(w.classes()).toContain('ui-textarea')
  })

  it('renders value prop', () => {
    const w = mount(WkTextarea, { props: { value: 'hello' } })
    expect(w.find('textarea').element.value).toBe('hello')
  })

  it('prefers modelValue over value', () => {
    const w = mount(WkTextarea, { props: { value: 'a', modelValue: 'b' } })
    expect(w.find('textarea').element.value).toBe('b')
  })

  it('renders placeholder', () => {
    const w = mount(WkTextarea, { props: { placeholder: 'Type here...' } })
    expect(w.find('textarea').attributes('placeholder')).toBe('Type here...')
  })

  const sizes = ['default', 'mini']
  sizes.forEach(size => {
    it(`applies size class for "${size}"`, () => {
      const w = mount(WkTextarea, { props: { size } })
      expect(w.classes()).toContain(`ui-textarea--size-${size}`)
    })
  })

  const roundness = ['default', 'round']
  roundness.forEach(r => {
    it(`applies roundness class for "${r}"`, () => {
      const w = mount(WkTextarea, { props: { roundness: r } })
      expect(w.classes()).toContain(`ui-textarea--round-${r}`)
    })
  })

  it('applies error class', () => {
    const w = mount(WkTextarea, { props: { error: true } })
    expect(w.classes()).toContain('ui-textarea--error')
    expect(w.classes()).not.toContain('ui-textarea--disabled')
  })

  it('applies disabled class and native disabled attribute', () => {
    const w = mount(WkTextarea, { props: { disabled: true } })
    expect(w.classes()).toContain('ui-textarea--disabled')
    expect(w.find('textarea').attributes('disabled')).toBeDefined()
  })

  it('sets readonly attribute', () => {
    const w = mount(WkTextarea, { props: { readonly: true } })
    expect(w.find('textarea').attributes('readonly')).toBeDefined()
  })

  it('passes rows to native textarea', () => {
    const w = mount(WkTextarea, { props: { rows: 5 } })
    expect(w.find('textarea').attributes('rows')).toBe('5')
  })

  it('emits input, update:modelValue and change on user input', async () => {
    const w = mount(WkTextarea)
    const ta = w.find('textarea')
    ta.element.value = 'hello'
    await ta.trigger('input')
    expect(w.emitted('input')[0][0]).toBe('hello')
    expect(w.emitted('update:modelValue')[0][0]).toBe('hello')
    expect(w.emitted('change')).toBeTruthy()
  })

  it('emits focus and blur', async () => {
    const w = mount(WkTextarea, { props: { value: 'x' } })
    const el = w.find('textarea').element
    el.dispatchEvent(new Event('focus'))
    await w.vm.$nextTick()
    expect(w.emitted('focus')).toBeTruthy()
    el.dispatchEvent(new Event('blur'))
    await w.vm.$nextTick()
    expect(w.emitted('blur')).toBeTruthy()
  })

  it('does not emit input by default (no interaction)', () => {
    const w = mount(WkTextarea, { props: { disabled: true } })
    expect(w.emitted('input')).toBeFalsy()
  })

  it('adds no-resize class when resizable=false', () => {
    const w = mount(WkTextarea, { props: { resizable: false } })
    expect(w.find('textarea').classes()).toContain('ui-textarea__field--no-resize')
  })

  it('adds no-resize class when autosize=true', () => {
    const w = mount(WkTextarea, { props: { autosize: true } })
    expect(w.find('textarea').classes()).toContain('ui-textarea__field--no-resize')
  })

  it('sets maxlength attribute when maxLength prop is set', () => {
    const w = mount(WkTextarea, { props: { maxLength: 100 } })
    expect(w.find('textarea').attributes('maxlength')).toBe('100')
  })

  it('does not render counter by default', () => {
    const w = mount(WkTextarea)
    expect(w.find('.ui-textarea__counter').exists()).toBe(false)
  })

  it('shows counter with char count when showCount=true', () => {
    const w = mount(WkTextarea, { props: { value: 'hi', showCount: true } })
    const counter = w.find('.ui-textarea__counter')
    expect(counter.exists()).toBe(true)
    expect(counter.text()).toContain('2')
    expect(counter.text()).not.toContain('/')
  })

  it('shows counter as "n / max" when maxLength is set', () => {
    const w = mount(WkTextarea, { props: { value: 'hi', maxLength: 50 } })
    const counter = w.find('.ui-textarea__counter')
    expect(counter.exists()).toBe(true)
    expect(counter.text()).toContain('2')
    expect(counter.text()).toContain('50')
  })

  it('counter reflects prop value changes', async () => {
    const w = mount(WkTextarea, { props: { showCount: true, value: '' } })
    expect(w.find('.ui-textarea__counter').text()).toContain('0')
    await w.setProps({ value: 'abc' })
    expect(w.find('.ui-textarea__counter').text()).toContain('3')
  })
})
