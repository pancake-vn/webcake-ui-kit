import { WkDivider } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkDivider', () => {
  it('renders with default classes', () => {
    const w = mount(WkDivider, {})
    expect(w.classes()).toContain('ui-divider')
    expect(w.classes()).toContain('ui-divider--horizontal')
    expect(w.classes()).toContain('ui-divider--spacing-none')
  })

  it('has role="separator"', () => {
    const w = mount(WkDivider, {})
    expect(w.attributes('role')).toBe('separator')
  })

  it('reflects aria-orientation for horizontal (default)', () => {
    const w = mount(WkDivider, {})
    expect(w.attributes('aria-orientation')).toBe('horizontal')
  })

  it('applies vertical direction class and aria-orientation', () => {
    const w = mount(WkDivider, { props: { direction: 'vertical' } })
    expect(w.classes()).toContain('ui-divider--vertical')
    expect(w.attributes('aria-orientation')).toBe('vertical')
  })

  it('applies spacing class for regular', () => {
    const w = mount(WkDivider, { props: { spacing: 'regular' } })
    expect(w.classes()).toContain('ui-divider--spacing-regular')
  })

  it('applies spacing class for spacious', () => {
    const w = mount(WkDivider, { props: { spacing: 'spacious' } })
    expect(w.classes()).toContain('ui-divider--spacing-spacious')
  })
})
