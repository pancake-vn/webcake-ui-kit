import { WkAvatar } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkAvatar', () => {
  it('renders ui-avatar root', () => {
    const w = mount(WkAvatar)
    expect(w.classes()).toContain('ui-avatar')
  })

  const sizes = ['regular', 'small', 'tiny', 'extra-tiny']
  sizes.forEach(size => {
    it(`applies size class for "${size}"`, () => {
      const w = mount(WkAvatar, { props: { size } })
      expect(w.classes()).toContain(`ui-avatar--${size}`)
    })
  })

  const roundnesses = ['round', 'roundrect']
  roundnesses.forEach(roundness => {
    it(`applies roundness class for "${roundness}"`, () => {
      const w = mount(WkAvatar, { props: { roundness } })
      expect(w.classes()).toContain(`ui-avatar--${roundness}`)
    })
  })

  it('renders image when src is set', () => {
    const w = mount(WkAvatar, { props: { src: 'https://example.com/a.jpg', alt: 'User' } })
    expect(w.find('.ui-avatar__image').exists()).toBe(true)
    expect(w.find('.ui-avatar__image').attributes('src')).toBe('https://example.com/a.jpg')
    expect(w.find('.ui-avatar__fallback').exists()).toBe(false)
  })

  it('renders fallback when no src', () => {
    const w = mount(WkAvatar, { props: { name: 'JD' } })
    expect(w.find('.ui-avatar__image').exists()).toBe(false)
    expect(w.find('.ui-avatar__fallback').exists()).toBe(true)
    expect(w.find('.ui-avatar__fallback').text()).toContain('JD')
  })

  it('renders default slot inside fallback', () => {
    const w = mount(WkAvatar, { slots: { default: '<span class="initials">AB</span>' } })
    expect(w.find('.initials').exists()).toBe(true)
    expect(w.find('.initials').text()).toBe('AB')
  })

  it('shows online indicator when online=true', () => {
    const w = mount(WkAvatar, { props: { online: true } })
    expect(w.find('.ui-avatar__indicator').exists()).toBe(true)
  })

  it('does not render online indicator by default', () => {
    const w = mount(WkAvatar)
    expect(w.find('.ui-avatar__indicator').exists()).toBe(false)
  })

  it('switches to fallback after image error', async () => {
    const w = mount(WkAvatar, { props: { src: 'bad.jpg', name: 'ER' } })
    expect(w.find('.ui-avatar__image').exists()).toBe(true)
    await w.find('.ui-avatar__image').trigger('error')
    expect(w.find('.ui-avatar__image').exists()).toBe(false)
    expect(w.find('.ui-avatar__fallback').text()).toContain('ER')
  })
})
