import WkTabs from '../../src/components/tabs/Tabs.vue'
import { WkiHouse, WkiBell, WkiSettings2 } from '../../src/icons'

const SIZES = ['xs', 'sm', 'md', 'lg']

const DEMO_TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity', counter: 4 },
  { value: 'settings', label: 'Settings' },
  { value: 'archived', label: 'Archived', disabled: true }
]

export default {
  title: 'Layout/Tabs',
  component: WkTabs,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: SIZES },
    value: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Horizontal tab bar. Each tab is defined by the `tabs` prop array (`{ value, label, counter?, disabled? }`). ' +
          'Active tab is controlled by `value`. Emits `change` (and `input` for Vue 2 v-model) with the selected value.'
      }
    }
  }
}

const Template = args => ({
  components: { WkTabs },
  setup() {
    return { args }
  },
  template: `<WkTabs v-bind="args" />`
})

export const Primary = Template.bind({})
Primary.args = { size: 'sm', value: 'overview', tabs: DEMO_TABS }

export const AllVariants = () => ({
  components: { WkTabs, WkiHouse, WkiBell, WkiSettings2 },
  data() {
    return {
      labelOnly: [
        { value: 'overview', label: 'Overview' },
        { value: 'activity', label: 'Activity' },
        { value: 'settings', label: 'Settings' }
      ],
      iconOnly: [
        { value: 'overview', icon: WkiHouse },
        { value: 'activity', icon: WkiBell },
        { value: 'settings', icon: WkiSettings2 }
      ],
      labelAndIcon: [
        { value: 'overview', label: 'Overview', icon: WkiHouse },
        { value: 'activity', label: 'Activity', icon: WkiBell },
        { value: 'settings', label: 'Settings', icon: WkiSettings2 }
      ]
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:24px;align-items:flex-start;">
      <div style="display:flex;flex-direction:column;gap:8px;">
        <span style="color:#6b7280;font-size:13px;font-weight:500;">Label Only</span>
        <WkTabs size="sm" value="overview" :tabs="labelOnly" />
      </div>
      
      <div style="display:flex;flex-direction:column;gap:8px;">
        <span style="color:#6b7280;font-size:13px;font-weight:500;">Icon Only</span>
        <WkTabs size="sm" value="activity" :tabs="iconOnly" />
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        <span style="color:#6b7280;font-size:13px;font-weight:500;">Label + Icon</span>
        <WkTabs size="sm" value="settings" :tabs="labelAndIcon" />
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'Different variants of tabs: Label only, Icon only, and Label + Icon.' } }
}

export const AllSizes = () => ({
  components: { WkTabs },
  data() {
    return { tabs: DEMO_TABS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:20px;align-items:flex-start;">
      <div v-for="size in ['xs','sm','md','lg']" :key="size" style="display:flex;flex-direction:column;gap:6px;">
        <span style="color:#6b7280;font-size:12px;">{{ size }}</span>
        <WkTabs :size="size" value="overview" :tabs="tabs" />
      </div>
    </div>
  `
})
AllSizes.parameters = {
  docs: { description: { story: 'All four sizes with the same set of tabs.' } }
}

export const Interactive = () => ({
  components: { WkTabs },
  data() {
    return {
      active: 'overview',
      tabs: DEMO_TABS
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <WkTabs size="sm" :value="active" :tabs="tabs" @change="active = $event" />
      <code style="font-size:13px;">active = "{{ active }}"</code>
    </div>
  `
})
Interactive.parameters = {
  docs: { description: { story: 'Click a tab to switch. `@change` updates the active value.' } }
}

export const WithCounter = () => ({
  components: { WkTabs },
  data() {
    return {
      tabs: [
        { value: 'all', label: 'All', counter: 128 },
        { value: 'open', label: 'Open', counter: 6 },
        { value: 'closed', label: 'Closed', counter: 122 }
      ]
    }
  },
  template: `<WkTabs size="sm" value="open" :tabs="tabs" />`
})
WithCounter.parameters = {
  docs: { description: { story: 'Numeric counter badge via `counter` in the tab object.' } }
}

export const FocusVisible = () => ({
  components: { WkTabs },
  data() {
    return {
      tabs: [
        { value: 'a', label: 'Overview' },
        { value: 'b', label: 'Activity' },
        { value: 'c', label: 'Settings' }
      ]
    }
  },
  template: `<WkTabs size="sm" value="a" :tabs="tabs" />`
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through to verify `:focus-visible` ring on each tab button.' } }
}
