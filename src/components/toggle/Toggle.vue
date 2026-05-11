<template>
  <button
    type="button"
    :class="[
      'ui-toggle',
      'ui-toggle--variant-' + variant,
      'ui-toggle--' + computedSize,
      'ui-toggle--round-' + roundness,
      isActive && 'ui-toggle--active',
      isIconOnly && 'ui-toggle--icon-only',
      isInGroup && 'ui-toggle--in-group'
    ]"
    :disabled="disabled"
    :aria-pressed="isActive ? 'true' : 'false'"
    @click="handleClick"
  >
    <span v-if="hasIconLeft" class="ui-toggle__icon">
      <slot name="icon-left" />
    </span>
    <span v-if="hasIcon" class="ui-toggle__icon">
      <slot name="icon" />
    </span>
    <span v-if="!isIconOnly && (hasDefaultSlot || label)" class="ui-toggle__label">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="hasIconRight" class="ui-toggle__icon">
      <slot name="icon-right" />
    </span>
  </button>
</template>

<script>
export default {
  name: 'Toggle',
  inject: {
    toggleGroupCtx: { default: null },
    groupSize: { default: 'md' }
  },
  model: { prop: 'active', event: 'change' },
  props: {
    variant: {
      type: String,
      default: 'outlined',
      validator: v => ['outlined', 'ghost'].includes(v)
    },
    size: {
      type: String,
      default: 'md',
      validator: v => ['xs', 'sm', 'md', 'lg'].includes(v)
    },
    roundness: {
      type: String,
      default: 'default',
      validator: v => ['default', 'round'].includes(v)
    },
    active: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    value: { type: [String, Number], default: null },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  emits: ['change', 'update:modelValue'],
  computed: {
    computedSize() {
      return this.toggleGroupCtx ? this.groupSize : this.size
    },
    isInGroup() {
      return !!this.toggleGroupCtx
    },
    standaloneActive() {
      return this.modelValue !== undefined ? this.modelValue : this.active
    },
    isActive() {
      if (this.isInGroup) {
        return this.toggleGroupCtx.isSelected(this.value)
      }
      return this.standaloneActive
    },
    hasIconLeft() {
      return !!this.$slots['icon-left']
    },
    hasIconRight() {
      return !!this.$slots['icon-right']
    },
    hasIcon() {
      return !!this.$slots['icon']
    },
    hasDefaultSlot() {
      return !!this.$slots['default']
    },
    isIconOnly() {
      return !this.label && !this.hasDefaultSlot && this.hasIcon && !this.hasIconLeft && !this.hasIconRight
    }
  },
  methods: {
    handleClick() {
      if (this.disabled) return
      if (this.isInGroup) {
        if (this.value !== null) {
          this.toggleGroupCtx.select(this.value)
        }
        return
      }
      const next = !this.standaloneActive
      this.$emit('change', next)
      this.$emit('update:modelValue', next)
    }
  }
}
</script>

<style src="./toggle.css" scoped></style>
