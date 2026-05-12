import WkRadioGroup from '../../src/components/radio-group/RadioGroup.vue'

const DIRECTIONS = ['vertical', 'horizontal']

export default {
  title: 'Components/RadioGroup',
  component: WkRadioGroup,
  argTypes: {
    direction: { control: { type: 'inline-radio' }, options: DIRECTIONS },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    value: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Controlled group of radio buttons. Pass `options` as an array of strings or `{ value, label, disabled }` objects. ' +
          'Binds selected value via `:value` + `@change` (Vue 2 `v-model` compatible). ' +
          'Propagates `disabled` and `error` to all child `WkRadio` items via `provide/inject`.'
      }
    }
  }
}

const OPTIONS = ['Apple', 'Banana', 'Cherry', 'Durian']

const Template = args => ({
  components: { WkRadioGroup },
  setup() {
    return { args }
  },
  template: `<WkRadioGroup v-bind="args" />`
})

export const Primary = Template.bind({})
Primary.args = { value: 'Apple', options: OPTIONS, direction: 'vertical' }

export const AllVariants = () => ({
  components: { WkRadioGroup },
  data() {
    return { options: OPTIONS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:24px;align-items:flex-start;">
      <div v-for="dir in ['vertical','horizontal']" :key="dir" style="display:flex;flex-direction:column;gap:8px;">
        <span style="color:#6b7280;font-size:12px;">direction: {{ dir }}</span>
        <div style="display:flex;gap:32px;flex-wrap:wrap;align-items:flex-start;">
          <div>
            <span style="color:#6b7280;font-size:11px;display:block;margin-bottom:6px;">default</span>
            <WkRadioGroup :direction="dir" value="Apple" :options="options.slice(0,3)" />
          </div>
          <div>
            <span style="color:#6b7280;font-size:11px;display:block;margin-bottom:6px;">error</span>
            <WkRadioGroup :direction="dir" value="" error :options="options.slice(0,3)" />
          </div>
          <div>
            <span style="color:#6b7280;font-size:11px;display:block;margin-bottom:6px;">disabled</span>
            <WkRadioGroup :direction="dir" value="Apple" disabled :options="options.slice(0,3)" />
          </div>
        </div>
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'Vertical and horizontal layout across default / error / disabled states.' } }
}

export const Interactive = () => ({
  components: { WkRadioGroup },
  data() {
    return {
      selected: 'Apple',
      options: OPTIONS
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <WkRadioGroup :value="selected" :options="options" @change="selected = $event" />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
Interactive.parameters = {
  docs: { description: { story: 'Click an option to select. `@change` updates the bound value.' } }
}

export const ObjectOptions = () => ({
  components: { WkRadioGroup },
  data() {
    return {
      selected: 'pro',
      options: [
        { value: 'free', label: 'Free — 5 projects' },
        { value: 'pro', label: 'Pro — unlimited projects' },
        { value: 'enterprise', label: 'Enterprise', disabled: true }
      ]
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <WkRadioGroup :value="selected" :options="options" @change="selected = $event" />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
ObjectOptions.parameters = {
  docs: { description: { story: 'Object options with custom labels and per-item disabled state.' } }
}

export const FocusVisible = () => ({
  components: { WkRadioGroup },
  data() {
    return { options: OPTIONS.slice(0, 3) }
  },
  template: `<WkRadioGroup value="Apple" :options="options" />`
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through to verify `:focus-visible` ring on each radio.' } }
}
