<template>
  <span
    :class="[
      'ui-badge',
      `ui-badge--${variant}`,
      `ui-badge--round-${roundness}`
    ]"
  >
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
      return !!((this.$scopedSlots && this.$scopedSlots['icon-left']) || this.$slots['icon-left'])
    },
    hasIconRight() {
      return !!((this.$scopedSlots && this.$scopedSlots['icon-right']) || this.$slots['icon-right'])
    }
  }
}
</script>

<style scoped>
.ui-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2xs);
  padding: var(--spacing-3xs) var(--spacing-xs);
  font-family: var(--font-family-body);
  font-size: var(--paragraph-mini-font-size);
  line-height: var(--paragraph-mini-line-height);
  letter-spacing: var(--paragraph-mini-letter-spacing);
  font-weight: var(--paragraph-bold-font-weight);
  white-space: nowrap;
  transition: box-shadow 0.15s ease;
}

.ui-badge--round-default { border-radius: var(--rounded-lg); }
.ui-badge--round-round { border-radius: var(--rounded-full); }

.ui-badge--primary {
  background: var(--primary-brand-bg);
  color: var(--inverse-fg);
}
.ui-badge--secondary {
  background: var(--secondary-bg);
  color: var(--secondary-fg);
}
.ui-badge--outline {
  background: var(--outline);
  color: var(--primary-fg);
  border-width: 1px;
  border-style: solid;
  border-color: var(--border-primary);
}
.ui-badge--ghost {
  background: var(--ghost);
  color: var(--primary-fg);
}
.ui-badge--destructive {
  background: var(--destructive);
  color: var(--destructive-inverse-fg);
}
.ui-badge--info {
  background: var(--info-500);
  color: var(--inverse-fg);
}
.ui-badge--warning {
  background: var(--warning-500);
  color: var(--inverse-fg);
}

.ui-badge:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus-ring);
}
.ui-badge--destructive:focus-visible {
  box-shadow: var(--shadow-focus-ring-error);
}

.ui-badge__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 12px;
  height: 12px;
}

.ui-badge__label {
  display: inline-flex;
}
</style>
