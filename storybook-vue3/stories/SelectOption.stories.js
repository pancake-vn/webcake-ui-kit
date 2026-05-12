import WkSelect from '../../src/components/select/Select.vue'
import WkSelectOption from '../../src/components/select-option/SelectOption.vue'

export default {
  title: 'Components/Forms/SelectOption',
  component: WkSelectOption,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['regular', 'large'] },
    variant: { control: { type: 'inline-radio' }, options: ['default', 'destructive'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    value: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'An item inside a `WkSelect` dropdown. Typically rendered automatically from the `options` prop, ' +
          'but can be used explicitly via the default slot of `WkSelect` for custom layouts. ' +
          '`variant="destructive"` applies danger styling. `size="large"` increases row height.'
      }
    }
  }
}

export const AllStates = () => ({
  components: { WkSelect, WkSelectOption },
  data() {
    return { selected: 'apple' }
  },
  template: `
    <div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;">
      <div style="display:flex;flex-direction:column;gap:8px;">
        <span style="color:#6b7280;font-size:12px;">size: regular</span>
        <WkSelect :value="selected" style="width:200px;" @change="selected = $event">
          <WkSelectOption value="apple" label="Apple" />
          <WkSelectOption value="banana" label="Banana" />
          <WkSelectOption value="cherry" label="Cherry (disabled)" disabled />
          <WkSelectOption value="delete" label="Delete item" variant="destructive" />
        </WkSelect>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <span style="color:#6b7280;font-size:12px;">size: large</span>
        <WkSelect value="apple" style="width:200px;">
          <WkSelectOption value="apple" label="Apple" size="large" />
          <WkSelectOption value="banana" label="Banana" size="large" />
          <WkSelectOption value="delete" label="Delete item" size="large" variant="destructive" />
        </WkSelect>
      </div>
    </div>
  `
})
AllStates.parameters = {
  docs: {
    description: {
      story:
        'Click the WkSelect trigger to open the dropdown and see all `WkSelectOption` variants: ' +
        'default, disabled, destructive, and both sizes.'
    }
  }
}

export const WithSlot = () => ({
  components: { WkSelect, WkSelectOption },
  data() {
    return { selected: 'vue' }
  },
  template: `
    <WkSelect :value="selected" style="width:220px;" @change="selected = $event">
      <WkSelectOption value="vue">
        <span style="display:flex;align-items:center;gap:8px;">
          <span style="width:8px;height:8px;border-radius:50%;background:#42b883;display:inline-block;"></span>
          Vue
        </span>
      </WkSelectOption>
      <WkSelectOption value="react">
        <span style="display:flex;align-items:center;gap:8px;">
          <span style="width:8px;height:8px;border-radius:50%;background:#61dafb;display:inline-block;"></span>
          React
        </span>
      </WkSelectOption>
      <WkSelectOption value="svelte">
        <span style="display:flex;align-items:center;gap:8px;">
          <span style="width:8px;height:8px;border-radius:50%;background:#ff3e00;display:inline-block;"></span>
          Svelte
        </span>
      </WkSelectOption>
    </WkSelect>
  `
})
WithSlot.parameters = {
  docs: { description: { story: 'Default slot overrides the `label` prop for rich option content.' } }
}
