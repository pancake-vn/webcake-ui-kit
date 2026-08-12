import { describe, it, expect } from 'vitest'
import { mount } from './_utils.js'
import { WkItem } from '../src/index.js'

describe('WkItem', () => {
  it('renders default slot content', () => {
    const wrapper = mount(WkItem, {
      slots: {
        default: 'Test content'
      }
    })
    expect(wrapper.text()).toContain('Test content')
  })

  it('applies base class', () => {
    const wrapper = mount(WkItem)
    expect(wrapper.classes()).toContain('ui-item')
  })

  it('renders with custom HTML in slot', () => {
    const wrapper = mount(WkItem, {
      slots: {
        default: '<span class="custom">Custom</span>'
      }
    })
    expect(wrapper.find('.custom').exists()).toBe(true)
    expect(wrapper.find('.custom').text()).toBe('Custom')
  })
})
