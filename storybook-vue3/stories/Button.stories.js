import WkButton from '../../src/components/button/Button.vue'
import { WkiChevronRight, WkiChevronLeft } from '../../src/icons'

const VARIANTS = ['primary', 'neutral', 'secondary', 'outline', 'ghost', 'destructive', 'link', 'ghost-destructive']
const SIZES = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
const ROUNDNESS = ['default', 'round']

export default {
  title: 'Forms/Button',
  component: WkButton,
  argTypes: {
    variant: { control: { type: 'select' }, options: VARIANTS },
    size: { control: { type: 'inline-radio' }, options: SIZES },
    roundness: { control: { type: 'inline-radio' }, options: ROUNDNESS },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    htmlType: { control: { type: 'select' }, options: ['button', 'submit', 'reset'] },
    onClick: { action: 'clicked' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Action trigger. Seven semantic variants (`primary`, `neutral`, `secondary`, `outline`, `ghost`, `destructive`, `link`) ' +
          'across five sizes (`xs`, `sm`, `md`, `lg`, `xl`). Renders a native `<button>` and forwards `click` events. ' +
          'Supports `#icon-left`, `#icon-right`, and `#icon` (icon-only) slots plus a `loading` spinner state.'
      }
    }
  }
}

const Template = args => ({
  components: { WkButton },
  setup() {
    return { args }
  },
  template: `<WkButton v-bind="args">{{ args.label || 'WkButton' }}</WkButton>`
})

export const Primary = Template.bind({})
Primary.args = { variant: 'primary', size: 'md', label: 'Primary action' }

export const AllVariants = () => ({
  components: { WkButton },
  setup() {
    return { variants: VARIANTS }
  },
  template: `
    <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
      <WkButton v-for="v in variants" :key="v" :variant="v">{{ v }}</WkButton>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'All seven `variant` values at default size (`md`).' } }
}

export const Sizes = () => ({
  components: { WkButton },
  setup() {
    return { sizes: SIZES }
  },
  template: `
    <div style="display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap;">
      <WkButton v-for="s in sizes" :key="s" :size="s">{{ s }}</WkButton>
    </div>
  `
})
Sizes.parameters = {
  docs: { description: { story: 'All five `size` values at default variant (`primary`).' } }
}

export const Matrix = () => ({
  components: { WkButton },
  setup() {
    return { variants: VARIANTS, sizes: SIZES }
  },
  template: `
    <table style="border-collapse:separate; border-spacing:12px;">
      <thead>
        <tr>
          <th></th>
          <th v-for="v in variants" :key="v" style="text-align:left; font-weight:500; color:#6b7280; white-space:nowrap;">{{ v }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in sizes" :key="s">
          <td style="color:#6b7280; padding-right:8px; white-space:nowrap; font-size:12px;">{{ s }}</td>
          <td v-for="v in variants" :key="v"><WkButton :variant="v" :size="s">Label</WkButton></td>
        </tr>
      </tbody>
    </table>
  `
})
Matrix.parameters = {
  docs: { description: { story: 'Cartesian product of `variant` × `size` — quick visual regression surface.' } }
}

export const Roundness = () => ({
  components: { WkButton },
  setup() {
    return { roundness: ROUNDNESS, variants: VARIANTS }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px;">
      <div v-for="r in roundness" :key="r" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
        <span style="min-width:64px; color:#6b7280; font-size:12px;">{{ r }}</span>
        <WkButton v-for="v in variants" :key="v" :variant="v" :roundness="r">{{ v }}</WkButton>
      </div>
    </div>
  `
})
Roundness.parameters = {
  docs: { description: { story: '`default` uses 10px radius (xs uses `rounded-lg`); `round` renders a full pill.' } }
}

export const WithIconLeft = () => ({
  components: { WkButton, WkiChevronLeft },
  data() {
    return { variants: VARIANTS }
  },
  template: `
    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <WkButton v-for="v in variants" :key="v" :variant="v">
        <template #icon-left>
          <WkiChevronLeft />
        </template>
        Add item
      </WkButton>
    </div>
  `
})
WithIconLeft.parameters = {
  docs: { description: { story: 'Slot `#icon-left` renders an icon before the label.' } }
}

export const WithIconRight = () => ({
  components: { WkButton, WkiChevronRight },
  data() {
    return { variants: VARIANTS }
  },
  template: `
    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <WkButton v-for="v in variants" :key="v" :variant="v">
        Next
        <template #icon-right>
          <WkiChevronRight />
        </template>
      </WkButton>
    </div>
  `
})
WithIconRight.parameters = {
  docs: { description: { story: 'Slot `#icon-right` renders an icon after the label.' } }
}

export const IconOnly = () => ({
  components: { WkButton, WkiChevronRight },
  data() {
    return { variants: VARIANTS, sizes: SIZES }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px;">
      <div v-for="s in sizes" :key="s" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
        <span style="min-width:32px; color:#6b7280; font-size:12px;">{{ s }}</span>
        <WkButton v-for="v in variants" :key="v" :variant="v" :size="s">
          <template #icon>
            <WkiChevronRight />
          </template>
        </WkButton>
      </div>
    </div>
  `
})
IconOnly.parameters = {
  docs: {
    description: {
      story:
        'Slot `#icon` or `#icon-left` or `#icon-right` with no label triggers the icon-only square layout (`ui-btn--icon-only`).'
    }
  }
}

export const Loading = () => ({
  components: { WkButton },
  setup() {
    return { variants: VARIANTS }
  },
  template: `
    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <WkButton v-for="v in variants" :key="v" :variant="v" :loading="true">{{ v }}</WkButton>
    </div>
  `
})
Loading.parameters = {
  docs: {
    description: {
      story: '`loading` replaces the left icon with a spinner, suppresses clicks, and sets `cursor: progress`.'
    }
  }
}

export const Disabled = () => ({
  components: { WkButton },
  setup() {
    return { variants: VARIANTS }
  },
  template: `
    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <WkButton v-for="v in variants" :key="v" :variant="v" disabled>{{ v }}</WkButton>
    </div>
  `
})
Disabled.parameters = {
  docs: {
    description: {
      story: '`disabled` reduces opacity to 0.5, sets `cursor: not-allowed`, and suppresses click emission.'
    }
  }
}

export const FocusVisible = () => ({
  components: { WkButton },
  setup() {
    return { variants: VARIANTS }
  },
  template: `
    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <WkButton v-for="v in variants" :key="v" :variant="v" tabindex="0">{{ v }}</WkButton>
    </div>
  `
})
FocusVisible.parameters = {
  docs: {
    description: {
      story: 'Tab through to verify the `:focus-visible` ring. Mouse click should not trigger the ring.'
    }
  }
}
