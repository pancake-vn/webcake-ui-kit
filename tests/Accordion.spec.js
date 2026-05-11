import { Accordion, AccordionItem } from '../src/index.js'
import { mount } from './_utils.js'

const Harness = {
  components: { Accordion, AccordionItem },
  props: ['value', 'multiple', 'defaultOpen', 'bordered'],
  template: `
    <Accordion :value="value" :multiple="multiple" :default-open="defaultOpen || []" :bordered="!!bordered" @change="onChange">
      <AccordionItem value="a" label="A">body-a</AccordionItem>
      <AccordionItem value="b" label="B">body-b</AccordionItem>
      <AccordionItem value="c" label="C" disabled>body-c</AccordionItem>
    </Accordion>
  `,
  emits: ['change'],
  methods: {
    onChange(v) {
      this.$emit('change', v)
    }
  }
}

describe('Accordion + AccordionItem', () => {
  it('renders all items with collapsed content', () => {
    const w = mount(Harness, { props: {} })
    expect(w.findAll('.ui-accordion-item').length).toBe(3)
    const triggers = w.findAll('.ui-accordion-item__trigger')
    triggers.forEach(t => expect(t.attributes('aria-expanded')).toBe('false'))
  })

  it('opens the item matching defaultOpen', () => {
    const w = mount(Harness, { props: { defaultOpen: ['a'] } })
    const items = w.findAll('.ui-accordion-item')
    expect(items[0].classes()).toContain('ui-accordion-item--open')
    expect(items[1].classes()).not.toContain('ui-accordion-item--open')
  })

  it('toggles an item open on trigger click (single mode)', async () => {
    const w = mount(Harness, { props: {} })
    await w.findAll('.ui-accordion-item__trigger')[0].trigger('click')
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBe('a')
  })

  it('only one item open at a time in single mode', async () => {
    const w = mount(Harness, { props: { defaultOpen: ['a'] } })
    await w.findAll('.ui-accordion-item__trigger')[1].trigger('click')
    expect(w.emitted('change')[0][0]).toBe('b')
  })

  it('keeps multiple open in multiple mode', async () => {
    const w = mount(Harness, { props: { defaultOpen: ['a'], multiple: true } })
    await w.findAll('.ui-accordion-item__trigger')[1].trigger('click')
    expect(w.emitted('change')[0][0]).toEqual(['a', 'b'])
  })

  it('does not toggle a disabled item', async () => {
    const w = mount(Harness, { props: {} })
    await w.findAll('.ui-accordion-item__trigger')[2].trigger('click')
    expect(w.emitted('change')).toBeFalsy()
  })

  it('propagates bordered to items', () => {
    const w = mount(Harness, { props: { bordered: true } })
    expect(w.find('.ui-accordion').classes()).toContain('ui-accordion--bordered')
    expect(w.findAll('.ui-accordion-item')[0].classes()).toContain('ui-accordion-item--bordered')
  })
})
