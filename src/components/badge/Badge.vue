<template>
  <span :class="['ui-badge', `ui-badge--${variant}`, `ui-badge--round-${roundness}`]">
    <span v-if="hasIconLeft" class="ui-badge__icon">
      <slot name="icon-left"></slot>
    </span>
    <span class="ui-badge__label">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="hasIconRight" class="ui-badge__icon">
      <slot name="icon-right"></slot>
    </span>
  </span>
</template>

<script>
export default {
  name: 'Badge',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: v => ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'info', 'warning'].includes(v)
    },
    roundness: {
      type: String,
      default: 'default',
      validator: v => ['default', 'round'].includes(v)
    },
    label: {
      type: String,
      default: ''
    }
  },
  emits: [],
  computed: {
    hasIconLeft() {
      return !!this.$slots['icon-left']
    },
    hasIconRight() {
      return !!this.$slots['icon-right']
    }
  }
}
</script>

<style src="./badge.css" scoped></style>
