import { WkSpinner } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkSpinner', () => {
  it('renders with default classes', () => {
    const w = mount(WkSpinner, {})
    expect(w.classes()).toContain('ui-spinner')
    expect(w.classes()).toContain('ui-spinner--sm')
    expect(w.classes()).toContain('ui-spinner--default')
  })

  it('has role="status"', () => {
    const w = mount(WkSpinner, {})
    expect(w.attributes('role')).toBe('status')
  })

  it('applies size classes', () => {
    for (const size of ['sm', 'md', 'lg']) {
      const w = mount(WkSpinner, { props: { size } })
      expect(w.classes()).toContain(`ui-spinner--${size}`)
    }
  })

  it('applies type class for mirrored', () => {
    const w = mount(WkSpinner, { props: { type: 'mirrored' } })
    expect(w.classes()).toContain('ui-spinner--mirrored')
  })

  it('sets aria-label from label prop', () => {
    const w = mount(WkSpinner, { props: { label: 'Please wait' } })
    expect(w.attributes('aria-label')).toBe('Please wait')
  })

  it('defaults aria-label to "Loading"', () => {
    const w = mount(WkSpinner, {})
    expect(w.attributes('aria-label')).toBe('Loading')
  })

  it('renders an svg', () => {
    const w = mount(WkSpinner, {})
    expect(w.find('svg').exists()).toBe(true)
  })
})
