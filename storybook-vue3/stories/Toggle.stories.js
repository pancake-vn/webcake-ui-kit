import WkToggle from '../../src/components/toggle/Toggle.vue'

const VARIANTS = ['outlined', 'ghost']
const SIZES = ['xs', 'sm', 'md', 'lg']
const ROUNDNESS = ['default', 'round']

const boldIcon =
  '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="M6 10h5a2.5 2.5 0 0 0 0-5H6v5Zm0 0h5.5a2.5 2.5 0 0 1 0 5H6v-5Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/></svg>'
const starIcon =
  '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="m10 3 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.2l5-.7L10 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>'

export default {
  title: 'Components/Toggle',
  component: WkToggle,
  argTypes: {
    variant: { control: { type: 'inline-radio' }, options: VARIANTS },
    size: { control: { type: 'inline-radio' }, options: SIZES },
    roundness: { control: { type: 'inline-radio' }, options: ROUNDNESS },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'A stateful toggle button. Press to toggle on/off — `aria-pressed` reflects state. ' +
          'Standalone uses `v-model`; inside a `WkToggleGroup`, the group manages the active state and the ' +
          'WkToggle reads/writes via `value`. ' +
          'Dual-compat: Vue 2 `v-model` binds `active`; Vue 3 `v-model` binds `modelValue`.'
      }
    }
  }
}

const Template = args => ({
  components: { WkToggle },
  data() {
    return { args, value: !!args.active }
  },
  template: `<WkToggle v-bind="args" v-model="value">{{ args.label || 'WkToggle' }}</WkToggle>`
})

export const Primary = Template.bind({})
Primary.args = { label: 'WkToggle', variant: 'outlined', size: 'md', roundness: 'default' }

export const AllVariants = () => ({
  components: { WkToggle },
  data() {
    return { variants: VARIANTS, sizes: SIZES }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:24px; align-items:flex-start;">
      <div v-for="v in variants" :key="v" style="display:flex; flex-direction:column; gap:8px;">
        <span style="color:var(--muted-fg); font-size:12px;">{{ v }}</span>
        <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
          <WkToggle v-for="s in sizes" :key="s" :variant="v" :size="s">{{ s }}</WkToggle>
        </div>
        <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
          <WkToggle v-for="s in sizes" :key="s + '-on'" :variant="v" :size="s" :active="true">{{ s }} on</WkToggle>
        </div>
      </div>
    </div>
  `
})

export const Matrix = () => ({
  components: { WkToggle },
  data() {
    return { variants: VARIANTS, sizes: SIZES, roundness: ROUNDNESS }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:32px;">
      <div v-for="r in roundness" :key="r">
        <h3 style="margin:0 0 12px 0; font-size:13px; color:var(--muted-fg);">Roundness: {{ r }}</h3>
        <table style="border-collapse:separate; border-spacing:12px;">
          <thead>
            <tr>
              <th></th>
              <th v-for="s in sizes" :key="s" style="text-align:left; font-size:12px; color:var(--muted-fg);">{{ s }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in variants" :key="v">
              <td style="font-size:12px; color:var(--muted-fg);">{{ v }} (off)</td>
              <td v-for="s in sizes" :key="s">
                <WkToggle :variant="v" :size="s" :roundness="r">Label</WkToggle>
              </td>
            </tr>
            <tr v-for="v in variants" :key="v + '-on'">
              <td style="font-size:12px; color:var(--muted-fg);">{{ v }} (on)</td>
              <td v-for="s in sizes" :key="s">
                <WkToggle :variant="v" :size="s" :roundness="r" :active="true">Label</WkToggle>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})

export const VModelInteractive = () => ({
  components: { WkToggle },
  data() {
    return { active: false }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
      <WkToggle v-model="active">Bold</WkToggle>
      <code style="font-size:13px;">active = {{ active }}</code>
    </div>
  `
})
VModelInteractive.parameters = {
  docs: { description: { story: 'Click the toggle to flip the bound boolean.' } }
}

export const IconOnly = () => ({
  components: { WkToggle },
  data() {
    return { boldIcon, starIcon, sizes: SIZES, on: false, fav: true }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
      <div style="display:flex; gap:12px; align-items:center;">
        <WkToggle v-for="s in sizes" :key="s" :size="s" v-model="on" aria-label="Bold">
          <template #icon><span v-html="boldIcon" /></template>
        </WkToggle>
      </div>
      <div style="display:flex; gap:12px; align-items:center;">
        <WkToggle v-for="s in sizes" :key="s + '-r'" :size="s" roundness="round" v-model="fav" aria-label="Favorite">
          <template #icon><span v-html="starIcon" /></template>
        </WkToggle>
      </div>
    </div>
  `
})
IconOnly.parameters = {
  docs: { description: { story: 'Pass content to `#icon` slot to get a square icon-only toggle. Auto-detected.' } }
}

export const States = () => ({
  components: { WkToggle },
  template: `
    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <WkToggle>Default</WkToggle>
      <WkToggle :active="true">Active</WkToggle>
      <WkToggle disabled>Disabled</WkToggle>
      <WkToggle :active="true" disabled>Active + disabled</WkToggle>
    </div>
  `
})

export const FocusVisible = () => ({
  components: { WkToggle },
  template: `
    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <WkToggle>Tab here</WkToggle>
      <WkToggle :active="true">And here</WkToggle>
      <WkToggle variant="ghost">Ghost</WkToggle>
      <WkToggle variant="ghost" :active="true">Ghost on</WkToggle>
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through the toggles to verify focus rings.' } }
}
