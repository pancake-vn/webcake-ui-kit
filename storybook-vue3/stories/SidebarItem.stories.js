import WkSidebarItem from '../../src/components/sidebar-item/SidebarItem.vue'

export default {
  title: 'Components/Layout/SidebarItem',
  component: WkSidebarItem,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['regular', 'large'] },
    level: { control: { type: 'inline-radio' }, options: [1, 2] },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    hasChildren: { control: 'boolean' },
    expanded: { control: 'boolean' },
    collapsed: { control: 'boolean' },
    label: { control: 'text' },
    badge: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Navigation item for sidebar menus. Renders as a `<button>`. ' +
          '`active` marks current page (`aria-current="page"`). `hasChildren` shows a chevron — emits `toggle` on click. ' +
          '`badge` shows a trailing count. `#icon` slot adds a leading icon. `level=2` applies sub-item indent.'
      }
    }
  }
}

const Template = args => ({
  components: { WkSidebarItem },
  setup() {
    return { args }
  },
  template: `<div style="width:240px;"><WkSidebarItem v-bind="args" /></div>`
})

export const Primary = Template.bind({})
Primary.args = { label: 'Dashboard', size: 'regular' }

export const AllVariants = () => ({
  components: { WkSidebarItem },
  template: `
    <div style="display:flex;flex-direction:column;gap:2px;width:240px;">
      <WkSidebarItem label="Default" />
      <WkSidebarItem label="Active" active />
      <WkSidebarItem label="Disabled" disabled />
      <WkSidebarItem label="With badge" badge="5" />
      <WkSidebarItem label="Has children (collapsed)" hasChildren />
      <WkSidebarItem label="Has children (expanded)" hasChildren :expanded="true" />
      <WkSidebarItem label="Level 2 item" :level="2" />
      <WkSidebarItem label="Large" size="large" />
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'All variant combinations in a typical sidebar layout.' } }
}

export const WithIcon = () => ({
  components: { WkSidebarItem },
  template: `
    <div style="display:flex;flex-direction:column;gap:2px;width:240px;">
      <WkSidebarItem label="Home">
        <template #icon>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2 7L8 2l6 5v7H10v-4H6v4H2V7z" stroke-linejoin="round"/>
          </svg>
        </template>
      </WkSidebarItem>
      <WkSidebarItem label="Settings" active>
        <template #icon>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="8" cy="8" r="2.5"/>
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke-linecap="round"/>
          </svg>
        </template>
      </WkSidebarItem>
      <WkSidebarItem label="Reports" badge="12">
        <template #icon>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="2" width="10" height="12" rx="1"/>
            <path d="M6 6h4M6 9h4M6 12h2" stroke-linecap="round"/>
          </svg>
        </template>
      </WkSidebarItem>
    </div>
  `
})
WithIcon.parameters = {
  docs: { description: { story: '`#icon` slot adds a leading icon. Combines with `active` and `badge`.' } }
}

export const CollapsibleTree = () => ({
  components: { WkSidebarItem },
  data() {
    return { projectsOpen: true }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:2px;width:240px;">
      <WkSidebarItem label="Dashboard" active />
      <WkSidebarItem
        label="Projects"
        hasChildren
        :expanded="projectsOpen"
        @toggle="projectsOpen = !projectsOpen"
      />
      <template v-if="projectsOpen">
        <WkSidebarItem label="Website Redesign" :level="2" />
        <WkSidebarItem label="Mobile App" :level="2" badge="3" />
        <WkSidebarItem label="API Migration" :level="2" />
      </template>
      <WkSidebarItem label="Settings" />
    </div>
  `
})
CollapsibleTree.parameters = {
  docs: { description: { story: 'Click "Projects" to collapse/expand the nested items.' } }
}

export const FocusVisible = () => ({
  components: { WkSidebarItem },
  template: `
    <div style="display:flex;flex-direction:column;gap:2px;width:240px;">
      <WkSidebarItem label="Home" />
      <WkSidebarItem label="Active item" active />
      <WkSidebarItem label="With children" hasChildren />
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through items to verify `:focus-visible` ring.' } }
}
