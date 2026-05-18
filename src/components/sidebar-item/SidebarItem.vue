<template>
  <button
    class="ui-sidebar-item"
    :class="{
      'ui-sidebar-item--active': active,
      'ui-sidebar-item--disabled': disabled,
      'ui-sidebar-item--large': size === 'large',
      'ui-sidebar-item--level-2': level === 2,
      'ui-sidebar-item--has-children': hasChildren,
      'ui-sidebar-item--expanded': hasChildren && expanded,
      'ui-sidebar-item--collapsed': collapsed
    }"
    :tabindex="disabled ? -1 : 0"
    :aria-current="active ? 'page' : undefined"
    :aria-disabled="disabled ? true : undefined"
    :aria-expanded="hasChildren ? String(expanded) : undefined"
    @click="handleClick"
  >
    <span v-if="hasIconSlot" class="ui-sidebar-item__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="ui-sidebar-item__label">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="badge" class="ui-sidebar-item__badge">{{ badge }}</span>
    <span v-if="hasChildren" class="ui-sidebar-item__chevron" aria-hidden="true">
      <slot name="icon-right">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'SidebarItem',

  props: {
    label: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'regular',
      validator: function (v) {
        return ['regular', 'large'].indexOf(v) !== -1
      }
    },
    level: {
      type: Number,
      default: 1,
      validator: function (v) {
        return [1, 2].indexOf(v) !== -1
      }
    },
    badge: {
      type: String,
      default: ''
    },
    hasChildren: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean,
      default: false
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },

  emits: ['click', 'toggle'],

  computed: {
    hasIconSlot() {
      return !!((this.$scopedSlots && this.$scopedSlots['icon']) || this.$slots['icon'])
    },
    hasIconRightSlot() {
      return !!((this.$scopedSlots && this.$scopedSlots['icon-right']) || this.$slots['icon-right'])
    }
  },

  methods: {
    handleClick() {
      if (this.disabled) return
      if (this.hasChildren) {
        this.$emit('toggle')
      } else {
        this.$emit('click')
      }
    }
  }
}
</script>

<style src="./sidebar_item.css" scoped></style>
