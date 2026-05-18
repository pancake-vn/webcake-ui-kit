import WkDropdown from '../../src/components/dropdown/Dropdown.vue'
import WkButton from '../../src/components/button/Button.vue'

const ITEMS_BASIC = [
  { key: 'edit', label: 'Edit' },
  { key: 'duplicate', label: 'Duplicate' },
  { key: 'divider-1', type: 'divider' },
  { key: 'delete', label: 'Delete', disabled: true }
]

const ITEMS_RICH = [
  { key: 'copy', label: 'Copy', extra: '⌘C' },
  { key: 'paste', label: 'Paste', extra: '⌘V' },
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
