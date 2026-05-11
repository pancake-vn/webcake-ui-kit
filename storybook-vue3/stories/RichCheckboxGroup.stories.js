import RichCheckboxGroup from '../../src/components/rich-checkbox-group/RichCheckboxGroup.vue'

export default {
  title: 'Components/RichCheckboxGroup',
  component: RichCheckboxGroup,
  argTypes: {
    checked: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    flipped: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Rich checkbox with a label and optional description line. Wraps `Checkbox` in a `<label>` so the ' +
          'entire row is clickable. `flipped` moves the checkbox to the right. ' +
          'Supports `v-model`, `error`, `disabled`, and a `#description` slot.'
      }
    }
  }
}

const Template = args => ({
  components: { RichCheckboxGroup },
  setup() {
    return { args }
  },
  template: `<div style="width:320px;"><RichCheckboxGroup v-bind="args" /></div>`
})

export const Primary = Template.bind({})
Primary.args = {
  label: 'Email notifications',
  description: 'Receive product updates and announcements.',
  checked: false
}

export const AllVariants = () => ({
  components: { RichCheckboxGroup },
  template: `
    <div style="display:flex; flex-direction:column; gap:24px; align-items:flex-start;">
      <div style="display:flex; flex-direction:column; gap:8px;">
        <span style="color:#6b7280; font-size:12px;">flipped: false</span>
        <div style="display:flex; flex-direction:column; gap:8px; width:320px;">
          <RichCheckboxGroup label="Unchecked" />
          <RichCheckboxGroup :checked="true" label="Checked" />
          <RichCheckboxGroup error label="Error" />
          <RichCheckboxGroup disabled label="Disabled" />
          <RichCheckboxGroup :checked="true" disabled label="Checked + disabled" />
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <span style="color:#6b7280; font-size:12px;">flipped: true</span>
        <div style="display:flex; flex-direction:column; gap:8px; width:320px;">
          <RichCheckboxGroup flipped label="Unchecked" />
          <RichCheckboxGroup flipped :checked="true" label="Checked" />
          <RichCheckboxGroup flipped error label="Error" />
          <RichCheckboxGroup flipped disabled label="Disabled" />
          <RichCheckboxGroup flipped :checked="true" disabled label="Checked + disabled" />
        </div>
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'All state combinations for both `flipped: false` and `flipped: true`.' } }
}

export const WithDescription = () => ({
  components: { RichCheckboxGroup },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; width:320px;">
      <RichCheckboxGroup
        :checked="true"
        label="Marketing emails"
        description="Receive our monthly newsletter and product updates."
      />
      <RichCheckboxGroup
        label="Push notifications"
        description="Real-time alerts sent to your device."
      />
      <RichCheckboxGroup flipped :checked="true" label="Flipped + description">
        <template #description>Custom <strong>slot</strong> content in the description.</template>
      </RichCheckboxGroup>
    </div>
  `
})
WithDescription.parameters = {
  docs: {
    description: {
      story:
        'The `description` prop or `#description` slot adds a secondary line below the label. ' +
        'Both work with `flipped` layout.'
    }
  }
}

export const Interactive = () => ({
  components: { RichCheckboxGroup },
  data() {
    return { marketing: true, push: false }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:8px; width:320px;">
      <RichCheckboxGroup
        v-model="marketing"
        label="Marketing emails"
        description="Monthly newsletters and product updates."
      />
      <RichCheckboxGroup
        v-model="push"
        label="Push notifications"
        description="Real-time alerts on your device."
      />
      <code style="font-size:13px; margin-top:4px;">
        marketing = {{ marketing }} | push = {{ push }}
      </code>
    </div>
  `
})
Interactive.parameters = {
  docs: { description: { story: 'Click a row to toggle. Both use `v-model` independently.' } }
}

export const FocusVisible = () => ({
  components: { RichCheckboxGroup },
  template: `
    <div style="display:flex; flex-direction:column; gap:8px; width:320px;">
      <RichCheckboxGroup label="Tab to me" description="Focus ring should appear on the checkbox box." />
      <RichCheckboxGroup :checked="true" label="And here" description="Checked state + focus ring." />
      <RichCheckboxGroup flipped label="Flipped — Tab here too" description="Focus ring on right-side box." />
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through all rows to verify `:focus-visible` ring on the checkbox.' } }
}
