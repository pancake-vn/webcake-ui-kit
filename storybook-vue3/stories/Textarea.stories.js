import WkTextarea from '../../src/components/textarea/Textarea.vue'

const SIZES = ['default', 'mini']
const ROUNDNESS = ['default', 'round']

export default {
  title: 'Forms/Textarea',
  component: WkTextarea,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: SIZES },
    roundness: { control: { type: 'inline-radio' }, options: ROUNDNESS },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    rows: { control: 'number' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    resizable: { control: 'boolean' },
    autosize: { control: 'boolean' },
    showCount: { control: 'boolean' },
    maxLength: { control: 'number' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Multi-line text input. Two sizes (default/mini) and two roundness values. ' +
          'Supports `autosize` (grows with content), character counting via `showCount`, ' +
          'and `maxLength`. Logical states `error` and `disabled` are props; focus ring is driven by ' +
          '`:focus-within`. Dual-compat v-model — `value` (Vue 2) and `modelValue` (Vue 3) both supported.'
      }
    }
  }
}

const Template = args => ({
  components: { WkTextarea },
  setup() {
    return { args }
  },
  template: `<WkTextarea v-bind="args" />`
})

export const Primary = Template.bind({})
Primary.args = { size: 'default', roundness: 'default', placeholder: 'Enter text...', rows: 3 }
Primary.parameters = {
  docs: { description: { story: 'Default size and roundness.' } }
}

export const WithCount = Template.bind({})
WithCount.args = { placeholder: 'Enter text...', showCount: true }
WithCount.parameters = {
  docs: { description: { story: 'Character counter shown via `showCount`. No limit enforced.' } }
}

export const WithMaxLength = Template.bind({})
WithMaxLength.args = { placeholder: 'Max 200 chars...', maxLength: 200 }
WithMaxLength.parameters = {
  docs: {
    description: {
      story: '`maxLength` enforces the native browser limit and auto-shows "n / max" counter.'
    }
  }
}

export const Autosize = Template.bind({})
Autosize.args = { placeholder: 'Grows as you type...', autosize: true, rows: 2 }
Autosize.parameters = {
  docs: { description: { story: 'Height expands automatically with content. Resize handle is hidden.' } }
}

export const Error = Template.bind({})
Error.args = { error: true, placeholder: 'Has an error' }
Error.parameters = {
  docs: { description: { story: 'Error state — red border, error focus ring on `:focus-within`.' } }
}

export const Disabled = Template.bind({})
Disabled.args = { disabled: true, value: 'Cannot edit this' }
Disabled.parameters = {
  docs: { description: { story: 'Disabled — opacity 0.5, native `disabled` attribute on the textarea.' } }
}

export const AllVariants = () => ({
  components: { WkTextarea },
  setup() {
    return { sizes: SIZES }
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 320px;">
      <WkTextarea v-for="s in sizes" :key="s" :size="s" :placeholder="'size=' + s" />
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'Both sizes stacked at default roundness.' } }
}

export const Matrix = () => ({
  components: { WkTextarea },
  setup() {
    return { sizes: SIZES, roundness: ROUNDNESS }
  },
  template: `
    <table style="border-collapse: separate; border-spacing: 16px;">
      <thead>
        <tr>
          <th></th>
          <th v-for="r in roundness" :key="r" style="text-align: left; font-weight: 500; color: #6b7280;">{{ r }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in sizes" :key="s">
          <td style="color: #6b7280; padding-right: 8px; vertical-align: top; padding-top: 8px;">{{ s }}</td>
          <td v-for="r in roundness" :key="r">
            <div style="width: 240px;">
              <WkTextarea :size="s" :roundness="r" placeholder="Placeholder" />
            </div>
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
  components: { WkTextarea },
  template: `
    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px;">
      <WkTextarea placeholder="Tab here — default focus ring" />
      <WkTextarea error placeholder="Tab here — error focus ring" />
    </div>
  `
})
FocusVisible.parameters = {
  docs: {
    description: {
      story: 'Tab through to verify the `:focus-within` ring on the wrapper.'
    }
  }
}
