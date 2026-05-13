import WkInput from '../../src/components/input/Input.vue'

const SIZES = ['xs', 'sm', 'md', 'lg']
const ROUNDNESS = ['default', 'round']

export default {
  title: 'Forms/Input',
  component: WkInput,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: SIZES
    },
    roundness: {
      control: { type: 'inline-radio' },
      options: ROUNDNESS
    },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    type: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Single-line text input. Four `size`s (xs/sm/md/lg) and two `roundness` values. ' +
          'Logical states `error` and `disabled` are props; visual focus is driven by `:focus-within` ' +
          '(no focus prop). Slots: `prefix`, `suffix`. ' +
          'Dual-compat v-model — `value` (Vue 2) and `modelValue` (Vue 3) both supported.'
      }
    }
  }
}

const Template = args => ({
  components: { WkInput },
  setup() {
    return { args }
  },
  template: `<WkInput v-bind="args" />`
})

export const Primary = Template.bind({})
Primary.args = { size: 'md', roundness: 'default', placeholder: 'Placeholder' }
Primary.parameters = {
  docs: { description: { story: 'Default `md` size with default roundness.' } }
}

export const Round = Template.bind({})
Round.args = { size: 'md', roundness: 'round', placeholder: 'Pill input' }
Round.parameters = {
  docs: { description: { story: 'Pill shape via `roundness="round"`.' } }
}

export const Error = Template.bind({})
Error.args = { error: true, placeholder: 'Has an error' }
Error.parameters = {
  docs: { description: { story: 'Error state — red border, error focus ring on `:focus-within`.' } }
}

export const Disabled = Template.bind({})
Disabled.args = { disabled: true, placeholder: 'Disabled' }
Disabled.parameters = {
  docs: { description: { story: 'Disabled — opacity 0.5, native `disabled` attribute on the input.' } }
}

export const AllVariants = () => ({
  components: { WkInput },
  setup() {
    return { sizes: SIZES }
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px;">
      <WkInput v-for="s in sizes" :key="s" :size="s" :placeholder="'size=' + s" />
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'All four sizes stacked at default roundness.' } }
}

export const Matrix = () => ({
  components: { WkInput },
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
          <td v-for="r in roundness" :key="r"><div style="width: 240px;"><WkInput :size="s" :roundness="r" placeholder="Placeholder" /></div></td>
        </tr>
      </tbody>
    </table>
  `
})
Matrix.parameters = {
  docs: { description: { story: 'Cartesian product of `size` × `roundness`.' } }
}

export const WithSlots = () => ({
  components: { WkInput },
  template: `
    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px;">
      <WkInput placeholder="Search...">
        <template #prefix>
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
            <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" />
            <path d="m11 11 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </template>
      </WkInput>
      <WkInput placeholder="0.00">
        <template #prefix>$</template>
        <template #suffix>USD</template>
      </WkInput>
      <WkInput placeholder="you@example.com">
        <template #suffix>
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
            <rect x="3" y="5" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5" />
            <path d="m4 6 6 4 6-4" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
          </svg>
        </template>
      </WkInput>
    </div>
  `
})
WithSlots.parameters = {
  docs: {
    description: {
      story: 'Slots `prefix`, `suffix` cover icons and inline text affixes.'
    }
  }
}

export const FocusVisible = () => ({
  components: { WkInput },
  template: `
    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px;">
      <WkInput placeholder="Tab here — default focus ring" />
      <WkInput error placeholder="Tab here — error focus ring" />
    </div>
  `
})
FocusVisible.parameters = {
  docs: {
    description: {
      story:
        'Tab through to verify the `:focus-within` ring on the wrapper. Native inputs are already keyboard-reachable — no `tabindex` needed.'
    }
  }
}
