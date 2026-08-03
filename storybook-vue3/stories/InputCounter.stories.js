import WkInputCounter from '../../src/components/input-counter/InputCounter.vue'

const SIZES = ['xs', 'sm', 'md', 'lg']
const ROUNDNESS = ['default', 'round']

export default {
  title: 'Forms/InputCounter',
  component: WkInputCounter,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: SIZES },
    roundness: { control: { type: 'inline-radio' }, options: ROUNDNESS },
    placeholder: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    precision: { control: 'number' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    error: { control: 'boolean' },
    centered: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Numeric input with increment / decrement buttons. ' +
          '`min` / `max` clamp the value and disable the respective button at the boundary. ' +
          '`step` controls the delta per click or arrow key. ' +
          '`precision` fixes decimal places (defaults to the decimal count of `step`). ' +
          'Slots `prefix` and `suffix` accept icons or inline text. ' +
          'Dual-compat v-model: `value` (Vue 2) and `modelValue` (Vue 3).'
      }
    }
  }
}

const Template = args => ({
  components: { WkInputCounter },
  data() {
    return { args, val: args.value !== undefined ? args.value : 0 }
  },
  template: `
    <div style="padding: 24px; max-width: 200px;">
      <WkInputCounter v-bind="args" :value="val" @change="val = $event" />
    </div>
  `
})

export const Primary = Template.bind({})
Primary.args = { size: 'md', roundness: 'default', placeholder: '0' }
Primary.parameters = {
  docs: { description: { story: 'Default `md` size, no bounds, integer step of 1.' } }
}

export const AllVariants = () => ({
  components: { WkInputCounter },
  data() {
    return { sizes: SIZES, vals: { xs: 1, sm: 2, md: 3, lg: 4 } }
  },
  template: `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 12px; max-width: 240px;">
      <div v-for="s in sizes" :key="s" style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 12px; color: #6b7280; width: 24px;">{{ s }}</span>
        <WkInputCounter :size="s" :value="vals[s]" @change="vals[s] = $event" />
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'Four size variants: xs / sm / md / lg.' } }
}

export const Matrix = () => ({
  components: { WkInputCounter },
  data() {
    return { sizes: SIZES, roundness: ROUNDNESS }
  },
  template: `
    <table style="border-collapse: separate; border-spacing: 16px; padding: 8px;">
      <thead>
        <tr>
          <th></th>
          <th v-for="r in roundness" :key="r" style="text-align: left; font-size: 12px; font-weight: 500; color: #6b7280;">{{ r }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in sizes" :key="s">
          <td style="font-size: 12px; color: #6b7280; padding-right: 8px;">{{ s }}</td>
          <td v-for="r in roundness" :key="r">
            <WkInputCounter :size="s" :roundness="r" :value="5" style="min-width: 160px;" />
          </td>
        </tr>
      </tbody>
    </table>
  `
})
Matrix.parameters = {
  docs: { description: { story: 'Cartesian product of `size` × `roundness`.' } }
}

export const WithMinMax = () => ({
  components: { WkInputCounter },
  data() {
    return { val: 5 }
  },
  template: `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px; max-width: 280px;">
      <p style="margin: 0; font-size: 13px; color: #6b7280;">min=0, max=10, step=1 — buttons disable at boundaries.</p>
      <WkInputCounter :value="val" :min="0" :max="10" :step="1" @change="val = $event" />
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">Current value: {{ val }}</p>
    </div>
  `
})
WithMinMax.parameters = {
  docs: { description: { story: '`min` and `max` clamp input. The − button disables at `min`, + at `max`.' } }
}

export const WithStep = () => ({
  components: { WkInputCounter },
  data() {
    return { val1: 0, val2: 0 }
  },
  template: `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px; max-width: 280px;">
      <div>
        <p style="margin: 0 0 6px; font-size: 12px; color: #6b7280;">step=5</p>
        <WkInputCounter :value="val1" :step="5" @change="val1 = $event" />
      </div>
      <div>
        <p style="margin: 0 0 6px; font-size: 12px; color: #6b7280;">step=0.1, precision=1</p>
        <WkInputCounter :value="val2" :step="0.1" :precision="1" @change="val2 = $event" />
      </div>
    </div>
  `
})
WithStep.parameters = {
  docs: {
    description: { story: '`step=5` increments by 5. `step=0.1` with `precision=1` formats to one decimal place.' }
  }
}

export const States = () => ({
  components: { WkInputCounter },
  template: `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 12px; max-width: 280px;">
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280;">Default</p>
        <WkInputCounter :value="5" />
      </div>
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280;">Error</p>
        <WkInputCounter :value="5" :error="true" />
      </div>
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280;">Disabled</p>
        <WkInputCounter :value="5" :disabled="true" />
      </div>
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280;">Readonly</p>
        <WkInputCounter :value="5" :readonly="true" />
      </div>
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280;">Centered</p>
        <WkInputCounter :value="5" :centered="true" />
      </div>
    </div>
  `
})
States.parameters = {
  docs: {
    description: {
      story:
        'Error (red border), disabled (buttons + input locked), readonly (no interaction), centered (text-align center).'
    }
  }
}

export const WithSlots = () => ({
  components: { WkInputCounter },
  template: `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 12px; max-width: 280px;">
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280;">prefix: $</p>
        <WkInputCounter :value="100">
          <template #prefix>$</template>
        </WkInputCounter>
      </div>
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280;">suffix: kg</p>
        <WkInputCounter :value="72">
          <template #suffix>kg</template>
        </WkInputCounter>
      </div>
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280;">prefix + suffix</p>
        <WkInputCounter :value="1500">
          <template #prefix>₫</template>
          <template #suffix>VND</template>
        </WkInputCounter>
      </div>
    </div>
  `
})
WithSlots.parameters = {
  docs: { description: { story: '`prefix` and `suffix` slots accept icons or text labels inside the input frame.' } }
}

export const FocusVisible = () => ({
  components: { WkInputCounter },
  template: `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 12px; max-width: 280px;">
      <WkInputCounter :value="0" placeholder="Tab here — default ring" />
      <WkInputCounter :value="0" :error="true" placeholder="Tab here — error ring" />
    </div>
  `
})
FocusVisible.parameters = {
  docs: {
    description: {
      story:
        'Tab into the input to verify `:focus-within` ring. Arrow-up / Arrow-down increment or decrement while focused.'
    }
  }
}
