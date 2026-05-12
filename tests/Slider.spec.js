import { WkSlider } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkSlider', () => {
  it('renders the track and thumb', () => {
    const w = mount(WkSlider, { props: { value: 50 } })
    expect(w.find('.ui-slider__track').exists()).toBe(true)
    expect(w.find('.ui-slider__thumb').exists()).toBe(true)
  })

  it('has class ui-slider', () => {
    const w = mount(WkSlider, { props: { value: 50 } })
    expect(w.classes()).toContain('ui-slider')
  })

  it('applies disabled class', () => {
    const w = mount(WkSlider, { props: { value: 50, disabled: true } })
    expect(w.classes()).toContain('ui-slider--disabled')
  })

  it('applies vertical class for vertical orientation', () => {
    const w = mount(WkSlider, { props: { value: 50, orientation: 'vertical' } })
    expect(w.classes()).toContain('ui-slider--vertical')
  })

  it('applies range class when range is true', () => {
    const w = mount(WkSlider, { props: { range: true, rangeValue: [20, 80] } })
    expect(w.classes()).toContain('ui-slider--range')
  })

  it('renders two thumbs in range mode', () => {
    const w = mount(WkSlider, { props: { range: true, rangeValue: [20, 80] } })
    expect(w.findAll('.ui-slider__thumb').length).toBe(2)
  })

  it('renders one thumb in single mode', () => {
    const w = mount(WkSlider, { props: { value: 50 } })
    expect(w.findAll('.ui-slider__thumb').length).toBe(1)
  })

  it('sets aria-valuemin, aria-valuemax, aria-valuenow on thumb', () => {
    const w = mount(WkSlider, { props: { value: 40, min: 0, max: 100 } })
    const thumb = w.find('.ui-slider__thumb')
    expect(thumb.attributes('aria-valuemin')).toBe('0')
    expect(thumb.attributes('aria-valuemax')).toBe('100')
    expect(thumb.attributes('aria-valuenow')).toBe('40')
  })

  it('emits change and input on keyboard ArrowRight', async () => {
    const w = mount(WkSlider, { props: { value: 50, step: 5 } })
    await w.find('.ui-slider__thumb').trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBe(55)
    expect(w.emitted('input')[0][0]).toBe(55)
  })

  it('does not emit on keyboard when disabled', async () => {
    const w = mount(WkSlider, { props: { value: 50, disabled: true } })
    await w.find('.ui-slider__thumb').trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('change')).toBeFalsy()
  })
})
