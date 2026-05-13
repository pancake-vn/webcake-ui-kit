import WkSwitchGroup from '../../src/components/switch-group/SwitchGroup.vue'

export default {
  title: 'Forms/SwitchGroup',
  component: WkSwitchGroup,
  argTypes: {
    layout: { control: { type: 'inline-radio' }, options: ['inline', 'block'] },
    value: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'WkSwitch with an attached label. `layout="inline"` (default) keeps label and switch side-by-side; ' +
          '`layout="block"` stretches to full width for stacked lists. Supports `:value` + `@change`.'
      }
    }
  }
}

const Template = args => ({
  components: { WkSwitchGroup },
  setup() {
    return { args }
  },
  template: `<WkSwitchGroup v-bind="args" />`
})

export const Primary = Template.bind({})
Primary.args = { label: 'Enable notifications', layout: 'inline', value: false }

export const AllVariants = () => ({
  components: { WkSwitchGroup },
  template: `
    <div style="display:flex;flex-direction:column;gap:24px;align-items:flex-start;">
      <div style="display:flex;flex-direction:column;gap:8px;">
        <span style="color:#6b7280;font-size:12px;">layout: inline</span>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <WkSwitchGroup layout="inline" label="Off" :value="false" />
          <WkSwitchGroup layout="inline" label="On" :value="true" />
          <WkSwitchGroup layout="inline" label="Disabled off" :value="false" disabled />
          <WkSwitchGroup layout="inline" label="Disabled on" :value="true" disabled />
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;width:280px;">
        <span style="color:#6b7280;font-size:12px;">layout: block</span>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <WkSwitchGroup layout="block" label="Off" :value="false" />
          <WkSwitchGroup layout="block" label="On" :value="true" />
          <WkSwitchGroup layout="block" label="Disabled" :value="false" disabled />
        </div>
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'Both layout values across all state combinations.' } }
}

export const MultipleItems = () => ({
  components: { WkSwitchGroup },
  data() {
    return {
      settings: [
        { key: 'email', label: 'Email notifications', value: true },
        { key: 'push', label: 'Push notifications', value: false },
        { key: 'sms', label: 'SMS alerts', value: false }
      ]
    }
  },
  methods: {
    update(key, val) {
      this.settings = this.settings.map(s => (s.key === key ? { ...s, value: val } : s))
    }
  },
  computed: {
    enabled() {
      return (
        this.settings
          .filter(s => s.value)
          .map(s => s.label)
          .join(', ') || '(none)'
      )
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;width:280px;">
      <WkSwitchGroup
        v-for="s in settings"
        :key="s.key"
        layout="block"
        :label="s.label"
        :value="s.value"
        @change="update(s.key, $event)"
      />
      <code style="font-size:13px;margin-top:4px;">enabled = {{ enabled }}</code>
    </div>
  `
})
MultipleItems.parameters = {
  docs: {
    description: { story: 'Typical settings list — `layout="block"` with individual `:value` + `@change` bindings.' }
  }
}

export const WithSlot = () => ({
  components: { WkSwitchGroup },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;width:280px;">
      <WkSwitchGroup layout="block" :value="true">
        Subscribe to <strong>product updates</strong>
      </WkSwitchGroup>
    </div>
  `
})
WithSlot.parameters = {
  docs: { description: { story: 'Default slot overrides the `label` prop for rich label content.' } }
}

export const FocusVisible = () => ({
  components: { WkSwitchGroup },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;width:280px;">
      <WkSwitchGroup layout="block" label="Tab to me" :value="false" />
      <WkSwitchGroup layout="block" label="And here" :value="true" />
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab to the switch to verify `:focus-visible` ring.' } }
}
