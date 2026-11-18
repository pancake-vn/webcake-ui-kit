import { WkInputGroup, WkInputGroupAddon, WkInput, WkButton } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkInputGroup', () => {
  it('renders a role=group container with aria-label', () => {
    const w = mount(WkInputGroup, {
      props: { label: 'url' },
      slots: { default: '<span class="child">a</span>' }
    })
    expect(w.classes()).toContain('ui-input-group')
    expect(w.attributes('role')).toBe('group')
    expect(w.attributes('aria-label')).toBe('url')
    expect(w.find('.child').exists()).toBe(true)
  })

  it('omits aria-label when label is empty', () => {
    const w = mount(WkInputGroup)
    expect(w.attributes('aria-label')).toBeUndefined()
  })

  it('wraps real Input / Button / Addon children', () => {
    const w = mount(WkInputGroup, {
      slots: {
        default: [
          '<span class="ui-input-group__addon">x</span>',
          '<span class="ui-input"><input class="ui-input__field" /></span>',
          '<button class="ui-btn">Go</button>'
        ].join('')
      }
    })
    expect(w.findAll('.ui-input-group__addon').length).toBe(1)
    expect(w.find('input').exists()).toBe(true)
    expect(w.find('button').exists()).toBe(true)
  })

  it('exports the reusable child components', () => {
    expect(WkInput).toBeTruthy()
    expect(WkButton).toBeTruthy()
  })
})

describe('WkInputGroupAddon', () => {
  it('renders slot content with default md size', () => {
    const w = mount(WkInputGroupAddon, { slots: { default: 'https://' } })
    expect(w.text()).toBe('https://')
    expect(w.classes()).toContain('ui-input-group__addon--size-md')
  })

  it.each(['tiny', 'xs', 'sm', 'md', 'lg'])('applies size %s', size => {
    const w = mount(WkInputGroupAddon, { props: { size } })
    expect(w.classes()).toContain(`ui-input-group__addon--size-${size}`)
  })
})
