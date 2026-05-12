import WkAccordion from '../../src/components/accordion/Accordion.vue'
import WkAccordionItem from '../../src/components/accordion-item/AccordionItem.vue'

export default {
  title: 'Components/Accordion',
  component: WkAccordion,
  subcomponents: { WkAccordionItem },
  argTypes: {
    bordered: { control: 'boolean' },
    type: { control: { type: 'inline-radio' }, options: ['single', 'multiple'] }
  },
  parameters: {
    docs: {
      description: {
        component:
          'A vertically stacked set of interactive headings that each reveal a section of content. ' +
          'Compose with `WkAccordion` (root) and `WkAccordionItem` (each row). ' +
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
  components: { WkAccordion, WkAccordionItem },
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
      <WkAccordion v-model="open" v-bind="bound">
        <WkAccordionItem value="general" label="Label">
          <p style="margin: 0">${PRODUCT_BODY}</p>
        </WkAccordionItem>
        <WkAccordionItem value="shipping" label="Shipping Details">
          <p style="margin: 0">Free shipping on orders over $50.</p>
        </WkAccordionItem>
        <WkAccordionItem value="returns" label="Return Policy">
          <p style="margin: 0">30-day return window.</p>
        </WkAccordionItem>
      </WkAccordion>
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
  components: { WkAccordion, WkAccordionItem },
  data() {
    return { open: 'info' }
  },
  template: `
    <div style="width: 360px">
      <WkAccordion v-model="open" bordered :multiple="type==='multiple'">
        <WkAccordionItem value="info" label="Product Information" badge="32">
          <p style="margin: 0">${PRODUCT_BODY}</p>
        </WkAccordionItem>
        <WkAccordionItem value="ship" label="Shipping Details" append="Append">
          <p style="margin: 0">Standard shipping is 3-5 business days.</p>
        </WkAccordionItem>
        <WkAccordionItem value="ret" label="Return Policy" badge="Label">
          <p style="margin: 0">30-day return window.</p>
        </WkAccordionItem>
      </WkAccordion>
    </div>
  `
})

export const LongLabels = () => ({
  components: { WkAccordion, WkAccordionItem },
  data() {
    return { open: null }
  },
  template: `
    <div style="width: 360px">
      <WkAccordion v-model="open" bordered>
        <WkAccordionItem
          value="x"
          label="What are the key considerations when implementing a comprehensive enterprise-level authentication system?"
        >
          <p style="margin: 0">Detailed answer to the above.</p>
        </WkAccordionItem>
        <WkAccordionItem
          value="y"
          label="How does modern distributed system architecture handle eventual consistency and data synchronization across multiple regions?"
        >
          <p style="margin: 0">Through careful design and well-chosen consistency models.</p>
        </WkAccordionItem>
      </WkAccordion>
    </div>
  `
})

export const DefaultOpen = () => ({
  components: { WkAccordion, WkAccordionItem },
  template: `
    <div style="width: 360px">
      <WkAccordion bordered default-open="b">
        <WkAccordionItem value="a" label="First item" />
        <WkAccordionItem value="b" label="Second item (open by default)">
          <p style="margin: 0">This was opened on mount via the default-open prop.</p>
        </WkAccordionItem>
        <WkAccordionItem value="c" label="Third item" />
      </WkAccordion>
    </div>
  `
})

export const Disabled = () => ({
  components: { WkAccordion, WkAccordionItem },
  template: `
    <div style="width: 360px">
      <WkAccordion bordered>
        <WkAccordionItem value="a" label="Enabled item" />
        <WkAccordionItem value="b" label="Disabled item — cannot toggle" disabled />
        <WkAccordionItem value="c" label="Another enabled item" />
      </WkAccordion>
    </div>
  `
})

export const FocusVisible = () => ({
  components: { WkAccordion, WkAccordionItem },
  template: `
    <div style="width: 360px">
      <WkAccordion>
        <WkAccordionItem value="a" label="Tab to focus this trigger" />
        <WkAccordionItem value="b" label="Then this one" />
        <WkAccordionItem value="c" label="And this one" />
      </WkAccordion>
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through the triggers to verify the focus ring on each.' } }
}

export const CustomSlots = () => ({
  components: { WkAccordion, WkAccordionItem },
  template: `
    <div style="width: 360px">
      <WkAccordion bordered>
        <WkAccordionItem value="a">
          <template #label><strong>Custom label slot</strong></template>
          <template #badge><span style="color: var(--info-500)">NEW</span></template>
          <p style="margin: 0">Override label and badge with named slots for full styling control.</p>
        </WkAccordionItem>
        <WkAccordionItem value="b" label="Plain label">
          <p style="margin: 0">Mix and match — some items can use props, others can use slots.</p>
        </WkAccordionItem>
      </WkAccordion>
    </div>
  `
})
