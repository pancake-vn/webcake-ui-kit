import WkSelect from '../../src/components/select/Select.vue'

const SIZES = ['mini', 'sm', 'default', 'lg']

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Durian', 'Elderberry', 'Fig', 'Grape']

export default {
  title: 'Components/Select',
  component: WkSelect,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: SIZES },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    loading: { control: 'boolean' },
    placeholder: { control: 'text' },
    prepend: { control: 'text' },
    value: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Custom select dropdown. Pass options as an array of strings or `{ value, label, disabled }` objects. ' +
          'Controlled via `:value` + `@change`. `prepend` shows a fixed label before the selected value. ' +
          '`#icon` slot adds a leading icon. Closes on outside click.'
      }
    }
  }
}

const Template = args => ({
  components: { WkSelect },
  setup() {
    return { args, fruits: FRUITS }
  },
  template: `<div style="width:240px;"><WkSelect v-bind="args" :options="fruits" /></div>`
})

export const Primary = Template.bind({})
Primary.args = { value: '', placeholder: 'WkSelect a fruit', size: 'default' }

export const AllSizes = () => ({
  components: { WkSelect },
  data() {
    return { fruits: FRUITS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <div v-for="size in ['mini','sm','default','lg']" :key="size" style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:48px;">{{ size }}</span>
        <WkSelect :size="size" value="Apple" :options="fruits" style="width:200px;" />
      </div>
    </div>
  `
})
AllSizes.parameters = {
  docs: { description: { story: 'All four sizes with a pre-selected value.' } }
}

export const States = () => ({
  components: { WkSelect },
  data() {
    return { fruits: FRUITS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:64px;">default</span>
        <WkSelect value="Apple" :options="fruits" style="width:200px;" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:64px;">error</span>
        <WkSelect value="" error placeholder="Required" :options="fruits" style="width:200px;" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:64px;">disabled</span>
        <WkSelect value="Apple" disabled :options="fruits" style="width:200px;" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:64px;">loading</span>
        <WkSelect value="" loading placeholder="Loading…" :options="fruits" style="width:200px;" />
      </div>
    </div>
  `
})
States.parameters = {
  docs: { description: { story: 'Default, error, disabled, and loading states.' } }
}

export const Interactive = () => ({
  components: { WkSelect },
  data() {
    return {
      selected: '',
      fruits: FRUITS
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <WkSelect :value="selected" :options="fruits" placeholder="Pick a fruit" style="width:240px;" @change="selected = $event" />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
Interactive.parameters = {
  docs: { description: { story: 'Click to open, select an option. `@change` updates the value.' } }
}

export const WithPrepend = () => ({
  components: { WkSelect },
  data() {
    return {
      selected: 'USD',
      currencies: ['USD', 'EUR', 'GBP', 'JPY', 'AUD']
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
      <WkSelect :value="selected" :options="currencies" prepend="Currency:" style="width:220px;" @change="selected = $event" />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
WithPrepend.parameters = {
  docs: {
    description: { story: '`prepend` shows a fixed label before the selected value, useful for labelled inputs.' }
  }
}

export const WithIcon = () => ({
  components: { WkSelect },
  data() {
    return { fruits: FRUITS }
  },
  template: `
    <WkSelect value="Apple" :options="fruits" style="width:240px;">
      <template #icon>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="7" cy="7" r="5" />
        </svg>
      </template>
    </WkSelect>
  `
})
WithIcon.parameters = {
  docs: { description: { story: '`#icon` slot adds a leading icon inside the trigger.' } }
}

export const ObjectOptions = () => ({
  components: { WkSelect },
  data() {
    return {
      selected: 'pro',
      plans: [
        { value: 'free', label: 'Free' },
        { value: 'pro', label: 'Pro' },
        { value: 'enterprise', label: 'Enterprise', disabled: true }
      ]
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
      <WkSelect :value="selected" :options="plans" style="width:200px;" @change="selected = $event" />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
ObjectOptions.parameters = {
  docs: { description: { story: 'Object options support custom labels and per-option `disabled` state.' } }
}
