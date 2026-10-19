import WkSidebar from '../../src/components/sidebar/Sidebar.vue'
import { WkiLayoutDashboard, WkiMail, WkiSettings, WkiUser, WkiFolder, WkiBell } from '../../src/icons'

export default {
  title: 'Layout/Sidebar',
  component: WkSidebar,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['regular', 'large'] }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Navigation sidebar that accepts an Ant-Design-Menu-like `items` tree. ' +
          'Supports leaf items, collapsible submenus, group labels, dividers, icons, and badges. ' +
          '`activeKey` / `v-model:activeKey` tracks the selected leaf. ' +
          '`defaultOpenKeys` seeds the open state (uncontrolled); `openKeys` gives full control. ' +
          '`#header` and `#footer` slots anchor persistent content above and below the menu.'
      }
    }
  }
}

const BASIC_ITEMS = [
  { key: 'dashboard', label: 'Dashboard' },
  {
    key: 'reports',
    label: 'Reports',
    children: [
      { key: 'reports-weekly', label: 'Weekly' },
      { key: 'reports-monthly', label: 'Monthly' },
      { key: 'reports-annual', label: 'Annual' }
    ]
  },
  { key: 'messages', label: 'Messages', badge: '4' },
  { key: 'divider-1', type: 'divider' },
  {
    key: 'grp-settings',
    type: 'group',
    label: 'Settings',
    children: [
      { key: 'profile', label: 'Profile' },
      { key: 'billing', label: 'Billing' },
      { key: 'security', label: 'Security', disabled: true }
    ]
  }
]

export const Primary = () => ({
  components: { WkSidebar },
  data() {
    return {
      activeKey: 'dashboard',
      items: BASIC_ITEMS
    }
  },
  template: `
    <div style="width:260px;height:400px;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
      <WkSidebar :items="items" v-model:activeKey="activeKey" :default-open-keys="['reports']" />
    </div>
  `
})
Primary.parameters = {
  docs: { description: { story: 'Default sidebar with a submenu open. Click items to change the active key.' } }
}

export const AllVariants = () => ({
  components: { WkSidebar },
  data() {
    return {
      activeKey: '1',
      items: [
        { key: '1', label: 'Leaf item (active)' },
        {
          key: '2',
          label: 'Submenu',
          children: [
            { key: '2-1', label: 'Child one' },
            { key: '2-2', label: 'Child two' },
            { key: '2-3', label: 'Nested submenu', children: [{ key: '2-3-1', label: 'Deep leaf' }] }
          ]
        },
        { key: 'd1', type: 'divider' },
        {
          key: 'grp',
          type: 'group',
          label: 'Group label',
          children: [
            { key: '3', label: 'Group leaf' },
            { key: '4', label: 'With badge', badge: '12' },
            { key: '5', label: 'Disabled', disabled: true }
          ]
        }
      ]
    }
  },
  template: `
    <div style="width:260px;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
      <WkSidebar :items="items" :active-key="activeKey" :default-open-keys="['2', '2-3']" @select="activeKey = $event" />
    </div>
  `
})
AllVariants.parameters = {
  docs: {
    description: { story: 'All item types: leaf, submenu (including nested), divider, group, badge, and disabled.' }
  }
}

export const WithIcons = () => ({
  components: { WkSidebar },
  data() {
    return {
      activeKey: 'dashboard',
      items: [
        { key: 'dashboard', label: 'Dashboard', icon: WkiLayoutDashboard },
        { key: 'inbox', label: 'Inbox', icon: WkiMail, badge: '3' },
        {
          key: 'files',
          label: 'Files',
          icon: WkiFolder,
          children: [
            { key: 'files-recent', label: 'Recent' },
            { key: 'files-shared', label: 'Shared' }
          ]
        },
        { key: 'team', label: 'Team', icon: WkiUser },
        { key: 'divider-1', type: 'divider' },
        { key: 'notifications', label: 'Notifications', icon: WkiBell },
        { key: 'settings', label: 'Settings', icon: WkiSettings, disabled: true }
      ]
    }
  },
  template: `
    <div style="width:260px;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
      <WkSidebar :items="items" :active-key="activeKey" :default-open-keys="['files']" @select="activeKey = $event" />
    </div>
  `
})
WithIcons.parameters = {
  docs: {
    description: {
      story:
        'Pass icon component references in the item `icon` field — rendered via `<component :is="item.icon" :size="20" />`.'
    }
  }
}

export const Matrix = () => ({
  components: { WkSidebar },
  data() {
    return {
      items: [
        { key: '1', label: 'Dashboard' },
        {
          key: '2',
          label: 'Reports',
          children: [
            { key: '2-1', label: 'Weekly' },
            { key: '2-2', label: 'Monthly' }
          ]
        },
        { key: '3', label: 'Disabled', disabled: true }
      ]
    }
  },
  template: `
    <div style="display:flex;gap:32px;align-items:flex-start;">
      <div>
        <p style="margin:0 0 8px;font-size:11px;color:var(--muted-fg);">size=regular</p>
        <div style="width:220px;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <WkSidebar :items="items" active-key="1" :default-open-keys="['2']" size="regular" />
        </div>
      </div>
      <div>
        <p style="margin:0 0 8px;font-size:11px;color:var(--muted-fg);">size=large</p>
        <div style="width:220px;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <WkSidebar :items="items" active-key="1" :default-open-keys="['2']" size="large" />
        </div>
      </div>
    </div>
  `
})
Matrix.parameters = {
  docs: { description: { story: '`size` prop applied across the full tree: `regular` (default) vs `large`.' } }
}

export const Controlled = () => ({
  components: { WkSidebar },
  data() {
    return {
      activeKey: 'dashboard',
      openKeys: ['reports'],
      items: [
        { key: 'dashboard', label: 'Dashboard' },
        {
          key: 'reports',
          label: 'Reports',
          children: [
            { key: 'reports-weekly', label: 'Weekly' },
            { key: 'reports-monthly', label: 'Monthly' }
          ]
        },
        { key: 'settings', label: 'Settings' }
      ]
    }
  },
  methods: {
    onToggle(key) {
      const idx = this.openKeys.indexOf(key)
      this.openKeys =
        idx === -1 ? this.openKeys.concat(key) : this.openKeys.slice(0, idx).concat(this.openKeys.slice(idx + 1))
    }
  },
  template: `
    <div style="display:flex;gap:24px;align-items:flex-start;">
      <div style="width:240px;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
        <WkSidebar
          :items="items"
          :active-key="activeKey"
          :open-keys="openKeys"
          @select="activeKey = $event"
          @toggle="onToggle"
        />
      </div>
      <div style="font-size:13px;color:var(--muted-fg);line-height:1.8;">
        <div>activeKey: <strong>{{ activeKey }}</strong></div>
        <div>openKeys: <strong>{{ openKeys.join(', ') || '—' }}</strong></div>
      </div>
    </div>
  `
})
Controlled.parameters = {
  docs: {
    description: {
      story:
        'Fully controlled mode: `open-keys` and `active-key` are managed by the parent. State is shown to the right.'
    }
  }
}

export const HeaderFooterSlots = () => ({
  components: { WkSidebar },
  data() {
    return {
      activeKey: 'dashboard',
      items: [
        { key: 'dashboard', label: 'Dashboard' },
        {
          key: 'projects',
          label: 'Projects',
          children: [
            { key: 'proj-1', label: 'Website' },
            { key: 'proj-2', label: 'Mobile App' }
          ]
        },
        { key: 'settings', label: 'Settings' }
      ]
    }
  },
  template: `
    <div style="width:260px;height:420px;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
      <WkSidebar :items="items" :active-key="activeKey" @select="activeKey = $event">
        <template #header>
          <div style="padding:12px 8px 8px;font-weight:600;font-size:14px;border-bottom:1px solid var(--border);margin-bottom:4px;">
            Acme Corp
          </div>
        </template>
        <template #footer>
          <div style="padding:8px;border-top:1px solid var(--border);margin-top:4px;font-size:12px;color:var(--muted-fg);">
            v1.0.0
          </div>
        </template>
      </WkSidebar>
    </div>
  `
})
HeaderFooterSlots.parameters = {
  docs: {
    description: {
      story:
        '`#header` anchors content above the menu (e.g. logo/workspace name); `#footer` anchors content below (e.g. version, user info).'
    }
  }
}

export const FocusVisible = () => ({
  components: { WkSidebar },
  data() {
    return {
      items: [
        { key: '1', label: 'Dashboard' },
        {
          key: '2',
          label: 'Reports',
          children: [
            { key: '2-1', label: 'Weekly' },
            { key: '2-2', label: 'Monthly' }
          ]
        },
        { key: '3', label: 'Settings' }
      ]
    }
  },
  template: `
    <div style="width:260px;border:1px solid var(--border);border-radius:8px;overflow:hidden;" tabindex="0">
      <WkSidebar :items="items" :default-open-keys="['2']" />
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through items to verify the `:focus-visible` ring on each button.' } }
}
