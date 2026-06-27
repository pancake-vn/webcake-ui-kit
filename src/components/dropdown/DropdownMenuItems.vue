<template>
  <div class="ui-dropdown-items">
    <div v-for="item in normalizedItems" :key="item._key" class="ui-dropdown-items__entry">
      <!-- Divider -->
      <div v-if="item._type === 'divider'" class="ui-dropdown-items__divider"></div>

      <!-- Group: non-clickable label + flat children -->
      <div v-else-if="item._type === 'group'" class="ui-dropdown-items__group">
        <div class="ui-dropdown-items__group-label" :title="item.title || undefined">
          <component :is="item.icon" v-if="item.icon && isComponent(item.icon)" :size="20" :color="item.colorIcon" />
          <span :style="item.color ? { color: item.color } : undefined">{{ item.label }}</span>
        </div>
        <div
          v-for="child in item.children || []"
          :key="child.key"
          class="ui-dropdown-items__item"
          :class="{
            'ui-dropdown-items__item--disabled': child.disabled,
            'ui-dropdown-items__item--destructive': child.destructive,
            'ui-dropdown-items__item--active': isActive(child.key),
            [`ui-dropdown-items__item--${size}`]: size
          }"
          :title="child.title || undefined"
          @click="onItemClick(child)"
        >
          <span class="ui-dropdown-items__icon">
            <component
              :is="child.icon"
              v-if="child.icon && isComponent(child.icon)"
              :size="['sm', 'md'].includes(size) ? 16 : 20"
              :color="item.colorIcon"
            />
          </span>
          <span class="ui-dropdown-items__label" :style="child.color ? { color: child.color } : undefined">{{
            child.label
          }}</span>
          <span v-if="child.extra" class="ui-dropdown-items__extra">{{ child.extra }}</span>
          <WkiCheck v-if="isActive(child.key)" :size="16" color="var(--muted-fg)" />
        </div>
      </div>

      <!-- Submenu: non-clickable label + indented flat children -->
      <div v-else-if="item._type === 'submenu'" class="ui-dropdown-items__submenu">
        <div
          class="ui-dropdown-items__submenu-label"
          :class="{
            'ui-dropdown-items__item--disabled': item.disabled,
            'ui-dropdown-items__item--destructive': item.destructive,
            [`ui-dropdown-items__item--${size}`]: size
          }"
          :title="item.title || undefined"
        >
          <span class="ui-dropdown-items__icon">
            <component
              :is="item.icon"
              v-if="item.icon && isComponent(item.icon)"
              :size="['sm', 'md'].includes(size) ? 16 : 20"
              :color="item.colorIcon"
            />
          </span>
          <span class="ui-dropdown-items__label" :style="item.color ? { color: item.color } : undefined">{{
            item.label
          }}</span>
        </div>
        <div
          v-for="child in item.children || []"
          :key="child.key"
          class="ui-dropdown-items__item ui-dropdown-items__item--sub"
          :class="{
            'ui-dropdown-items__item--disabled': child.disabled || item.disabled,
            'ui-dropdown-items__item--destructive': child.destructive,
            'ui-dropdown-items__item--active': isActive(child.key),
            [`ui-dropdown-items__item--${size}`]: size
          }"
          :title="child.title || undefined"
          @click="onItemClick(child, item)"
        >
          <span class="ui-dropdown-items__icon">
            <component
              :is="child.icon"
              v-if="child.icon && isComponent(child.icon)"
              :size="['sm', 'md'].includes(size) ? 16 : 20"
              :color="item.colorIcon"
            />
          </span>
          <span class="ui-dropdown-items__label" :style="child.color ? { color: child.color } : undefined">{{
            child.label
          }}</span>
          <span v-if="child.extra" class="ui-dropdown-items__extra">{{ child.extra }}</span>
          <WkiCheck v-if="isActive(child.key)" :size="16" color="var(--muted-fg)" />
        </div>
      </div>

      <!-- Regular item -->
      <div
        v-else
        class="ui-dropdown-items__item"
        :class="{
          'ui-dropdown-items__item--disabled': item.disabled,
          'ui-dropdown-items__item--destructive': item.destructive,
          'ui-dropdown-items__item--active': isActive(item.key),
          [`ui-dropdown-items__item--${size}`]: size
        }"
        :title="item.title || undefined"
        @click="onItemClick(item)"
      >
        <span class="ui-dropdown-items__icon">
          <component
            :is="item.icon"
            v-if="item.icon && isComponent(item.icon)"
            :size="['sm', 'md'].includes(size) ? 16 : 20"
            :color="item.colorIcon"
          />
        </span>
        <span class="ui-dropdown-items__label" :style="item.color ? { color: item.color } : undefined">{{
          item.label
        }}</span>
        <span v-if="item.extra" class="ui-dropdown-items__extra">{{ item.extra }}</span>
        <WkiCheck v-if="isActive(item.key)" :size="16" color="var(--muted-fg)" />
      </div>
    </div>
  </div>
</template>

<script>
import WkiCheck from '../../icons/Check.vue'

function skipReactive(val) {
  if (val && typeof val === 'object' && !val.__v_skip) {
    val.__v_skip = true
  }
}

export default {
  name: 'DropdownMenuItems',

  components: { WkiCheck },

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
    }
  },

  emits: ['select'],

  computed: {
    normalizedItems() {
      return (this.items || []).map(function (item, i) {
        var type
        if (item.type === 'divider') {
          type = 'divider'
        } else if (item.type === 'group') {
          type = 'group'
        } else if (item.children && item.children.length) {
          type = 'submenu'
        } else {
          type = 'item'
        }
        // Prevent Vue 3 from making component objects reactive (same as markRaw
        // but without importing from 'vue', keeps dual-compat clean).
        skipReactive(item.icon)
        if (item.children)
          item.children.forEach(function (c) {
            skipReactive(c.icon)
          })
        return Object.assign({}, item, {
          _type: type,
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
