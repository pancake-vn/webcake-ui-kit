<template>
  <nav v-if="root" class="ui-sidebar" :class="{ 'ui-sidebar--collapsed': collapsed }" role="navigation">
    <div v-if="$slots.header || ($scopedSlots && $scopedSlots.header)" class="ui-sidebar__header">
      <slot name="header" />
    </div>
    <Sidebar
      :items="items"
      :root="false"
      :level="1"
      :active-key="resolvedActiveKey"
      :open-keys="resolvedOpenKeys"
      :collapsed="collapsed"
      :size="size"
      @select="onSelect"
      @toggle="onToggle"
    />
    <div v-if="$slots.footer || ($scopedSlots && $scopedSlots.footer)" class="ui-sidebar__footer">
      <slot name="footer" />
    </div>
  </nav>
  <ul v-else class="ui-sidebar__menu" :class="`ui-sidebar__menu--level-${level}`">
    <template v-for="(item, index) in items">
      <!-- Divider -->
      <li
        v-if="item.type === 'divider'"
        :key="item.key || `divider-${index}`"
        class="ui-sidebar__divider"
        role="separator"
      ></li>

      <!-- Group: a labelled, non-collapsible section -->
      <li v-else-if="item.type === 'group'" :key="item.key || `group-${index}`" class="ui-sidebar__group">
        <WkSidebarGroupLabel v-if="!collapsed" :label="item.label">
          <template #action v-if="item.icon">
            <component :is="item.icon" :size="14" color="var(--muted-fg)" />
          </template>
        </WkSidebarGroupLabel>
        <Sidebar
          :items="item.children || []"
          :root="false"
          :level="level"
          :active-key="activeKey"
          :open-keys="openKeys"
          :collapsed="collapsed"
          :size="size"
          @select="$emit('select', $event)"
          @toggle="$emit('toggle', $event)"
        />
      </li>

      <!-- Submenu: collapsible item with nested children -->
      <li v-else-if="item.children && item.children.length" :key="item.key" class="ui-sidebar__submenu">
        <WkSidebarItem
          :label="item.label"
          :size="size"
          :level="level >= 2 ? 2 : 1"
          :has-children="true"
          :expanded="isOpen(item.key)"
          :collapsed="collapsed"
          :disabled="!!item.disabled"
          @toggle="$emit('toggle', item.key)"
        >
          <template v-if="item.icon" #icon>
            <component :is="item.icon" :size="20" />
          </template>
        </WkSidebarItem>
        <Sidebar
          v-show="isOpen(item.key) && !collapsed"
          :items="item.children"
          :root="false"
          :level="level + 1"
          :active-key="activeKey"
          :open-keys="openKeys"
          :collapsed="collapsed"
          :size="size"
          @select="$emit('select', $event)"
          @toggle="$emit('toggle', $event)"
        />
      </li>

      <!-- Leaf: a selectable navigation item -->
      <li v-else :key="item.key" class="ui-sidebar__leaf">
        <WkSidebarItem
          :label="item.label"
          :size="size"
          :level="level >= 2 ? 2 : 1"
          :active="item.key === activeKey"
          :collapsed="collapsed"
          :disabled="!!item.disabled"
          :badge="item.badge != null ? String(item.badge) : ''"
          @click="$emit('select', item.key)"
        >
          <template v-if="item.icon" #icon>
            <component :is="item.icon" :size="20" />
          </template>
        </WkSidebarItem>
      </li>
    </template>
  </ul>
</template>

<script>
import WkSidebarItem from '../sidebar-item/SidebarItem.vue'
import WkSidebarGroupLabel from '../sidebar-group-label/SidebarGroupLabel.vue'
import { WkiChevronRight } from '../../icons'

export default {
  name: 'Sidebar',

  components: {
    WkSidebarItem,
    WkSidebarGroupLabel,
    WkiChevronRight
  },

  props: {
    // Menu tree (Ant-Design-Menu-like shape).
    // Item fields: { key, label, icon?, badge?, disabled?, children?, type?: 'group' | 'divider' }
    items: {
      type: Array,
      default: () => []
    },
    // Currently selected leaf key. Supports v-model via `update:activeKey`.
    activeKey: {
      type: String,
      default: ''
    },
    // Controlled set of expanded submenu keys. When null, the component manages its own state.
    openKeys: {
      type: Array,
      default: null
    },
    // Initially expanded submenu keys (uncontrolled).
    defaultOpenKeys: {
      type: Array,
      default: () => []
    },
    // Icon-only collapsed rail.
    collapsed: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'regular',
      validator: v => ['regular', 'large'].indexOf(v) !== -1
    },
    // Internal: recursion depth (drives nested indent).
    level: {
      type: Number,
      default: 1
    },
    // Internal: only the root instance owns state and renders the <nav> wrapper.
    root: {
      type: Boolean,
      default: true
    }
  },

  emits: ['select', 'update:activeKey', 'toggle', 'open-change'],

  data() {
    return {
      innerActiveKey: this.activeKey,
      innerOpenKeys: (this.openKeys || this.defaultOpenKeys || []).slice()
    }
  },

  computed: {
    isControlledOpen() {
      return this.openKeys !== null
    },
    resolvedActiveKey() {
      return this.innerActiveKey
    },
    resolvedOpenKeys() {
      return this.isControlledOpen ? this.openKeys : this.innerOpenKeys
    }
  },

  watch: {
    activeKey(v) {
      this.innerActiveKey = v
    }
  },

  methods: {
    isOpen(key) {
      const keys = this.openKeys || this.innerOpenKeys
      return keys.indexOf(key) !== -1
    },
    onSelect(key) {
      this.innerActiveKey = key
      this.$emit('select', key)
      this.$emit('update:activeKey', key)
    },
    onToggle(key) {
      const cur = this.resolvedOpenKeys
      const idx = cur.indexOf(key)
      const next = idx === -1 ? cur.concat(key) : cur.slice(0, idx).concat(cur.slice(idx + 1))
      if (!this.isControlledOpen) this.innerOpenKeys = next
      this.$emit('toggle', key)
      this.$emit('open-change', next)
    }
  }
}
</script>

<style src="./sidebar.css" scoped></style>
