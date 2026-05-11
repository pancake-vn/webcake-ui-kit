import { Toggle, ToggleGroup } from '../src/index.js'
import { mount } from './_utils.js'

const Harness = {
  components: { ToggleGroup, Toggle },
  props: ['value', 'multiple'],
  template: `
    <ToggleGroup :value="value" :multiple="multiple" @change="onChange">
      <Toggle value="a" label="A" />
      <Toggle value="b" label="B" />
      <Toggle value="c" label="C" />
    </ToggleGroup>
  `,
  methods: {
    onChange(v) {
      this.$emit('change', v)
    }
  },
  emits: ['change']
}

describe('ToggleGroup', () => {
  it('renders all children with role=group', () => {
    const w = mount(Harness, { props: { value: null } })
    expect(w.find('.ui-toggle-group').exists()).toBe(true)
    expect(w.find('[role="group"]').exists()).toBe(true)
    expect(w.findAll('.ui-toggle').length).toBe(3)
  })

  it('marks the selected child as active', () => {
    const w = mount(Harness, { props: { value: 'b' } })
    const buttons = w.findAll('.ui-toggle')
    expect(buttons[0].classes()).not.toContain('ui-toggle--active')
    expect(buttons[1].classes()).toContain('ui-toggle--active')
  })

  it('selects on child click (single mode)', async () => {
    const w = mount(Harness, { props: { value: null } })
    await w.findAll('.ui-toggle')[0].trigger('click')
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBe('a')
  })

  it('deselects on second click of same value (single mode)', async () => {
    const w = mount(Harness, { props: { value: 'a' } })
    await w.findAll('.ui-toggle')[0].trigger('click')
    expect(w.emitted('change')[0][0]).toBe(null)
  })

  it('supports multiple selection', async () => {
    const w = mount(Harness, { props: { value: [], multiple: true } })
    await w.findAll('.ui-toggle')[0].trigger('click')
    expect(w.emitted('change')[0][0]).toEqual(['a'])
  })
})
