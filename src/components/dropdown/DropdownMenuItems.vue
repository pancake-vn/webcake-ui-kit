<template>
  <div class="ui-dropdown-items" :class="{ 'ui-dropdown-items--tree': hasChildItems }">
    <div class="ui-dropdown-items__list" :style="blockWidth ? { width: blockWidth + 'px' } : null">
      <div v-for="item in normalizedItems" :key="item._key" class="ui-dropdown-items__entry">
        <!-- Divider -->
        <WkDivider v-if="item._type === 'divider'" />

        <!-- Group header -->
        <div v-else-if="item._type === 'group-header'" class="ui-dropdown-items__group-header">
          <component
            v-if="item._icon"
            :is="item._icon.component"
            :size="item._icon.size || ['sm', 'md'].includes(size) ? 16 : 20"
            :color="item._icon.color"
            :stroke-width="item._icon.strokeWidth"
            :fill="item._icon.fill"
          />
          <span>{{ item.label }}</span>
        </div>

        <WkMenuItem
          v-else
          :label="item.label"
          :description="item.description"
          :active="isActive(item.key) || openParentKey === item.key"
          :disabled="item.disabled"
          :type="item.destructive ? 'error' : 'default'"
          :show-checked="showChecked"
          @click="onItemClick(item)"
          :data-key="item.key"
        >
          <template #prefix v-if="item._icon">
            <component
              :is="item._icon.component"
              :size="item._icon.size || ['sm', 'md'].includes(size) ? 16 : 20"
              :color="item._icon.color"
              :stroke-width="item._icon.strokeWidth"
              :fill="item._icon.fill"
            />
          </template>
          <template #suffix>
            <span v-if="item.extra" class="ui-dropdown-items__extra">{{ item.extra }}</span>
            <WkiChevronRight v-if="item.children && item.children.length" :size="16" color="var(--muted-fg)" />
            <WkiCheck v-else-if="isActive(item.key) && showChecked" :size="16" color="var(--muted-fg)" />
          </template>
        </WkMenuItem>
      </div>
    </div>

    <!-- Lazy recursive child panel — created on click, destroyed on second click -->
    <template v-if="activeItem">
      <WkDivider direction="vertical" />
      <DropdownMenuItems
        :items="activeItem.children"
        :value="value"
        :size="size"
        :show-checked="showChecked"
        :block-width="activeItem.blockWidth || null"
        @select="$emit('select', $event)"
      />
    </template>
  </div>
</template>

<script>
import WkiCheck from '../../icons/Check.vue'
import WkiChevronRight from '../../icons/ChevronRight.vue'
import WkDivider from '../divider/Divider.vue'
import WkMenuItem from '../menuitem/MenuItem.vue'

function skipReactive(val) {
  if (val && typeof val === 'object' && !val.__v_skip) {
    val.__v_skip = true
  }
}

function normalizeIcon(icon, colorIcon) {
  if (!icon) return null
  var isObj = icon && typeof icon === 'object' && icon.component
  var component = isObj ? icon.component : icon
  skipReactive(component)
  return {
    component: component,
    size: isObj && icon.size,
    color: (isObj && icon.color) || colorIcon,
    strokeWidth: isObj && icon.strokeWidth,
    fill: isObj && icon.fill
  }
}

export default {
  name: 'DropdownMenuItems',

  components: { WkiCheck, WkiChevronRight, WkDivider, WkMenuItem },

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
    },
    blockWidth: {
      type: Number,
      default: null
    }
  },

  emits: ['select'],

  data: function () {
    return {
      openParentKey: null
    }
  },

  created: function () {
    this.syncOpenParentKey()
  },

  watch: {
    value: 'syncOpenParentKey'
  },

  computed: {
    normalizedItems() {
      var result = []
      ;(this.items || []).forEach(function (item, i) {
        if (item.type === 'group' && Array.isArray(item.children)) {
          result.push({
            _type: 'group-header',
            _key: 'group-' + i,
            label: item.label || '',
            _icon: normalizeIcon(item.icon, null)
          })
          item.children.forEach(function (child, j) {
            result.push(
              Object.assign({}, child, {
                _type: child.type === 'divider' ? 'divider' : 'item',
                _key: child.key != null ? String(child.key) : 'group-' + i + '-item-' + j,
                _icon: normalizeIcon(child.icon, child.colorIcon)
              })
            )
          })
        } else {
          result.push(
            Object.assign({}, item, {
              _type: item.type === 'divider' ? 'divider' : 'item',
              _key: item.key != null ? String(item.key) : 'item-' + i,
              _icon: normalizeIcon(item.icon, item.colorIcon)
            })
          )
        }
      })
      return result
    },
    hasChildItems() {
      return this.normalizedItems.some(function (item) {
        return item.children && item.children.length
      })
    },
    activeItem() {
      if (!this.openParentKey) return null
      var key = this.openParentKey
      return (
        this.normalizedItems.find(function (item) {
          return item.key === key
        }) || null
      )
    }
  },

  methods: {
    isActive(key) {
      if (this.value === null || this.value === undefined) return false
      if (Array.isArray(this.value)) return this.value.indexOf(key) !== -1
      return this.value === key
    },
    onItemClick(item) {
      if (item.disabled) return
      if (item.children && item.children.length) {
        this.openParentKey = this.openParentKey === item.key ? null : item.key
        return
      }
      this.$emit('select', item.key)
    },
    containsValueDeep: function (items, values) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i]
        if (values.indexOf(item.key) !== -1) return true
        if (item.children && item.children.length) {
          if (this.containsValueDeep(item.children, values)) return true
        }
      }
      return false
    },
    syncOpenParentKey: function () {
      if (this.value === null || this.value === undefined) return
      var values = Array.isArray(this.value) ? this.value : [this.value]
      var self = this
      var found = null
      this.normalizedItems.forEach(function (item) {
        if (found !== null) return
        if (item.children && item.children.length) {
          if (self.containsValueDeep(item.children, values)) {
            found = item.key
          }
        }
      })
      if (found !== null) {
        this.openParentKey = found
      }
    }
  }
}
</script>

<style src="./dropdown-menu-items.css" scoped></style>
