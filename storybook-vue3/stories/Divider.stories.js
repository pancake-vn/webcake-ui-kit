import WkDivider from '../../src/components/divider/Divider.vue'

export default {
  title: 'Components/Display/Divider',
  component: WkDivider,
  argTypes: {
    direction: { control: { type: 'inline-radio' }, options: ['horizontal', 'vertical'] },
    spacing: { control: { type: 'inline-radio' }, options: ['none', 'regular', 'spacious'] }
  },
  parameters: {
    docs: {
      description: {
        component: 'Visual separator line. `direction` controls orientation; `spacing` adds margin on both sides.'
      }
    }
  }
}

const Template = args => ({
  components: { WkDivider },
  setup() {
    return { args }
  },
  template: `<div style="width:240px;height:64px;display:flex;align-items:center;"><WkDivider v-bind="args" /></div>`
})

export const Primary = Template.bind({})
Primary.args = { direction: 'horizontal', spacing: 'none' }

export const AllVariants = () => ({
  components: { WkDivider },
  template: `
    <div style="display:flex;flex-direction:column;gap:32px;align-items:flex-start;width:320px;">
      <div style="display:flex;flex-direction:column;gap:8px;width:100%;">
        <span style="color:#6b7280;font-size:12px;">horizontal — spacing</span>
        <div style="display:flex;flex-direction:column;gap:0;width:100%;">
          <span style="color:#6b7280;font-size:11px;margin-bottom:4px;">none</span>
          <WkDivider direction="horizontal" spacing="none" />
          <span style="color:#6b7280;font-size:11px;margin-top:12px;margin-bottom:4px;">regular</span>
          <WkDivider direction="horizontal" spacing="regular" />
          <span style="color:#6b7280;font-size:11px;margin-top:12px;margin-bottom:4px;">spacious</span>
          <WkDivider direction="horizontal" spacing="spacious" />
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <span style="color:#6b7280;font-size:12px;">vertical</span>
        <div style="display:flex;align-items:center;height:32px;gap:8px;">
          <span style="font-size:13px;">Left</span>
          <WkDivider direction="vertical" spacing="none" />
          <span style="font-size:13px;">Right</span>
        </div>
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'All spacing values for horizontal, plus vertical orientation.' } }
}
