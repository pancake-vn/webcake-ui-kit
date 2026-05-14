import { WkField } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkField', () => {
  it('renders ui-field root', () => {
    const w = mount(WkField)
    expect(w.classes()).toContain('ui-field')
  })

  it('applies vertical layout class by default', () => {
    const w = mount(WkField)
    expect(w.classes()).toContain('ui-field--vertical')
  })

  it('applies horizontal layout class', () => {
    const w = mount(WkField, { props: { layout: 'horizontal' } })
    expect(w.classes()).toContain('ui-field--horizontal')
  })

  it('applies required class when required=true', () => {
    const w = mount(WkField, { props: { required: true, label: 'Name' } })
    expect(w.classes()).toContain('ui-field--required')
  })

  it('does not apply required class by default', () => {
    const w = mount(WkField)
    expect(w.classes()).not.toContain('ui-field--required')
  })

  it('applies error class when errorText is set', () => {
    const w = mount(WkField, { props: { errorText: 'Required field' } })
    expect(w.classes()).toContain('ui-field--error')
  })

  it('does not apply error class when only helpText is set', () => {
    const w = mount(WkField, { props: { helpText: 'Hint' } })
    expect(w.classes()).not.toContain('ui-field--error')
  })

  it('renders label from prop', () => {
    const w = mount(WkField, { props: { label: 'Email address' } })
    expect(w.find('.ui-field__label').exists()).toBe(true)
    expect(w.find('.ui-field__label').text()).toContain('Email address')
  })

  it('renders label from slot', () => {
    const w = mount(WkField, { slots: { label: '<b class="custom-lbl">Name</b>' } })
    expect(w.find('.ui-field__label').exists()).toBe(true)
    expect(w.find('.custom-lbl').exists()).toBe(true)
  })

  it('does not render label element when no label prop or slot', () => {
    const w = mount(WkField)
    expect(w.find('.ui-field__label').exists()).toBe(false)
  })

  it('renders helpText in message', () => {
    const w = mount(WkField, { props: { helpText: 'Enter a valid email' } })
    expect(w.find('.ui-field__message').exists()).toBe(true)
    expect(w.find('.ui-field__message-text').text()).toContain('Enter a valid email')
  })

  it('renders errorText in message', () => {
    const w = mount(WkField, { props: { errorText: 'This field is required' } })
    expect(w.find('.ui-field__message').exists()).toBe(true)
    expect(w.find('.ui-field__message-text').text()).toContain('This field is required')
  })

  it('does not render message section when neither helpText nor errorText', () => {
    const w = mount(WkField)
    expect(w.find('.ui-field__message').exists()).toBe(false)
  })

  it('renders control from default slot', () => {
    const w = mount(WkField, { slots: { default: '<input class="ctrl-input" />' } })
    expect(w.find('.ctrl-input').exists()).toBe(true)
  })

  it('applies align-start class for horizontal layout with align=start', () => {
    const w = mount(WkField, { props: { layout: 'horizontal', align: 'start' } })
    expect(w.classes()).toContain('ui-field--align-start')
  })
})
