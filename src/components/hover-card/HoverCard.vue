<template>
  <Menu
    :open="isOpen"
    :placement="placement"
    :offset="offset"
    :auto-focus="false"
    :persistent="!triggerHasClick"
    :close-on-esc="closeOnEsc"
    :disabled="disabled"
    :anchor-width="anchorWidth"
    :width="width"
    :overlay-class-name="overlayClassName"
    :overlay-style="overlayStyle"
    @change="onOpenChange"
    @open="$emit('open')"
    @close="$emit('close')"
  >
    <template #trigger="{ triggerRef }">
      <span
        :ref="triggerRef"
        class="ui-hover-card__anchor"
        @click="triggerHasClick && toggleClick()"
        @mouseenter="triggerHasHover && onOpenIntent()"
        @mouseleave="triggerHasHover && onCloseIntent()"
        @focusin="onOpenIntent()"
        @focusout="onCloseIntent()"
      >
        <slot name="trigger"></slot>
      </span>
    </template>
    <div
      class="ui-hover-card__panel"
      @mouseenter="triggerHasHover && onOpenIntent()"
      @mouseleave="triggerHasHover && onCloseIntent()"
    >
      <slot></slot>
    </div>
  </Menu>
</template>

<script>
import Menu from '../menu/Menu.vue'

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
  name: 'HoverCard',
  components: { Menu },
  model: { prop: 'open', event: 'change' },
  props: {
    open: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    placement: {
      type: String,
      default: 'bottom',
      validator: v => PLACEMENTS.indexOf(v) !== -1
    },
    offset: { type: Number, default: 8 },
    // 'hover', 'click', or both
    trigger: {
      type: Array,
      default: function () {
        return ['hover']
      }
    },
    openDelay: { type: Number, default: 200 },
    closeDelay: { type: Number, default: 150 },
    closeOnEsc: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    anchorWidth: { type: Boolean, default: false },
    width: { type: [String, Number], default: null },
    overlayClassName: { type: [String, Array, Object], default: null },
    overlayStyle: { type: [Object, Array], default: null }
  },
  emits: ['change', 'update:modelValue', 'open', 'close'],
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
    onOpenChange(v) {
      this.isOpen = v
      this.$emit('change', v)
      this.$emit('update:modelValue', v)
    },
    _clearTimers() {
      if (this._openTimer) {
        clearTimeout(this._openTimer)
        this._openTimer = null
      }
      if (this._closeTimer) {
        clearTimeout(this._closeTimer)
        this._closeTimer = null
      }
    },
    toggleClick() {
      if (this.disabled) return
      this._clearTimers()
      this.onOpenChange(!this.isOpen)
    },
    onOpenIntent() {
      if (this.disabled) return
      this._clearTimers()
      if (this.isOpen) return
      this._openTimer = setTimeout(() => {
        this._openTimer = null
        this.onOpenChange(true)
      }, this.openDelay)
    },
    onCloseIntent() {
      this._clearTimers()
      if (!this.isOpen) return
      this._closeTimer = setTimeout(() => {
        this._closeTimer = null
        this.onOpenChange(false)
      }, this.closeDelay)
    }
  },
  beforeUnmount() {
    this._clearTimers()
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle, vue/no-dupe-keys
  beforeDestroy() {
    this._clearTimers()
  }
}
</script>

<style src="./hover-card.css" scoped></style>
