<template>
  <span
    :class="[
      'ui-textarea',
      `ui-textarea--size-${size}`,
      `ui-textarea--round-${roundness}`,
      error && 'ui-textarea--error',
      disabled && 'ui-textarea--disabled',
      $attrs.class
    ]"
  >
    <textarea
      ref="textarea"
      class="ui-textarea__field"
      :class="{ 'ui-textarea__field--no-resize': !resizable || autosize }"
      :value="currentValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :name="name"
      :rows="rows"
      :maxlength="maxLength"
      v-bind="{ ...$attrs, class: undefined }"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    ></textarea>
    <span v-if="showCounter" class="ui-textarea__counter"
      >{{ charCount }}<template v-if="maxLength !== undefined"> / {{ maxLength }}</template></span
    >
  </span>
</template>

<script>
export default {
  name: 'Textarea',
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: 'default',
      validator: v => ['default', 'mini'].includes(v)
    },
    roundness: {
      type: String,
      default: 'default',
      validator: v => ['default', 'round'].includes(v)
    },
    value: { type: [String, Number], default: '' },
    modelValue: { type: [String, Number], default: undefined },
    placeholder: { type: String, default: '' },
    name: { type: String, default: '' },
    rows: { type: [String, Number], default: 3 },
    error: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    resizable: { type: Boolean, default: true },
    autosize: { type: Boolean, default: false },
    showCount: { type: Boolean, default: false },
    maxLength: { type: Number, default: undefined }
  },
  emits: ['input', 'change', 'update:modelValue', 'focus', 'blur'],
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value
    },
    charCount() {
      return String(this.currentValue).length
    },
    showCounter() {
      return this.showCount || this.maxLength !== undefined
    }
  },
  watch: {
    currentValue() {
      this.$nextTick(this.resize)
    }
  },
  mounted() {
    this.$nextTick(this.resize)
  },
  methods: {
    focus() {
      if (this.$refs.textarea) this.$refs.textarea.focus()
    },
    blur() {
      if (this.$refs.textarea) this.$refs.textarea.blur()
    },
    resize() {
      if (!this.autosize || !this.$refs.textarea) return
      const el = this.$refs.textarea
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
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
    }
  }
}
</script>

<style src="./textarea.css" scoped></style>
