<template>
  <Menu
    :open="isOpen"
    :placement="placement"
    :offset="4"
    :close-on-esc="closeOnEsc"
    :disabled="disabled"
    @change="onMenuChange"
    @open="$emit('open')"
    @close="$emit('close')"
    :width="width"
  >
    <template #trigger="{ triggerRef }">
      <span
        :ref="triggerRef"
        class="ui-dropdown__anchor"
        @click="triggerHasClick && handleClick()"
        @mouseenter="triggerHasHover && handleMouseEnter()"
        @mouseleave="triggerHasHover && handleMouseLeave()"
      >
        <slot></slot>
      </span>
    </template>
    <DropdownMenuItems v-if="hasItems" :items="items" @select="onItemSelect" />
    <slot v-else name="overlay"></slot>
  </Menu>
</template>

<script>
import Menu from '../menu/Menu.vue'
import DropdownMenuItems from './DropdownMenuItems.vue'

const PLACEMENTS = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end'
]

export default {
  name: 'Dropdown',
  components: { Menu, DropdownMenuItems },
  model: { prop: 'open', event: 'change' },
  props: {
    open: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    placement: {
      type: String,
      default: 'bottom-start',
      validator: v => PLACEMENTS.indexOf(v) !== -1
    },
    closeOnEsc: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    width: { type: [String, Number], default: null },
    trigger: {
      type: Array,
      default: function () {
        return ['click']
      }
    },
    items: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  emits: ['change', 'update:modelValue', 'open', 'close', 'select'],
  data() {
    return {
      isOpen: this.modelValue !== undefined ? this.modelValue : this.open
    }
  },
  computed: {
    triggerHasClick() {
      return this.trigger.indexOf('click') !== -1
    },
    triggerHasHover() {
      return this.trigger.indexOf('hover') !== -1
    },
    hasItems() {
      return Array.isArray(this.items) && this.items.length > 0
    }
  },
  watch: {
    open(v) {
      if (this.modelValue === undefined) this.isOpen = v
    },
    modelValue(v) {
      if (v !== undefined) this.isOpen = v
    }
  },
  methods: {
    onMenuChange(v) {
      this.isOpen = v
      this.$emit('change', v)
      this.$emit('update:modelValue', v)
    },
    handleClick() {
      if (this.disabled) return
      this.onMenuChange(!this.isOpen)
    },
    handleMouseEnter() {
      if (this.disabled) return
      if (this._hoverTimer) {
        clearTimeout(this._hoverTimer)
        this._hoverTimer = null
      }
      this.onMenuChange(true)
    },
    handleMouseLeave() {
      this._hoverTimer = setTimeout(() => {
        this.onMenuChange(false)
      }, 80)
    },
    onItemSelect(key) {
      this.$emit('select', key)
      this.onMenuChange(false)
    }
  },
  beforeUnmount() {
    if (this._hoverTimer) clearTimeout(this._hoverTimer)
  }
}
</script>

<style src="./dropdown.css" scoped></style>
