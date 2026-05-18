import { WkTooltip } from '../src/index.js'
import { mount } from './_utils.js'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('WkTooltip', () => {
  it('renders ui-tooltip root', () => {
    const w = mount(WkTooltip, { props: { title: 'Tip' } })
    expect(w.classes()).toContain('ui-tooltip')
  })

  it('renders trigger slot', () => {
    const w = mount(WkTooltip, {
      props: { title: 'Tip' },
      slots: { default: '<button class="trigger-btn">Hover</button>' }
    })
    expect(w.find('.trigger-btn').exists()).toBe(true)
  })

  it('teleports tooltip content into portal root on mount', () => {
    mount(WkTooltip, { props: { title: 'My tooltip', open: true } })
    expect(document.body.querySelector('.ui-tooltip__content')).not.toBeNull()
    const portal = document.body.querySelector('#wk-portal-root')
    expect(portal).not.toBeNull()
    expect(portal.querySelector('.ui-tooltip__content')).not.toBeNull()
  })

  it('shows title text inside tooltip', () => {
    mount(WkTooltip, { props: { title: 'Hello tooltip', open: true } })
    const el = document.body.querySelector('.ui-tooltip__content')
    expect(el.textContent).toContain('Hello tooltip')
  })

  it('hides tooltip via v-show when open=false', () => {
    mount(WkTooltip, { props: { title: 'Hidden', open: false } })
    const el = document.body.querySelector('.ui-tooltip__content')
    expect(el.style.display).toBe('none')
  })

  const sides = ['top', 'bottom', 'left', 'right']
  sides.forEach(side => {
    it(`applies side class for "${side}"`, () => {
      mount(WkTooltip, { props: { title: 'Tip', side, open: true } })
      const el = document.body.querySelector('.ui-tooltip__content')
      expect(el.classList.contains(`ui-tooltip__content--${side}`)).toBe(true)
    })
  })

  const colors = ['default', 'brand', 'destructive']
  colors.forEach(color => {
    it(`applies color class for "${color}"`, () => {
      mount(WkTooltip, { props: { title: 'Tip', color, open: true } })
      const el = document.body.querySelector('.ui-tooltip__content')
      expect(el.classList.contains(`ui-tooltip__content--${color}`)).toBe(true)
    })
  })

  it('renders arrow element by default', () => {
    mount(WkTooltip, { props: { title: 'Tip', open: true } })
    expect(document.body.querySelector('.ui-tooltip__arrow')).not.toBeNull()
  })

  it('does not render arrow when arrow=false', () => {
    mount(WkTooltip, { props: { title: 'Tip', open: true, arrow: false } })
    expect(document.body.querySelector('.ui-tooltip__arrow')).toBeNull()
  })

  it('renders content slot inside tooltip', () => {
    mount(WkTooltip, { props: { open: true }, slots: { content: '<em class="rich">Rich tip</em>' } })
    expect(document.body.querySelector('.rich')).not.toBeNull()
  })
})
