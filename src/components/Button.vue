<template>
  <button
    :class="['ui-btn', `ui-btn--${type}`, `ui-btn--${size}`]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    type: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'danger', 'success'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  methods: {
    handleClick(e) {
      if (!this.disabled) {
        this.$emit('click', e)
      }
    }
  }
}
</script>

<style scoped>
.ui-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.ui-btn--primary { background: #3b82f6; color: white; }
.ui-btn--secondary { background: #6b7280; color: white; }
.ui-btn--danger { background: #ef4444; color: white; }
.ui-btn--success { background: #10b981; color: white; }

.ui-btn--small { padding: 6px 12px; font-size: 14px; }
.ui-btn--medium { padding: 8px 16px; font-size: 16px; }
.ui-btn--large { padding: 12px 20px; font-size: 18px; }

.ui-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>