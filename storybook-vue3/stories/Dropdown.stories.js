import WkDropdown from '../../src/components/dropdown/Dropdown.vue'
import WkButton from '../../src/components/button/Button.vue'
import {
  WkiSquareNumber,
  WkiCopy,
  WkiDownload,
  WkiPencil,
  WkiFile,
  WkiTrash,
  WkiUser,
  WkiSettings
} from '../../src/icons'

const ITEMS_BASIC = [
  { key: 'edit', label: 'Edit' },
  { key: 'duplicate', label: 'Duplicate' },
  { key: 'divider-1', type: 'divider' },
  { key: 'delete', label: 'Delete', disabled: true }
]

const ITEMS_RICH = [
  {
    key: 'copy',
    label: 'Copy',
    extra: '⌘C',
    icon: { component: WkiSquareNumber, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' }
  },
  {
    key: 'paste',
    label: 'Paste',
    extra: '⌘V',
    icon: { component: WkiSquareNumber, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' }
  },
  { key: 'divider-1', type: 'divider' },
  {
    key: 'export',
    label: 'Export as',
    type: 'group',
    children: [
      { key: 'export-png', label: 'PNG' },
      { key: 'export-svg', label: 'SVG' },
      { key: 'export-pdf', label: 'PDF' }
    ]
  }
]

export default {
  title: 'Overlays/Dropdown',
  component: WkDropdown,
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: ['bottom-start', 'bottom', 'bottom-end', 'top-start', 'top', 'top-end']
    },
    trigger: {
      control: { type: 'inline-radio' },
      options: [['click'], ['hover']]
    },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'antd-style floating menu. Default slot = trigger (any content). ' +
          '`#overlay` slot = floating content (any markup). ' +
          '`items` prop accepts a structured array for built-in menu items with labels, icons, extra text, ' +
          'groups, submenus, and dividers — no overlay slot needed. ' +
          '`trigger` array supports `"click"` and/or `"hover"`. ' +
          'Floating panel shares the `#wk-portal-root` with WkTooltip and WkDialog.'
      }
    }
  }
}

export const Primary = () => ({
  components: { WkDropdown, WkButton },
  data() {
    return { items: ITEMS_BASIC, selected: null }
  },
  methods: {
    onSelect(key) {
      this.selected = key
    }
  },
  template: `
    <div style="padding: 40px;">
      <WkDropdown :items="items" @select="onSelect">
        <WkButton variant="outline">Actions {{ selected ? '→ ' + selected : '' }}</WkButton>
      </WkDropdown>
    </div>
  `
})
Primary.parameters = {
  docs: { description: { story: 'Basic `items` prop with a divider and one disabled item.' } }
}

export const WithOverlaySlot = () => ({
  components: { WkDropdown, WkButton },
  data() {
    return { open: false }
  },
  template: `
    <div style="padding: 40px;">
      <WkDropdown v-model="open" placement="bottom-start">
        <WkButton variant="outline">Custom overlay</WkButton>
        <template #overlay>
          <div style="padding: 16px; min-width: 200px;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:500;">Custom content</p>
            <p style="margin:0;font-size:12px;color:#6b7280;">Any markup goes here — forms, lists, rich content.</p>
          </div>
        </template>
      </WkDropdown>
    </div>
  `
})
WithOverlaySlot.parameters = {
  docs: {
    description: {
      story:
        'Use the `#overlay` slot when you need custom markup instead of the built-in item renderer. ' +
        '`items` and `#overlay` are mutually exclusive — `items` takes priority when both are set.'
    }
  }
}

export const WithGroupsAndDividers = () => ({
  components: { WkDropdown, WkButton },
  data() {
    return { items: ITEMS_RICH, selected: null }
  },
  methods: {
    onSelect(key) {
      this.selected = key
    }
  },
  template: `
    <div style="padding: 40px;">
      <WkDropdown :items="items" @select="onSelect">
        <WkButton variant="outline">
          Format {{ selected ? '→ ' + selected : '' }}
        </WkButton>
      </WkDropdown>
    </div>
  `
})
WithGroupsAndDividers.parameters = {
  docs: {
    description: {
      story:
        'Item types: `"group"` renders a non-clickable label with flat children; ' +
        '`"divider"` renders a horizontal rule; `extra` adds a right-aligned shortcut label.'
    }
  }
}

export const HoverTrigger = () => ({
  components: { WkDropdown, WkButton },
  data() {
    return {
      items: [
        { key: 'profile', label: 'Profile' },
        { key: 'settings', label: 'Settings' },
        { key: 'logout', label: 'Logout' }
      ]
    }
  },
  template: `
    <div style="padding: 40px;">
      <WkDropdown :items="items" :trigger="['hover']">
        <WkButton variant="outline">Hover me</WkButton>
      </WkDropdown>
    </div>
  `
})
HoverTrigger.parameters = {
  docs: {
    description: { story: '`trigger="[\'hover\']"` — menu opens on mouseenter and closes on mouseleave (80ms delay).' }
  }
}

export const Placements = () => ({
  components: { WkDropdown, WkButton },
  data() {
    return {
      placements: [
        'bottom-start',
        'bottom',
        'bottom-end',
        'top-start',
        'top',
        'top-end',
        'left-start',
        'left',
        'left-end',
        'right-start',
        'right',
        'right-end'
      ],
      items: [
        { key: 'a', label: 'Option A' },
        { key: 'b', label: 'Option B' },
        { key: 'c', label: 'Option C' }
      ]
    }
  },
  template: `
    <div style="padding:80px 40px;display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
      <WkDropdown v-for="p in placements" :key="p" :items="items" :placement="p">
        <WkButton variant="outline" size="sm">{{ p }}</WkButton>
      </WkDropdown>
    </div>
  `
})
Placements.parameters = {
  docs: { description: { story: 'All 6 common placement values. Flips automatically when near the viewport edge.' } }
}

export const Disabled = () => ({
  components: { WkDropdown, WkButton },
  data() {
    return { items: ITEMS_BASIC }
  },
  template: `
    <div style="padding: 40px;">
      <WkDropdown :items="items" disabled>
        <WkButton variant="outline" disabled>Disabled trigger</WkButton>
      </WkDropdown>
    </div>
  `
})
Disabled.parameters = {
  docs: { description: { story: '`disabled` prop prevents opening regardless of trigger method.' } }
}

export const Controlled = () => ({
  components: { WkDropdown, WkButton },
  data() {
    return {
      open: false,
      items: ITEMS_BASIC
    }
  },
  template: `
    <div style="padding: 40px; display: flex; gap: 12px; align-items: center;">
      <WkDropdown :open="open" @change="open = $event" :items="items">
        <WkButton variant="outline">Controlled ({{ open ? 'open' : 'closed' }})</WkButton>
      </WkDropdown>
      <WkButton variant="ghost" @click="open = !open">Toggle externally</WkButton>
    </div>
  `
})
Controlled.parameters = {
  docs: {
    description: {
      story:
        'Controlled mode via `:open` + `@change`. ' +
        'Vue 2: `v-model` on the `open` prop. Vue 3: `v-model` (binds `modelValue`).'
    }
  }
}

export const AllVariants = () => ({
  components: { WkDropdown, WkButton },
  data() {
    return { items: ITEMS_BASIC }
  },
  template: `
    <div style="padding: 40px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
      <WkDropdown :items="items">
        <WkButton variant="primary">Primary trigger</WkButton>
      </WkDropdown>
      <WkDropdown :items="items">
        <WkButton variant="outline">Outline trigger</WkButton>
      </WkDropdown>
      <WkDropdown :items="items">
        <span style="cursor:pointer;padding:4px 8px;border-radius:6px;background:#f3f4f6;font-size:13px;">
          Any element
        </span>
      </WkDropdown>
      <WkDropdown :items="items" disabled>
        <WkButton variant="outline" disabled>Disabled</WkButton>
      </WkDropdown>
    </div>
  `
})

export const ItemSchema = () => ({
  components: { WkDropdown, WkButton },
  data() {
    return {
      selected: null,
      items: [
        {
          key: 'copy-action',
          type: 'item',
          label: 'Copy',
          title: 'Copy item to clipboard',
          icon: { component: WkiCopy, size: 16, color: 'var(--primary-fg)', strokeWidth: 1.75, fill: 'none' },
          extra: '⌘C'
        },
        {
          key: 'download-action',
          type: 'item',
          label: 'Download',
          title: 'Download file',
          icon: { component: WkiDownload, size: 16, color: '#6366f1', strokeWidth: 1.75, fill: 'none' },
          color: '#6366f1',
          extra: '⌘S'
        },
        {
          key: 'edit-action',
          type: 'item',
          label: 'Edit (disabled)',
          icon: { component: WkiPencil, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' },
          disabled: true
        },
        { key: 'divider-1', type: 'divider' },
        {
          key: 'export-group',
          type: 'group',
          label: 'Export as',
          children: [
            {
              key: 'export-png',
              label: 'PNG',
              extra: '.png',
              icon: { component: WkiFile, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' }
            },
            {
              key: 'export-svg',
              label: 'SVG',
              extra: '.svg',
              icon: { component: WkiFile, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' }
            },
            {
              key: 'export-pdf',
              label: 'PDF (disabled)',
              extra: '.pdf',
              icon: { component: WkiFile, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' },
              disabled: true
            }
          ]
        },
        { key: 'divider-2', type: 'divider' },
        {
          key: 'share-submenu',
          label: 'Share with',
          icon: { component: WkiUser, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' },
          children: [
            { key: 'share-link', label: 'Copy link', extra: '⌘L' },
            {
              key: 'share-settings',
              label: 'Manage access',
              icon: { component: WkiSettings, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' }
            }
          ]
        },
        { key: 'divider-3', type: 'divider' },
        {
          key: 'delete-action',
          type: 'item',
          label: 'Xóa dữ liệu',
          title: 'Xóa dữ liệu khỏi hệ thống',
          icon: { component: WkiTrash, size: 16, color: '#ff0000', strokeWidth: 1.75, fill: 'none' },
          color: '#ff0000',
          destructive: true,
          disabled: false,
          extra: '⌘D'
        }
      ]
    }
  },
  methods: {
    onSelect(key) {
      this.selected = key
    }
  },
  template: `
    <div style="padding: 40px;">
      <WkDropdown :items="items" @select="onSelect">
        <WkButton variant="outline">
          Item schema {{ selected ? '→ ' + selected : '' }}
        </WkButton>
      </WkDropdown>
    </div>
  `
})
ItemSchema.parameters = {
  docs: {
    description: {
      story: `
Every field accepted by an item object:

\`\`\`js
{
  key: 'delete-action',   // unique identifier, emitted on @select
  type: 'item',           // 'item' (default) | 'divider' | 'group'
  label: 'Xóa dữ liệu',  // display text
  title: 'Tooltip text',  // native title attribute (hover tooltip)
  icon: {                 // icon object
    component: TrashIcon, // Vue component — rendered via <component :is>
    size: 16,             // icon size (px)
    color: '#ff0000',     // icon color
    strokeWidth: 1.75,    // stroke width
    fill: 'none',         // fill
  },
  color: '#ff0000',       // CSS color applied to the label text
  destructive: true,      // adds --destructive modifier (red theme)
  disabled: false,        // prevents click + grays out the row
  extra: '⌘ + D',         // right-aligned shortcut / badge text
  children: []            // type 'group' → flat labeled section;
                          // no type → submenu panel (chevron added automatically)
}
\`\`\`
      `.trim()
    }
  }
}

export const Sizes = () => ({
  components: { WkDropdown, WkButton },
  data() {
    return { items: ITEMS_RICH, sizes: ['sm', 'md', 'lg'] }
  },
  template: `
    <div style="padding: 40px; display:flex; gap:16px; align-items:flex-start;">
      <div v-for="s in sizes" :key="s" style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <span style="color:var(--muted-fg);font-size:12px;">size = {{ s }}</span>
        <WkDropdown :items="items" :size="s">
          <WkButton variant="outline" :size="s">{{ s }}</WkButton>
        </WkDropdown>
      </div>
    </div>
  `
})
Sizes.parameters = {
  docs: {
    description: {
      story:
        '`size` (`sm` · `md` · `lg`) controls the density of the menu items (via `DropdownMenuItems`). ' +
        'Click a trigger to open the menu and compare row heights.'
    }
  }
}

export const WithSubmenu = () => ({
  components: { WkDropdown, WkButton },
  data() {
    return {
      selected: null,
      items: [
        { key: 'new-file', label: 'New file', extra: '⌘N' },
        { key: 'open', label: 'Open...', extra: '⌘O' },
        {
          key: 'open-recent',
          label: 'Open recent',
          icon: { component: WkiFile, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' },
          children: [
            { key: 'recent-1', label: 'design-system.fig' },
            { key: 'recent-2', label: 'landing-page.fig' },
            { key: 'recent-3', label: 'mobile-app.fig' }
          ]
        },
        { key: 'divider-1', type: 'divider' },
        {
          key: 'export',
          label: 'Export as',
          icon: { component: WkiDownload, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' },
          children: [
            { key: 'export-png', label: 'PNG', extra: '.png' },
            { key: 'export-svg', label: 'SVG', extra: '.svg' },
            { key: 'export-pdf', label: 'PDF', extra: '.pdf' }
          ]
        },
        { key: 'divider-2', type: 'divider' },
        {
          key: 'share',
          label: 'Share with',
          icon: { component: WkiUser, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' },
          children: [
            { key: 'share-link', label: 'Copy link', extra: '⌘L' },
            {
              key: 'share-access',
              label: 'Manage access',
              icon: { component: WkiSettings, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' }
            }
          ]
        }
      ]
    }
  },
  methods: {
    onSelect(key) {
      this.selected = key
    }
  },
  template: `
    <div style="padding: 40px;">
      <WkDropdown :items="items" @select="onSelect" width="auto">
        <WkButton variant="outline">
          File {{ selected ? '→ ' + selected : '' }}
        </WkButton>
      </WkDropdown>
    </div>
  `
})
WithSubmenu.parameters = {
  docs: {
    description: {
      story: `
An item with \`children\` but **no \`type\`** becomes a submenu — clicking it opens a nested panel to the side. A chevron is rendered automatically.

Compare with \`type: "group"\` (children are shown inline as a flat labeled section, no click needed).

\`\`\`js
// Submenu — click to open a nested panel
{
  key: 'export',
  label: 'Export as',
  icon: { component: DownloadIcon, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' },
  children: [
    { key: 'export-png', label: 'PNG' },
    { key: 'export-svg', label: 'SVG' },
  ]
}

// Group — children rendered flat under a label header (no click)
{
  key: 'export-group',
  type: 'group',
  label: 'Export as',
  children: [
    { key: 'export-png', label: 'PNG' },
    { key: 'export-svg', label: 'SVG' },
  ]
}
\`\`\`
      `.trim()
    }
  }
}

export const WithDescription = () => ({
  components: { WkDropdown, WkButton },
  data() {
    return {
      selected: null,
      items: [
        {
          key: 'profile',
          label: 'Profile',
          description: 'View and edit your personal info',
          icon: { component: WkiUser, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' }
        },
        {
          key: 'settings',
          label: 'Settings',
          description: 'Manage preferences and integrations',
          icon: { component: WkiSettings, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' }
        },
        { key: 'divider-1', type: 'divider' },
        {
          key: 'delete',
          label: 'Delete account',
          description: 'Permanently remove your account and data',
          icon: { component: WkiTrash, size: 16, color: '#ef4444', strokeWidth: 1.75, fill: 'none' },
          destructive: true
        }
      ]
    }
  },
  methods: {
    onSelect(key) {
      this.selected = key
    }
  },
  template: `
    <div style="padding: 40px;">
      <WkDropdown :items="items" @select="onSelect">
        <WkButton variant="outline">
          Account {{ selected ? '→ ' + selected : '' }}
        </WkButton>
      </WkDropdown>
    </div>
  `
})
WithDescription.parameters = {
  docs: {
    description: {
      story: `
Add a \`description\` field to any item to show a secondary line of text below the label.
Useful for actions that need extra context.

\`\`\`js
{
  key: 'settings',
  label: 'Settings',
  description: 'Manage preferences and integrations',
  icon: { component: SettingsIcon, size: 16, color: 'var(--muted-fg)', strokeWidth: 1.75, fill: 'none' }
}
\`\`\`
      `.trim()
    }
  }
}

export const WithGroupHeader = () => ({
  components: { WkDropdown, WkButton },
  data() {
    return {
      selected: null,
      items: [
        {
          key: 'text-group',
          type: 'group',
          label: 'Text',
          children: [
            { key: 'bold', label: 'Bold', extra: '⌘B' },
            { key: 'italic', label: 'Italic', extra: '⌘I' },
            { key: 'underline', label: 'Underline', extra: '⌘U' }
          ]
        },
        { key: 'divider-1', type: 'divider' },
        {
          key: 'align-group',
          type: 'group',
          label: 'Alignment',
          children: [
            { key: 'align-left', label: 'Left' },
            { key: 'align-center', label: 'Center' },
            { key: 'align-right', label: 'Right' }
          ]
        }
      ]
    }
  },
  methods: {
    onSelect(key) {
      this.selected = key
    }
  },
  template: `
    <div style="padding: 40px;">
      <WkDropdown :items="items" @select="onSelect">
        <WkButton variant="outline">
          Format {{ selected ? '→ ' + selected : '' }}
        </WkButton>
      </WkDropdown>
    </div>
  `
})
WithGroupHeader.parameters = {
  docs: {
    description: {
      story: `
\`type: "group"\` renders a non-clickable section label with its children listed flat below it (no indentation, no chevron).
Use this for categorising related actions within the same menu level.

\`\`\`js
{
  key: 'text-group',
  type: 'group',
  label: 'Text',
  children: [
    { key: 'bold',      label: 'Bold',      extra: '⌘B' },
    { key: 'italic',    label: 'Italic',    extra: '⌘I' },
    { key: 'underline', label: 'Underline', extra: '⌘U' },
  ]
}
\`\`\`
      `.trim()
    }
  }
}
