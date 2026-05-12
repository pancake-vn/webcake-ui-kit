import { WkRadio, WkRadioGroup } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkRadio (standalone)', () => {
  it('renders label text', () => {
    const w = mount(WkRadio, { props: { value: 'a', label: 'Option A' } })
    expect(w.text()).toContain('Option A')
  })

  it('renders default slot over label prop', () => {
    const w = mount(WkRadio, { props: { value: 'a' }, slots: { default: 'Slot label' } })
    expect(w.text()).toContain('Slot label')
  })

  it('applies checked class when checked prop is true', () => {
    const w = mount(WkRadio, { props: { value: 'a', checked: true } })
    expect(w.classes()).toContain('checked')
  })

  it('applies disabled class', () => {
    const w = mount(WkRadio, { props: { value: 'a', disabled: true } })
    expect(w.classes()).toContain('disabled')
  })

  it('applies error class', () => {
    const w = mount(WkRadio, { props: { value: 'a', error: true } })
    expect(w.classes()).toContain('error')
  })

  it('renders extraLabel slot', () => {
    const w = mount(WkRadio, { props: { value: 'a' }, slots: { extraLabel: '<span class="extra">$5/mo</span>' } })
    expect(w.find('.extra').exists()).toBe(true)
  })
})

describe('WkRadio inside WkRadioGroup', () => {
  function mountGroup(groupProps, radioProps) {
    const Wrapper = {
      components: { WkRadioGroup, WkRadio },
      props: ['gProps', 'rProps'],
      template: '<WkRadioGroup v-bind="gProps"><WkRadio v-bind="rProps" /></WkRadioGroup>'
    }
    return mount(Wrapper, { props: { gProps: groupProps, rProps: radioProps } })
  }

  it('reflects selected state from group value', () => {
    const w = mountGroup({ value: 'a', options: [] }, { value: 'a', label: 'A' })
    expect(w.find('.ui-radio').classes()).toContain('checked')
  })

  it('is not checked when group value differs', () => {
    const w = mountGroup({ value: 'b', options: [] }, { value: 'a', label: 'A' })
    expect(w.find('.ui-radio').classes()).not.toContain('checked')
  })

  it('inherits disabled from group', () => {
    const w = mountGroup({ value: '', disabled: true, options: [] }, { value: 'a', label: 'A' })
    expect(w.find('.ui-radio').classes()).toContain('disabled')
  })

  it('inherits error from group', () => {
    const w = mountGroup({ value: '', error: true, options: [] }, { value: 'a', label: 'A' })
    expect(w.find('.ui-radio').classes()).toContain('error')
  })

  it('emits change on the group when a radio is clicked', async () => {
    const w = mountGroup({ value: '', options: [] }, { value: 'a', label: 'A' })
    await w.find('input[type="radio"]').trigger('change')
    expect(w.findComponent(WkRadioGroup).emitted('change')).toBeTruthy()
    expect(w.findComponent(WkRadioGroup).emitted('change')[0][0]).toBe('a')
  })
})
