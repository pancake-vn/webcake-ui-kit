import CheckboxGroup from '../../src/components/checkbox-group/CheckboxGroup.vue'

const LAYOUTS = ['inline', 'block']

export default {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  argTypes: {
    layout: { control: { type: 'inline-radio' }, options: LAYOUTS },
    checked: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Checkbox with an attached label. Renders a `<label>` so clicking the text toggles the checkbox. ' +
          '`layout="inline"` (default) places label on the right; `layout="block"` stretches to full width ' +
          'for use in stacked lists. Supports `v-model`, `error`, and `disabled`.'
      }
    }
  }
}

const Template = args => ({
  components: { CheckboxGroup },
  setup() {
    return { args }
  },
  template: `<CheckboxGroup v-bind="args" />`
})

export const Primary = Template.bind({})
Primary.args = { label: 'Accept terms and conditions', layout: 'inline' }

export const AllVariants = () => ({
  components: { CheckboxGroup },
  template: `
    <div style="display:flex; flex-direction:column; gap:24px; align-items:flex-start;">
      <div style="display:flex; flex-direction:column; gap:8px;">
        <span style="color:#6b7280; font-size:12px;">layout: inline</span>
        <div style="display:flex; gap:24px; flex-wrap:wrap; align-items:center;">
          <CheckboxGroup layout="inline" label="Unchecked" />
          <CheckboxGroup layout="inline" :checked="true" label="Checked" />
          <CheckboxGroup layout="inline" error label="Error" />
          <CheckboxGroup layout="inline" disabled label="Disabled" />
          <CheckboxGroup layout="inline" :checked="true" disabled label="Checked + disabled" />
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px; width:280px;">
        <span style="color:#6b7280; font-size:12px;">layout: block</span>
        <CheckboxGroup layout="block" label="Unchecked" />
        <CheckboxGroup layout="block" :checked="true" label="Checked" />
        <CheckboxGroup layout="block" error label="Error" />
        <CheckboxGroup layout="block" disabled label="Disabled" />
        <CheckboxGroup layout="block" :checked="true" disabled label="Checked + disabled" />
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'Both layout values across all state combinations.' } }
}

export const MultipleItems = () => ({
  components: { CheckboxGroup },
  data() {
    return {
      options: [
        { value: 'apples', label: 'Apples', checked: true },
        { value: 'bananas', label: 'Bananas', checked: false },
        { value: 'cherries', label: 'Cherries', checked: false },
        { value: 'dates', label: 'Dates', checked: true }
      ]
    }
  },
  computed: {
    selected() {
      return (
        this.options
          .filter(o => o.checked)
          .map(o => o.label)
          .join(', ') || '(none)'
      )
    }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-start; width:240px;">
      <CheckboxGroup
        v-for="opt in options"
        :key="opt.value"
        v-model="opt.checked"
        layout="block"
        :label="opt.label"
      />
      <code style="font-size:13px; margin-top:8px;">selected = {{ selected }}</code>
    </div>
  `
})
MultipleItems.parameters = {
  docs: { description: { story: 'Typical checklist pattern using `layout="block"` with `v-model` on each item.' } }
}

export const WithSlot = () => ({
  components: { CheckboxGroup },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start; width:280px;">
      <CheckboxGroup layout="block">
        <span>Subscribe to <strong>product updates</strong></span>
      </CheckboxGroup>
      <CheckboxGroup layout="block" :checked="true">
        <span style="color:var(--muted-fg); font-size:12px;">Default slot overrides the <code>label</code> prop</span>
      </CheckboxGroup>
    </div>
  `
})
WithSlot.parameters = {
  docs: { description: { story: 'Default slot overrides the `label` prop for rich label content.' } }
}

export const FocusVisible = () => ({
  components: { CheckboxGroup },
  template: `
    <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-start; width:240px;">
      <CheckboxGroup layout="block" label="Tab to me — focus ring" />
      <CheckboxGroup layout="block" :checked="true" label="Also tab here" />
      <CheckboxGroup layout="block" error label="Error + focus" />
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through to verify `:focus-visible` ring on the checkbox box.' } }
}
