import WkSwitch from '../../src/components/switch/Switch.vue'

export default {
  title: 'Components/Forms/Switch',
  component: WkSwitch,
  argTypes: {
    value: { control: 'boolean' },
    disabled: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'WkToggle switch rendered as a `<button role="switch">`. Use `:value` + `@change` (Vue 2 / Vue 3 compatible). ' +
          'Emits `change` and `input` with the new boolean state on click.'
      }
    }
  }
}

const Template = args => ({
  components: { WkSwitch },
  setup() {
    return { args }
  },
  template: `<WkSwitch v-bind="args" />`
})

export const Primary = Template.bind({})
Primary.args = { value: false, disabled: false }

export const AllStates = () => ({
  components: { WkSwitch },
  template: `
    <table style="border-collapse:separate;border-spacing:20px;">
      <thead>
        <tr>
          <th></th>
          <th style="color:#6b7280;font-size:12px;font-weight:500;">Off</th>
          <th style="color:#6b7280;font-size:12px;font-weight:500;">On</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="color:#6b7280;font-size:12px;white-space:nowrap;">Enabled</td>
          <td><WkSwitch :value="false" /></td>
          <td><WkSwitch :value="true" /></td>
        </tr>
        <tr>
          <td style="color:#6b7280;font-size:12px;white-space:nowrap;">Disabled</td>
          <td><WkSwitch :value="false" disabled /></td>
          <td><WkSwitch :value="true" disabled /></td>
        </tr>
      </tbody>
    </table>
  `
})
AllStates.parameters = {
  docs: { description: { story: 'All on/off × enabled/disabled combinations.' } }
}

export const Interactive = () => ({
  components: { WkSwitch },
  data() {
    return { on: false }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <WkSwitch :value="on" @change="on = $event" />
      <code style="font-size:13px;">value = {{ on }}</code>
    </div>
  `
})
Interactive.parameters = {
  docs: { description: { story: 'Click to toggle. Uses `:value` + `@change` binding.' } }
}

export const FocusVisible = () => ({
  components: { WkSwitch },
  template: `
    <div style="display:flex;gap:16px;align-items:center;">
      <WkSwitch :value="false" />
      <WkSwitch :value="true" />
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab to each switch to verify `:focus-visible` ring.' } }
}
