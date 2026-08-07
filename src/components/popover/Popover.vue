<template>
  <Menu
    :open="isOpen"
    :placement="placement"
    :offset="offset"
    :close-on-esc="closeOnEsc"
    :close-on-tab="false"
    :disabled="disabled"
    :persistent="persistent"
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
        class="ui-popover__anchor"
        @click="triggerHasClick && toggle()"
        @mouseenter="triggerHasHover && handleMouseEnter()"
        @mouseleave="triggerHasHover && handleMouseLeave()"
      >
        <slot name="trigger" :is-open="isOpen"></slot>
      </span>
    </template>
    <div
      style="display: contents"
      @mouseenter="triggerHasHover && handleMouseEnter()"
      @mouseleave="triggerHasHover && handleMouseLeave()"
    >
      <slot :close="close" :is-open="isOpen"></slot>
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
  name: 'Popover',
  components: { Menu },
  model: { prop: 'open', event: 'change' },
  props: {
    open: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    placement: {
      type: String,
      default: 'bottom-start',
      validator: v => PLACEMENTS.indexOf(v) !== -1
    },
    offset: { type: Number, default: 4 },
    // 'click', 'hover', or both
    trigger: {
      type: Array,
      default: function () {
        return ['click']
      }
    },
    closeOnEsc: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    persistent: { type: Boolean, default: false },
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
    toggle() {
      if (this.disabled) return
      this.onOpenChange(!this.isOpen)
    },
    close() {
      this.onOpenChange(false)
    },
    handleMouseEnter() {
      if (this.disabled) return
      if (this._hoverTimer) {
        clearTimeout(this._hoverTimer)
        this._hoverTimer = null
      }
      this.onOpenChange(true)
    },
    handleMouseLeave() {
      this._hoverTimer = setTimeout(() => {
        this.onOpenChange(false)
      }, 80)
    }
  },
  beforeUnmount() {
    if (this._hoverTimer) clearTimeout(this._hoverTimer)
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle, vue/no-dupe-keys
  beforeDestroy() {
    if (this._hoverTimer) clearTimeout(this._hoverTimer)
  }
}
</script>

<style src="./popover.css" scoped></style>
