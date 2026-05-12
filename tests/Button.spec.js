import { WkButton } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkButton', () => {
  it('renders label prop', () => {
    const w = mount(WkButton, { props: { label: 'Click me' } })
    expect(w.text()).toContain('Click me')
  })

  it('renders default slot over label', () => {
    const w = mount(WkButton, {
      props: { label: 'fallback' },
      slots: { default: 'slotted' }
    })
    expect(w.text()).toContain('slotted')
    expect(w.text()).not.toContain('fallback')
  })

  it('applies variant and size classes', () => {
    const w = mount(WkButton, { props: { label: 'X', variant: 'destructive', size: 'lg' } })
    expect(w.classes()).toEqual(expect.arrayContaining(['ui-btn', 'ui-btn--destructive', 'ui-btn--lg']))
  })

  it('emits click on user click', async () => {
    const w = mount(WkButton, { props: { label: 'X' } })
    await w.trigger('click')
    expect(w.emitted('click')).toBeTruthy()
    expect(w.emitted('click').length).toBe(1)
  })

  it('does not emit click when disabled', async () => {
    const w = mount(WkButton, { props: { label: 'X', disabled: true } })
    await w.trigger('click')
    expect(w.emitted('click')).toBeFalsy()
  })

  it('does not emit click when loading and shows spinner', async () => {
    const w = mount(WkButton, { props: { label: 'X', loading: true } })
    expect(w.find('.ui-btn__spinner').exists()).toBe(true)
    await w.trigger('click')
    expect(w.emitted('click')).toBeFalsy()
  })

  it('sets the native button type attribute', () => {
    const w = mount(WkButton, { props: { label: 'X', htmlType: 'submit' } })
    expect(w.attributes('type')).toBe('submit')
  })
})
