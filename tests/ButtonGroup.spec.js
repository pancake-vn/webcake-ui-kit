import { WkButtonGroup } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkButtonGroup', () => {
  it('renders children inside a role=group container', () => {
    const w = mount(WkButtonGroup, {
      props: { label: 'actions' },
      slots: { default: '<button class="ui-btn" value="a">A</button><button class="ui-btn" value="b">B</button>' }
    })
    expect(w.attributes('role')).toBe('group')
    expect(w.attributes('aria-label')).toBe('actions')
    expect(w.findAll('button').length).toBe(2)
  })

  it('emits click with value attribute of the clicked .ui-btn', async () => {
    const w = mount(WkButtonGroup, {
      slots: { default: '<button class="ui-btn" value="save">Save</button>' }
    })
    await w.find('button').trigger('click')
    const evt = w.emitted('click')
    expect(evt).toBeTruthy()
    expect(evt[0][0]).toBe('save')
  })

  it('falls back to textContent when value attr is absent', async () => {
    const w = mount(WkButtonGroup, {
      slots: { default: '<button class="ui-btn">Cancel</button>' }
    })
    await w.find('button').trigger('click')
    expect(w.emitted('click')[0][0]).toBe('Cancel')
  })

  it('ignores clicks outside .ui-btn', async () => {
    const w = mount(WkButtonGroup, {
      slots: { default: '<div class="not-a-button">x</div>' }
    })
    await w.find('.not-a-button').trigger('click')
    expect(w.emitted('click')).toBeFalsy()
  })
})
