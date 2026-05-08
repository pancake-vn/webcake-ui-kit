import Button from '../../src/components/button/Button.vue'

const TYPES = ['primary', 'secondary', 'danger', 'success']
const SIZES = ['small', 'medium', 'large']

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    type: { control: { type: 'select' }, options: TYPES },
    size: { control: { type: 'inline-radio' }, options: SIZES },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Action trigger. Four semantic types (`primary`, `secondary`, `danger`, `success`) ' +
          'across three sizes (`small`, `medium`, `large`). Renders a native `<button>` and ' +
          'forwards `click` events. Disabled state suppresses emission.'
      }
    }
  }
}

const Template = args => ({
  components: { Button },
  setup() {
    return { args }
  },
  template: `<Button v-bind="args">{{ args.label || 'Click me' }}</Button>`
})

export const Primary = Template.bind({})
Primary.args = { type: 'primary', size: 'medium', disabled: false, label: 'Primary action' }

export const AllVariants = () => ({
  components: { Button },
  setup() {
    return { types: TYPES }
  },
  template: `
    <div style="display:flex; gap:12px; align-items:center;">
      <Button v-for="t in types" :key="t" :type="t">{{ t }}</Button>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'All four semantic `type` values at the default size.' } }
}

export const Sizes = () => ({
  components: { Button },
  setup() {
    return { sizes: SIZES }
  },
  template: `
    <div style="display:flex; gap:12px; align-items:center;">
      <Button v-for="s in sizes" :key="s" :size="s" type="primary">{{ s }}</Button>
    </div>
  `
})

export const Matrix = () => ({
  components: { Button },
  setup() {
    return { types: TYPES, sizes: SIZES }
  },
  template: `
    <table style="border-collapse: separate; border-spacing: 12px;">
      <thead>
        <tr>
          <th></th>
          <th v-for="t in types" :key="t" style="text-align:left; font-weight:500; color:#6b7280;">{{ t }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in sizes" :key="s">
          <td style="color:#6b7280; padding-right:8px;">{{ s }}</td>
          <td v-for="t in types" :key="t"><Button :type="t" :size="s">Label</Button></td>
        </tr>
      </tbody>
    </table>
  `
})
Matrix.parameters = {
  docs: { description: { story: 'Cartesian product of `type` × `size` — quick visual regression surface.' } }
}

export const Disabled = () => ({
  components: { Button },
  setup() {
    return { types: TYPES }
  },
  template: `
    <div style="display:flex; gap:12px; align-items:center;">
      <Button v-for="t in types" :key="t" :type="t" disabled>{{ t }}</Button>
    </div>
  `
})

export const FocusVisible = () => ({
  components: { Button },
  template: `
    <div style="display:flex; gap:12px; align-items:center;">
      <Button type="primary">Tab to me</Button>
      <Button type="danger">Then to me</Button>
    </div>
  `
})
FocusVisible.parameters = {
  docs: {
    description: {
      story: 'Tab through to verify the `:focus-visible` outline. Click should not show the ring.'
    }
  }
}
