<template>
  <div class="ui-dropdown-items">
    <div v-for="item in normalizedItems" :key="item._key" class="ui-dropdown-items__entry">
      <!-- Divider -->
      <WkDivider v-if="item._type === 'divider'" />

      <WkMenuItem
        v-else
        :label="item.label"
        :key="item._key"
        :active="isActive(item.key)"
        :disabled="item.disabled"
        :type="item.destructive ? 'error' : 'default'"
        :show-checked="showChecked"
        @click="onItemClick(item)"
      >
        <template #prefix v-if="item.icon">
          <component
            :is="item.icon"
            v-if="item.icon && isComponent(item.icon)"
            :size="['sm', 'md'].includes(size) ? 16 : 20"
            :color="item.colorIcon"
          />
        </template>
        <template #suffix>
          <span v-if="item.extra" class="ui-dropdown-items__extra">{{ item.extra }}</span>
          <WkiCheck v-if="isActive(item.key) && showChecked" :size="16" color="var(--muted-fg)" />
        </template>
      </WkMenuItem>
    </div>
  </div>
</template>

<script>
import WkiCheck from '../../icons/Check.vue'
import WkDivider from '../divider/Divider.vue'
import WkMenuItem from '../menuitem/MenuItem.vue'

function skipReactive(val) {
  if (val && typeof val === 'object' && !val.__v_skip) {
    val.__v_skip = true
  }
}

export default {
  name: 'DropdownMenuItems',

  components: { WkiCheck, WkDivider, WkMenuItem },

  props: {
    items: {
      type: Array,
      default: function () {
        return []
      }
    },
    value: {
      type: [String, Array],
      default: null
    },
    size: {
      type: String,
      default: 'md'
    },
    showChecked: {
      type: Boolean,
      default: false
    }
  },

  emits: ['select'],

  computed: {
    normalizedItems() {
      return (this.items || []).map(function (item, i) {
        skipReactive(item.icon)
        return Object.assign({}, item, {
          _type: item.type === 'divider' ? 'divider' : 'item',
          _key: item.key != null ? String(item.key) : 'item-' + i
        })
      })
    }
  },

  methods: {
    isComponent(val) {
      return val !== null && typeof val === 'object'
    },
    isActive(key) {
      if (this.value === null || this.value === undefined) return false
      if (Array.isArray(this.value)) return this.value.indexOf(key) !== -1
      return this.value === key
    },
    onItemClick(item, parentItem) {
      if (item.disabled || (parentItem && parentItem.disabled)) return
      this.$emit('select', item.key)
    }
  }
}
</script>

<style src="./dropdown-menu-items.css" scoped></style>
