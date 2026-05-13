import WkRadio from '../../src/components/radio/Radio.vue'
import WkRadioGroup from '../../src/components/radio-group/RadioGroup.vue'

export default {
  title: 'Forms/Radio',
  component: WkRadio,
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    label: { control: 'text' },
    value: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Single radio button. Designed to be used standalone with `:checked` binding or inside a `WkRadioGroup` ' +
          'which provides group context (selected value, disabled, error) via `provide/inject`. ' +
          'Use `WkRadioGroup` for multi-option sets and `v-model`.'
      }
    }
  }
}

const Template = args => ({
  components: { WkRadio, WkRadioGroup },
  setup() {
    return { args }
  },
  template: `
    <WkRadioGroup value="">
      <WkRadio v-bind="args" />
    </WkRadioGroup>
  `
})

export const Primary = Template.bind({})
Primary.args = { value: 'a', label: 'Option A', checked: false }

export const AllStates = () => ({
  components: { WkRadio, WkRadioGroup },
  template: `
    <table style="border-collapse:separate;border-spacing:16px;">
      <thead>
        <tr>
          <th></th>
          <th style="color:#6b7280;font-size:12px;font-weight:500;">Default</th>
          <th style="color:#6b7280;font-size:12px;font-weight:500;">Error</th>
          <th style="color:#6b7280;font-size:12px;font-weight:500;">Disabled</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="color:#6b7280;font-size:12px;white-space:nowrap;">Unchecked</td>
          <td><WkRadioGroup value=""><WkRadio value="a" label="Label" /></WkRadioGroup></td>
          <td><WkRadioGroup value="" error><WkRadio value="a" label="Label" /></WkRadioGroup></td>
          <td><WkRadioGroup value="" disabled><WkRadio value="a" label="Label" /></WkRadioGroup></td>
        </tr>
        <tr>
          <td style="color:#6b7280;font-size:12px;white-space:nowrap;">Checked</td>
          <td><WkRadioGroup value="a"><WkRadio value="a" label="Label" /></WkRadioGroup></td>
          <td><WkRadioGroup value="a" error><WkRadio value="a" label="Label" /></WkRadioGroup></td>
          <td><WkRadioGroup value="a" disabled><WkRadio value="a" label="Label" /></WkRadioGroup></td>
        </tr>
      </tbody>
    </table>
  `
})
AllStates.parameters = {
  docs: { description: { story: 'All state combinations: checked × default/error/disabled.' } }
}

export const FocusVisible = () => ({
  components: { WkRadio, WkRadioGroup },
  template: `
    <WkRadioGroup value="b" style="display:flex;gap:16px;">
      <WkRadio value="a" label="Option A" />
      <WkRadio value="b" label="Option B" />
      <WkRadio value="c" label="Option C" />
    </WkRadioGroup>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through to verify `:focus-visible` ring on each radio input.' } }
}
