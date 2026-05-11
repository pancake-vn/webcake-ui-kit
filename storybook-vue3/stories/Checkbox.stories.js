import Checkbox from '../../src/components/checkbox/Checkbox.vue'

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Native checkbox abstraction. Renders a `<span>` wrapper containing a hidden `<input type="checkbox">` ' +
          'and a styled box. Supports `checked` / `v-model`, `error`, and `disabled` states. ' +
          '`$attrs` are forwarded to the `<input>` element.'
      }
    }
  }
}

const Template = args => ({
  components: { Checkbox },
  setup() {
    return { args }
  },
  template: `<Checkbox v-model="args.checked" />`
})

export const Primary = Template.bind({})
Primary.args = { checked: false }

export const AllStates = () => ({
  components: { Checkbox },
  template: `
    <table style="border-collapse:separate; border-spacing:16px;">
      <thead>
        <tr>
          <th></th>
          <th style="color:#6b7280; font-size:12px; font-weight:500;">Default</th>
          <th style="color:#6b7280; font-size:12px; font-weight:500;">Error</th>
          <th style="color:#6b7280; font-size:12px; font-weight:500;">Disabled</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="color:#6b7280; font-size:12px; white-space:nowrap;">Unchecked</td>
          <td><Checkbox /></td>
          <td><Checkbox error /></td>
          <td><Checkbox disabled /></td>
        </tr>
        <tr>
          <td style="color:#6b7280; font-size:12px; white-space:nowrap;">Checked</td>
          <td><Checkbox :checked="true" /></td>
          <td><Checkbox :checked="true" error /></td>
          <td><Checkbox :checked="true" disabled /></td>
        </tr>
      </tbody>
    </table>
  `
})
AllStates.parameters = {
  docs: { description: { story: 'All state combinations: checked × error × disabled.' } }
}

export const Interactive = () => ({
  components: { Checkbox },
  data() {
    return { value: false }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
      <Checkbox v-model="value" />
      <code style="font-size:13px;">v-model = {{ value }}</code>
    </div>
  `
})
Interactive.parameters = {
  docs: { description: { story: 'Click the checkbox to toggle. `v-model` reflects the current state.' } }
}

export const FocusVisible = () => ({
  components: { Checkbox },
  template: `
    <div style="display:flex; gap:16px; align-items:center;">
      <Checkbox />
      <Checkbox :checked="true" />
      <Checkbox error />
      <Checkbox :checked="true" error />
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through checkboxes to verify the `:focus-visible` ring on the box.' } }
}
