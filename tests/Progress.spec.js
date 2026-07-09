import { WkProgress } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkProgress', () => {
  it('renders progressbar element', () => {
    const w = mount(WkProgress)
    expect(w.find('.ui-progress').exists()).toBe(true)
    expect(w.find('.ui-progress').attributes('role')).toBe('progressbar')
  })

  it('renders bar element', () => {
    const w = mount(WkProgress, { props: { value: 50 } })
    expect(w.find('.ui-progress__bar').exists()).toBe(true)
  })

  it('sets bar width as percentage of max', () => {
    const w = mount(WkProgress, { props: { value: 50, max: 100 } })
    expect(w.find('.ui-progress__bar').attributes('style')).toContain('width: 50%')
  })

  it('defaults max to 100', () => {
    const w = mount(WkProgress, { props: { value: 25 } })
    expect(w.vm.percent).toBe(25)
  })

  it('renders full bar when value equals max', () => {
    const w = mount(WkProgress, { props: { value: 100, max: 100 } })
    expect(w.vm.percent).toBe(100)
    expect(w.find('.ui-progress__bar').attributes('style')).toContain('width: 100%')
  })

  it('renders empty bar when value is 0', () => {
    const w = mount(WkProgress, { props: { value: 0, max: 100 } })
    expect(w.vm.percent).toBe(0)
    expect(w.find('.ui-progress__bar').attributes('style')).toContain('width: 0%')
  })

  it('clamps value below 0 to 0', () => {
    const w = mount(WkProgress, { props: { value: -10 } })
    expect(w.vm.clampedValue).toBe(0)
    expect(w.vm.percent).toBe(0)
  })

  it('clamps value above max to max', () => {
    const w = mount(WkProgress, { props: { value: 150, max: 100 } })
    expect(w.vm.clampedValue).toBe(100)
    expect(w.vm.percent).toBe(100)
  })

  it('computes percent correctly with custom max', () => {
    const w = mount(WkProgress, { props: { value: 1, max: 4 } })
    expect(w.vm.percent).toBe(25)
  })

  it('sets aria-valuenow to the clamped value', () => {
    const w = mount(WkProgress, { props: { value: 75 } })
    expect(w.find('.ui-progress').attributes('aria-valuenow')).toBe('75')
  })

  it('sets aria-valuenow to 0 when value is negative', () => {
    const w = mount(WkProgress, { props: { value: -5 } })
    expect(w.find('.ui-progress').attributes('aria-valuenow')).toBe('0')
  })

  it('sets aria-valuemin to 0', () => {
    const w = mount(WkProgress, { props: { value: 50 } })
    expect(w.find('.ui-progress').attributes('aria-valuemin')).toBe('0')
  })

  it('sets aria-valuemax to the max prop', () => {
    const w = mount(WkProgress, { props: { value: 50, max: 200 } })
    expect(w.find('.ui-progress').attributes('aria-valuemax')).toBe('200')
  })
})
