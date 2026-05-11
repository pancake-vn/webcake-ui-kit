import Button from '../../src/components/button/Button.vue'

const VARIANTS = ['primary', 'neutral', 'secondary', 'outline', 'ghost', 'destructive', 'link']
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl']
const ROUNDNESS = ['default', 'round']

const PLUS_ICON = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>`

const ARROW_ICON = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

export default {
  title: 'Components/Button',
  component: Button,
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
  components: { Button },
  setup() {
    return { args }
  },
  template: `<Button v-bind="args">{{ args.label || 'Button' }}</Button>`
})

export const Primary = Template.bind({})
Primary.args = { variant: 'primary', size: 'md', label: 'Primary action' }

export const AllVariants = () => ({
  components: { Button },
  setup() {
    return { variants: VARIANTS }
  },
  template: `
    <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
      <Button v-for="v in variants" :key="v" :variant="v">{{ v }}</Button>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'All seven `variant` values at default size (`md`).' } }
}

export const Sizes = () => ({
  components: { Button },
  setup() {
    return { sizes: SIZES }
  },
  template: `
    <div style="display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap;">
      <Button v-for="s in sizes" :key="s" :size="s">{{ s }}</Button>
    </div>
  `
})
Sizes.parameters = {
  docs: { description: { story: 'All five `size` values at default variant (`primary`).' } }
}

export const Matrix = () => ({
  components: { Button },
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
          <td v-for="v in variants" :key="v"><Button :variant="v" :size="s">Label</Button></td>
        </tr>
      </tbody>
    </table>
  `
})
Matrix.parameters = {
  docs: { description: { story: 'Cartesian product of `variant` × `size` — quick visual regression surface.' } }
}

export const Roundness = () => ({
  components: { Button },
  setup() {
    return { roundness: ROUNDNESS, variants: VARIANTS }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px;">
      <div v-for="r in roundness" :key="r" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
        <span style="min-width:64px; color:#6b7280; font-size:12px;">{{ r }}</span>
        <Button v-for="v in variants" :key="v" :variant="v" :roundness="r">{{ v }}</Button>
      </div>
    </div>
  `
})
Roundness.parameters = {
  docs: { description: { story: '`default` uses 10px radius (xs uses `rounded-lg`); `round` renders a full pill.' } }
}

export const WithIconLeft = () => ({
  components: { Button },
  setup() {
    return { variants: VARIANTS, plusIcon: PLUS_ICON }
  },
  template: `
    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <Button v-for="v in variants" :key="v" :variant="v">
        <template #icon-left><span v-html="plusIcon" style="display:inline-flex;"/></template>
        Add item
      </Button>
    </div>
  `
})
WithIconLeft.parameters = {
  docs: { description: { story: 'Slot `#icon-left` renders an icon before the label.' } }
}

export const WithIconRight = () => ({
  components: { Button },
  setup() {
    return { variants: VARIANTS, arrowIcon: ARROW_ICON }
  },
  template: `
    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <Button v-for="v in variants" :key="v" :variant="v">
        Next
        <template #icon-right><span v-html="arrowIcon" style="display:inline-flex;"/></template>
      </Button>
    </div>
  `
})
WithIconRight.parameters = {
  docs: { description: { story: 'Slot `#icon-right` renders an icon after the label.' } }
}

export const IconOnly = () => ({
  components: { Button },
  setup() {
    return { variants: VARIANTS, sizes: SIZES, plusIcon: PLUS_ICON }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px;">
      <div v-for="s in sizes" :key="s" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
        <span style="min-width:32px; color:#6b7280; font-size:12px;">{{ s }}</span>
        <Button v-for="v in variants" :key="v" :variant="v" :size="s">
          <template #icon><span v-html="plusIcon" style="display:inline-flex;"/></template>
        </Button>
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
  components: { Button },
  setup() {
    return { variants: VARIANTS }
  },
  template: `
    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <Button v-for="v in variants" :key="v" :variant="v" :loading="true">{{ v }}</Button>
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
  components: { Button },
  setup() {
    return { variants: VARIANTS }
  },
  template: `
    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <Button v-for="v in variants" :key="v" :variant="v" disabled>{{ v }}</Button>
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
  components: { Button },
  setup() {
    return { variants: VARIANTS }
  },
  template: `
    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <Button v-for="v in variants" :key="v" :variant="v" tabindex="0">{{ v }}</Button>
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
