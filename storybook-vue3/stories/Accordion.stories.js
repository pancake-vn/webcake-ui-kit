import Accordion from '../../src/components/accordion/Accordion.vue'
import AccordionItem from '../../src/components/accordion-item/AccordionItem.vue'

export default {
  title: 'Components/Accordion',
  component: Accordion,
  subcomponents: { AccordionItem },
  argTypes: {
    bordered: { control: 'boolean' },
    type: { control: { type: 'inline-radio' }, options: ['single', 'multiple'] }
  },
  parameters: {
    docs: {
      description: {
        component:
          'A vertically stacked set of interactive headings that each reveal a section of content. ' +
          'Compose with `Accordion` (root) and `AccordionItem` (each row). ' +
          'Two visual variants: line (default, divider between items) and bordered (rounded outer border). ' +
          'Two open modes: `single` (only one open at a time) and `multiple` (any number open).'
      }
    }
  }
}

const PRODUCT_BODY =
  'Our flagship product combines cutting-edge technology with sleek design. ' +
  'Built with premium materials, it offers unparalleled performance and reliability.'

const Template = args => ({
  components: { Accordion, AccordionItem },
  data() {
    return { open: args.type === 'multiple' ? [] : null }
  },
  computed: {
    bound() {
      return args
    }
  },
  template: `
    <div style="width: 360px">
      <Accordion v-model="open" v-bind="bound">
        <AccordionItem value="general" label="Label">
          <p style="margin: 0">${PRODUCT_BODY}</p>
        </AccordionItem>
        <AccordionItem value="shipping" label="Shipping Details">
          <p style="margin: 0">Free shipping on orders over $50.</p>
        </AccordionItem>
        <AccordionItem value="returns" label="Return Policy">
          <p style="margin: 0">30-day return window.</p>
        </AccordionItem>
      </Accordion>
    </div>
  `
})

export const Primary = Template.bind({})
Primary.args = { type: 'single', bordered: false }

export const Bordered = Template.bind({})
Bordered.args = { type: 'single', bordered: true }

export const Multiple = Template.bind({})
Multiple.args = { type: 'multiple', bordered: false }

export const BorderedMultiple = Template.bind({})
BorderedMultiple.args = { type: 'multiple', bordered: true }

export const WithBadgeAndAppend = () => ({
  components: { Accordion, AccordionItem },
  data() {
    return { open: 'info' }
  },
  template: `
    <div style="width: 360px">
      <Accordion v-model="open" bordered :multiple="type==='multiple'">
        <AccordionItem value="info" label="Product Information" badge="32">
          <p style="margin: 0">${PRODUCT_BODY}</p>
        </AccordionItem>
        <AccordionItem value="ship" label="Shipping Details" append="Append">
          <p style="margin: 0">Standard shipping is 3-5 business days.</p>
        </AccordionItem>
        <AccordionItem value="ret" label="Return Policy" badge="Label">
          <p style="margin: 0">30-day return window.</p>
        </AccordionItem>
      </Accordion>
    </div>
  `
})

export const LongLabels = () => ({
  components: { Accordion, AccordionItem },
  data() {
    return { open: null }
  },
  template: `
    <div style="width: 360px">
      <Accordion v-model="open" bordered>
        <AccordionItem
          value="x"
          label="What are the key considerations when implementing a comprehensive enterprise-level authentication system?"
        >
          <p style="margin: 0">Detailed answer to the above.</p>
        </AccordionItem>
        <AccordionItem
          value="y"
          label="How does modern distributed system architecture handle eventual consistency and data synchronization across multiple regions?"
        >
          <p style="margin: 0">Through careful design and well-chosen consistency models.</p>
        </AccordionItem>
      </Accordion>
    </div>
  `
})

export const DefaultOpen = () => ({
  components: { Accordion, AccordionItem },
  template: `
    <div style="width: 360px">
      <Accordion bordered default-open="b">
        <AccordionItem value="a" label="First item" />
        <AccordionItem value="b" label="Second item (open by default)">
          <p style="margin: 0">This was opened on mount via the default-open prop.</p>
        </AccordionItem>
        <AccordionItem value="c" label="Third item" />
      </Accordion>
    </div>
  `
})

export const Disabled = () => ({
  components: { Accordion, AccordionItem },
  template: `
    <div style="width: 360px">
      <Accordion bordered>
        <AccordionItem value="a" label="Enabled item" />
        <AccordionItem value="b" label="Disabled item — cannot toggle" disabled />
        <AccordionItem value="c" label="Another enabled item" />
      </Accordion>
    </div>
  `
})

export const FocusVisible = () => ({
  components: { Accordion, AccordionItem },
  template: `
    <div style="width: 360px">
      <Accordion>
        <AccordionItem value="a" label="Tab to focus this trigger" />
        <AccordionItem value="b" label="Then this one" />
        <AccordionItem value="c" label="And this one" />
      </Accordion>
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through the triggers to verify the focus ring on each.' } }
}

export const CustomSlots = () => ({
  components: { Accordion, AccordionItem },
  template: `
    <div style="width: 360px">
      <Accordion bordered>
        <AccordionItem value="a">
          <template #label><strong>Custom label slot</strong></template>
          <template #badge><span style="color: var(--info-500)">NEW</span></template>
          <p style="margin: 0">Override label and badge with named slots for full styling control.</p>
        </AccordionItem>
        <AccordionItem value="b" label="Plain label">
          <p style="margin: 0">Mix and match — some items can use props, others can use slots.</p>
        </AccordionItem>
      </Accordion>
    </div>
  `
})
