import WkRichSwitchGroup from '../../src/components/rich-switch-group/RichSwitchGroup.vue'

export default {
  title: 'Components/Forms/RichSwitchGroup',
  component: WkRichSwitchGroup,
  argTypes: {
    value: { control: 'boolean' },
    disabled: { control: 'boolean' },
    flipped: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'WkSwitch row with a label and optional description. `flipped` moves the switch to the right side. ' +
          'Supports `:value` + `@change`, `disabled`, and a `#description` slot.'
      }
    }
  }
}

const Template = args => ({
  components: { WkRichSwitchGroup },
  setup() {
    return { args }
  },
  template: `<div style="width:320px;"><WkRichSwitchGroup v-bind="args" /></div>`
})

export const Primary = Template.bind({})
Primary.args = {
  label: 'Email notifications',
  description: 'Receive product updates and announcements.',
  value: false
}

export const AllVariants = () => ({
  components: { WkRichSwitchGroup },
  template: `
    <div style="display:flex;flex-direction:column;gap:24px;align-items:flex-start;">
      <div style="display:flex;flex-direction:column;gap:8px;">
        <span style="color:#6b7280;font-size:12px;">flipped: false</span>
        <div style="display:flex;flex-direction:column;gap:8px;width:320px;">
          <WkRichSwitchGroup label="Off" :value="false" />
          <WkRichSwitchGroup label="On" :value="true" />
          <WkRichSwitchGroup label="Disabled off" :value="false" disabled />
          <WkRichSwitchGroup label="Disabled on" :value="true" disabled />
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <span style="color:#6b7280;font-size:12px;">flipped: true</span>
        <div style="display:flex;flex-direction:column;gap:8px;width:320px;">
          <WkRichSwitchGroup flipped label="Off" :value="false" />
          <WkRichSwitchGroup flipped label="On" :value="true" />
          <WkRichSwitchGroup flipped label="Disabled" :value="false" disabled />
        </div>
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'All state combinations for both `flipped: false` and `flipped: true`.' } }
}

export const WithDescription = () => ({
  components: { WkRichSwitchGroup },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;width:320px;">
      <WkRichSwitchGroup
        :value="true"
        label="Marketing emails"
        description="Receive our monthly newsletter and product updates."
      />
      <WkRichSwitchGroup
        :value="false"
        label="Push notifications"
        description="Real-time alerts sent to your device."
      />
      <WkRichSwitchGroup flipped :value="true" label="Flipped + description">
        <template #description>Custom <strong>slot</strong> content in the description.</template>
      </WkRichSwitchGroup>
    </div>
  `
})
WithDescription.parameters = {
  docs: {
    description: {
      story: 'The `description` prop or `#description` slot adds a secondary line. Both work with `flipped`.'
    }
  }
}

export const Interactive = () => ({
  components: { WkRichSwitchGroup },
  data() {
    return { marketing: true, push: false }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;width:320px;">
      <WkRichSwitchGroup
        :value="marketing"
        label="Marketing emails"
        description="Monthly newsletters and product updates."
        @change="marketing = $event"
      />
      <WkRichSwitchGroup
        :value="push"
        label="Push notifications"
        description="Real-time alerts on your device."
        @change="push = $event"
      />
      <code style="font-size:13px;margin-top:4px;">
        marketing = {{ marketing }} | push = {{ push }}
      </code>
    </div>
  `
})
Interactive.parameters = {
  docs: { description: { story: 'Click a row to toggle. Both use `:value` + `@change` independently.' } }
}

export const FocusVisible = () => ({
  components: { WkRichSwitchGroup },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;width:320px;">
      <WkRichSwitchGroup label="Tab to me" description="Focus ring should appear on the switch." />
      <WkRichSwitchGroup :value="true" label="And here" description="On state + focus ring." />
      <WkRichSwitchGroup flipped label="Flipped — Tab here too" description="WkSwitch on right side." />
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through all rows to verify `:focus-visible` ring on the switch.' } }
}
