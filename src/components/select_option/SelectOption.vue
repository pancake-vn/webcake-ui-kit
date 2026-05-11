<template>
  <div
    class="ui-select-option"
    :class="{
      'ui-select-option--selected': isSelected,
      'ui-select-option--disabled': isDisabled,
      'ui-select-option--large': size === 'large',
      'ui-select-option--destructive': variant === 'destructive'
    }"
    tabindex="0"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
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

  mounted() {
    if (this.select && this.select.registerOption) {
      this.select.registerOption(this.value, this.label || this.value)
    }
  },

  computed: {
    isSelected() {
      return this.select ? this.select.value === this.value : false
    },
    isDisabled() {
      return this.disabled || (this.select ? this.select.disabled : false)
    }
  },

  methods: {
    handleClick() {
      if (this.isDisabled || !this.select) return
      this.select.select(this.value)
    }
  }
}
</script>

<style src="./select_option.css" scoped></style>
