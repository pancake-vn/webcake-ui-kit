import WkInputNumber from '../../src/components/input-number/InputNumber.vue'

const SIZES = ['tiny', 'xs', 'sm', 'md', 'lg']
const ROUNDNESS = ['default', 'round']

export default {
  title: 'Forms/InputNumber',
  component: WkInputNumber,
  argTypes: {
    size: { control: { type: 'select' }, options: SIZES },
    roundness: { control: { type: 'inline-radio' }, options: ROUNDNESS },
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    precision: { control: 'number' },
    placeholder: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Numeric input — same appearance as `Input` but only accepts numbers. ' +
          'Supports `min`/`max` clamping, configurable `step`, auto-detected or explicit `precision`. ' +
          'Arrow ↑/↓ keys increment/decrement by `step`. Blur commits and formats the value. ' +
          'Dual-compat v-model — `value` (Vue 2) and `modelValue` (Vue 3) both supported.'
      }
    }
  }
}

const Template = args => ({
  components: { WkInputNumber },
  setup() {
    return { args }
  },
  template: `<WkInputNumber v-bind="args" />`
})

export const Primary = Template.bind({})
Primary.args = { size: 'md', value: 0, placeholder: '0' }
Primary.parameters = {
  docs: { description: { story: 'Default `md` size, step=1.' } }
}

export const WithMinMax = Template.bind({})
WithMinMax.args = { size: 'md', value: 5, min: 0, max: 10 }
WithMinMax.parameters = {
  docs: { description: { story: '`min=0` / `max=10` — blur clamps typed values into range; ↑/↓ stops at bounds.' } }
}

export const WithPrecision = Template.bind({})
WithPrecision.args = { size: 'md', value: 1.5, step: 0.1, precision: 2 }
WithPrecision.parameters = {
  docs: {
    description: { story: '`step=0.1`, `precision=2` — shows two decimal places on blur.' }
  }
}

export const Error = Template.bind({})
Error.args = { size: 'md', value: null, error: true, placeholder: '0' }
Error.parameters = {
  docs: { description: { story: 'Error state — red border, error focus ring.' } }
}

export const Disabled = Template.bind({})
Disabled.args = { size: 'md', value: 42, disabled: true }

export const Readonly = Template.bind({})
Readonly.args = { size: 'md', value: 42, readonly: true }

export const AllVariants = () => ({
  components: { WkInputNumber },
  setup() {
    return { sizes: SIZES }
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 200px;">
      <WkInputNumber v-for="s in sizes" :key="s" :size="s" :value="0" :placeholder="'size=' + s" />
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'All five sizes.' } }
}

export const Matrix = () => ({
  components: { WkInputNumber },
  setup() {
    return { sizes: SIZES, roundness: ROUNDNESS }
  },
  template: `
    <table style="border-collapse: separate; border-spacing: 12px;">
      <thead>
        <tr>
          <th></th>
          <th v-for="r in roundness" :key="r" style="text-align: left; font-weight: 500; color: #6b7280;">{{ r }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in sizes" :key="s">
          <td style="color: #6b7280; padding-right: 8px;">{{ s }}</td>
          <td v-for="r in roundness" :key="r">
            <WkInputNumber :size="s" :roundness="r" :value="0" style="width: 160px;" />
          </td>
        </tr>
      </tbody>
    </table>
  `
})
Matrix.parameters = {
  docs: { description: { story: 'Cartesian product of `size` × `roundness`.' } }
}

export const FocusVisible = () => ({
  components: { WkInputNumber },
  template: `
    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 200px;">
      <WkInputNumber :value="0" placeholder="Default focus ring" />
      <WkInputNumber :value="0" error placeholder="Error focus ring" />
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through to verify `:focus-within` rings.' } }
}
