<template>
  <span
    :class="[
      'ui-input',
      `ui-input--size-${size}`,
      `ui-input--round-${roundness}`,
      error && 'ui-input--error',
      disabled && 'ui-input--disabled',
      $attrs.class
    ]"
  >
    <span v-if="hasPrefix" class="ui-input__decoration ui-input__prefix" aria-hidden="true">
      <slot name="prefix"></slot>
    </span>
    <input
      ref="input"
      class="ui-input__field"
      :type="type"
      :value="currentValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :name="name"
      v-bind="{ ...$attrs, class: undefined }"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
    />
    <span v-if="hasSuffix" class="ui-input__decoration ui-input__suffix" aria-hidden="true">
      <slot name="suffix"></slot>
    </span>
  </span>
</template>

<script>
export default {
  name: 'Input',
  inheritAttrs: false,
  props: {
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
    value: { type: [String, Number], default: '' },
    modelValue: { type: [String, Number], default: undefined },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    name: { type: String, default: '' },
    error: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false }
  },
  emits: ['input', 'change', 'update:modelValue', 'focus', 'blur', 'pressEnter'],
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value
    },
    hasPrefix() {
      return !!this.$slots['prefix']
    },
    hasSuffix() {
      return !!this.$slots['suffix']
    }
  },
  methods: {
    focus() {
      if (this.$refs.input) this.$refs.input.focus()
    },
    blur() {
      if (this.$refs.input) this.$refs.input.blur()
    },
    onInput(e) {
      const next = e.target.value
      this.$emit('input', next)
      this.$emit('update:modelValue', next)
      this.$emit('change', next, e)
    },
    onFocus(e) {
      this.$emit('focus', e.target.value, e)
    },
    onBlur(e) {
      this.$emit('blur', e.target.value, e)
    },
    onKeydown(e) {
      if (e.key === 'Enter') {
        this.$emit('pressEnter', e.target.value, e)
      }
    }
  }
}
</script>

<style src="./input.css" scoped></style>
