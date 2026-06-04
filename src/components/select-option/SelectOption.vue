<template>
  <div
    class="ui-select-option"
    :class="[
      size === 'large' ? 'ui-select-option--large' : null,
      variant === 'destructive' ? 'ui-select-option--destructive' : null,
      isDisabled ? 'ui-select-option--disabled' : null,
      isSelected ? 'ui-select-option--selected' : null
    ]"
    role="option"
    :aria-selected="isSelected ? 'true' : 'false'"
    :aria-disabled="isDisabled ? 'true' : null"
    @click="handleClick"
  >
    <slot>{{ label || value }}</slot>
  </div>
</template>

<script>
export default {
  name: 'SelectOption',

  inject: {
    select: { default: null }
  },

  props: {
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
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
    variant: {
      type: String,
      default: 'default',
      validator: function (v) {
        return ['default', 'destructive'].indexOf(v) !== -1
      }
    }
  },

  emits: [],

  computed: {
    isSelected() {
      return !!(this.select && this.select.effectiveValue !== undefined && this.select.effectiveValue === this.value)
    },
    isDisabled() {
      return this.disabled || !!(this.select && this.select.disabled)
    }
  },

  methods: {
    handleClick() {
      if (this.isDisabled) return
      if (this.select && typeof this.select.select === 'function') {
        this.select.select(this.value)
      }
    }
  }
}
</script>

<style src="./select_option.css" scoped></style>
