import { WkAlert } from '../src/index.js'
import { mount } from './_utils.js'

describe('Alert', () => {
  it('renders title and description text', () => {
    const w = mount(WkAlert, { props: { title: 'Heads up', description: 'Something happened' } })
    expect(w.text()).toContain('Heads up')
    expect(w.text()).toContain('Something happened')
  })

  it('defaults to neutral type', () => {
    const w = mount(WkAlert)
    expect(w.classes()).toContain('ui-alert--neutral')
  })

  it('applies each type class', () => {
    for (const type of ['neutral', 'error', 'warning', 'info']) {
      const w = mount(WkAlert, { props: { type } })
      expect(w.classes()).toContain(`ui-alert--${type}`)
    }
  })

  it('renders a default icon', () => {
    const w = mount(WkAlert)
    expect(w.find('.ui-alert__icon svg').exists()).toBe(true)
  })

  it('renders default slot as title over title prop', () => {
    const w = mount(WkAlert, { props: { title: 'ignored' }, slots: { default: 'Custom title' } })
    expect(w.find('.ui-alert__title').text()).toContain('Custom title')
    expect(w.text()).not.toContain('ignored')
  })

  it('renders description slot over description prop', () => {
    const w = mount(WkAlert, { props: { description: 'ignored' }, slots: { description: 'Custom desc' } })
    expect(w.find('.ui-alert__description').text()).toContain('Custom desc')
  })

  it('renders icon slot over default icon', () => {
    const w = mount(WkAlert, { slots: { icon: '<svg class="my-icon" />' } })
    expect(w.find('.ui-alert__icon .my-icon').exists()).toBe(true)
  })

  it('renders action slot when provided', () => {
    const w = mount(WkAlert, { slots: { action: '<button class="my-action">Go</button>' } })
    expect(w.find('.ui-alert__action').exists()).toBe(true)
    expect(w.find('.my-action').exists()).toBe(true)
  })

  it('does not render action wrapper without action slot', () => {
    const w = mount(WkAlert, { props: { title: 'x' } })
    expect(w.find('.ui-alert__action').exists()).toBe(false)
  })

  it('does not render description when neither prop nor slot given', () => {
    const w = mount(WkAlert, { props: { title: 'only title' } })
    expect(w.find('.ui-alert__description').exists()).toBe(false)
  })

  it('renders close button when closable', () => {
    const w = mount(WkAlert, { props: { closable: true } })
    expect(w.find('.ui-alert__close').exists()).toBe(true)
  })

  it('does not render close button when not closable', () => {
    const w = mount(WkAlert, { props: { closable: false } })
    expect(w.find('.ui-alert__close').exists()).toBe(false)
  })

  it('emits close when close button clicked', async () => {
    const w = mount(WkAlert, { props: { closable: true } })
    await w.find('.ui-alert__close').trigger('click')
    expect(w.emitted('close')).toBeTruthy()
  })

  it('does not emit close when not closable (no button)', () => {
    const w = mount(WkAlert, { props: { closable: false } })
    expect(w.find('.ui-alert__close').exists()).toBe(false)
    expect(w.emitted('close')).toBeFalsy()
  })
})
