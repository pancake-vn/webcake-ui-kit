import WkTabs from '../../src/components/tabs/Tabs.vue'

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

const OVERVIEW_ICON = `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h4v4H4V4zm6 0h6v4h-6V4zm0 6h6v6h-6v-6zm-6 0h4v6H4v-6z" fill="currentColor"/></svg>`
const ACTIVITY_ICON = `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 3l-3 5H6v4h4l3 5V3z" fill="currentColor"/></svg>`
const SETTINGS_ICON = `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 7a3 3 0 100 6 3 3 0 000-6zm-5 3a5 5 0 1110 0 5 5 0 01-10 0z" fill="currentColor"/></svg>`

export const AllVariants = () => ({
  components: { WkTabs },
  data() {
    return {
      labelOnly: [
        { value: 'overview', label: 'Overview' },
        { value: 'activity', label: 'Activity' },
        { value: 'settings', label: 'Settings' }
      ],
      iconOnly: [
        { value: 'overview', icon: OVERVIEW_ICON },
        { value: 'activity', icon: ACTIVITY_ICON },
        { value: 'settings', icon: SETTINGS_ICON }
      ],
      labelAndIcon: [
        { value: 'overview', label: 'Overview', icon: OVERVIEW_ICON },
        { value: 'activity', label: 'Activity', icon: ACTIVITY_ICON },
        { value: 'settings', label: 'Settings', icon: SETTINGS_ICON }
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
        <WkTabs size="sm" value="activity" :tabs="iconOnly">
          <template #tab-icon="{ tab }">
            <span v-html="tab.icon" style="display:inline-flex;"></span>
          </template>
        </WkTabs>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        <span style="color:#6b7280;font-size:13px;font-weight:500;">Label + Icon</span>
        <WkTabs size="sm" value="settings" :tabs="labelAndIcon">
          <template #tab-icon="{ tab }">
            <span v-html="tab.icon" style="display:inline-flex;"></span>
          </template>
        </WkTabs>
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
