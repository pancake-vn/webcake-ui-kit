import WkBadge from '../../src/components/badge/Badge.vue'
import CircleXIcon from '../../src/icons/CircleXIcon.vue'

const VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'info', 'warning']
const ROUNDNESS = ['default', 'round']

export default {
  title: 'Display/Badge',
  component: WkBadge,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: VARIANTS
    },
    roundness: {
      control: { type: 'inline-radio' },
      options: ROUNDNESS
    },
    label: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Compact label for status, counts, or metadata. Seven semantic `variant`s and two ' +
          '`roundness` values. Supports `icon-left` / `icon-right` slots; default slot or `label` ' +
          'prop sets the text. Rendered as an inline `<span>` so it can sit inside paragraphs.'
      }
    }
  }
}

const Template = args => ({
  components: { WkBadge },
  setup() {
    return { args }
  },
  template: `<WkBadge v-bind="args">{{ args.label || 'Label' }}</WkBadge>`
})

export const Primary = Template.bind({})
Primary.args = { variant: 'primary', roundness: 'default', label: 'Label' }

export const Round = Template.bind({})
Round.args = { variant: 'primary', roundness: 'round', label: 'Label' }

Primary.parameters = {
  docs: { description: { story: 'Default `primary` variant with default roundness.' } }
}

Round.parameters = {
  docs: { description: { story: 'Pill shape via `roundness="round"` — useful for counts and tags.' } }
}

export const AllVariants = () => ({
  components: { WkBadge },
  setup() {
    return { variants: VARIANTS }
  },
  template: `
    <div style="display: flex; gap: 12px; align-items: center;">
      <WkBadge v-for="v in variants" :key="v" :variant="v">{{ v }}</WkBadge>
    </div>
  `
})

AllVariants.parameters = {
  docs: { description: { story: 'All seven semantic variants at default roundness.' } }
}

export const Matrix = () => ({
  components: { WkBadge },
  setup() {
    return { variants: VARIANTS, roundness: ROUNDNESS }
  },
  template: `
    <table style="border-collapse: separate; border-spacing: 12px;">
      <thead>
        <tr>
          <th></th>
          <th v-for="v in variants" :key="v" style="text-align: left; font-weight: 500; color: #6b7280;">{{ v }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in roundness" :key="r">
          <td style="color: #6b7280; padding-right: 8px;">{{ r }}</td>
          <td v-for="v in variants" :key="v"><WkBadge :variant="v" :roundness="r">Label</WkBadge></td>
        </tr>
      </tbody>
    </table>
  `
})

Matrix.parameters = {
  docs: { description: { story: 'Cartesian product of `variant` × `roundness`.' } }
}

export const WithIcons = () => ({
  components: { WkBadge, CircleXIcon },
  template: `
    <div style="display: flex; gap: 12px; align-items: center;">
      <WkBadge variant="primary">
        <template #icon-left>
          <CircleXIcon :size="12" />
        </template>
        Left icon
      </WkBadge>
      <WkBadge variant="secondary">
        Right icon
        <template #icon-right>
          <CircleXIcon :size="12" />
        </template>
      </WkBadge>
      <WkBadge variant="info">
        <template #icon-left>
          <CircleXIcon :size="12" />
        </template>
        Both
        <template #icon-right>
          <CircleXIcon :size="12" />
        </template>
      </WkBadge>
    </div>
  `
})

WithIcons.parameters = {
  docs: { description: { story: 'Slots `icon-left` and `icon-right` accept any inline content.' } }
}

export const FocusVisible = () => ({
  components: { WkBadge },
  template: `
    <div style="display: flex; gap: 12px; align-items: center;">
      <WkBadge variant="primary" tabindex="0">Tab here for focus ring</WkBadge>
      <WkBadge variant="destructive" tabindex="0">Tab for error ring</WkBadge>
    </div>
  `
})
FocusVisible.parameters = {
  docs: {
    description: {
      story: 'Tab through to verify the `:focus-visible` ring (only shown for keyboard focus).'
    }
  }
}
