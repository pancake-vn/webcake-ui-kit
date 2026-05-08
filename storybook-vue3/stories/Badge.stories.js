import Badge from '../../src/components/badge/Badge.vue'

const VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'info', 'warning']
const ROUNDNESS = ['default', 'round']

export default {
  title: 'Components/Badge',
  component: Badge,
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
  }
}

const Template = (args) => ({
  components: { Badge },
  setup() {
    return { args }
  },
  template: `<Badge v-bind="args">{{ args.label || 'Label' }}</Badge>`
})

export const Primary = Template.bind({})
Primary.args = { variant: 'primary', roundness: 'default', label: 'Label' }

export const Round = Template.bind({})
Round.args = { variant: 'primary', roundness: 'round', label: 'Label' }

export const AllVariants = () => ({
  components: { Badge },
  setup() {
    return { variants: VARIANTS }
  },
  template: `
    <div style="display: flex; gap: 12px; align-items: center;">
      <Badge v-for="v in variants" :key="v" :variant="v">{{ v }}</Badge>
    </div>
  `
})

export const Matrix = () => ({
  components: { Badge },
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
          <td v-for="v in variants" :key="v"><Badge :variant="v" :roundness="r">Label</Badge></td>
        </tr>
      </tbody>
    </table>
  `
})

export const WithIcons = () => ({
  components: { Badge },
  template: `
    <div style="display: flex; gap: 12px; align-items: center;">
      <Badge variant="primary"><template #icon-left>★</template>Left icon</Badge>
      <Badge variant="secondary">Right icon<template #icon-right>→</template></Badge>
      <Badge variant="info"><template #icon-left>i</template>Both<template #icon-right>?</template></Badge>
    </div>
  `
})

export const FocusVisible = () => ({
  components: { Badge },
  template: `
    <div style="display: flex; gap: 12px; align-items: center;">
      <Badge variant="primary" tabindex="0">Tab here for focus ring</Badge>
      <Badge variant="destructive" tabindex="0">Tab for error ring</Badge>
    </div>
  `
})
