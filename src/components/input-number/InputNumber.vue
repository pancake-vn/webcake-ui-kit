<template>
  <span
    :class="[
      'ui-input-number',
      `ui-input-number--size-${size}`,
      `ui-input-number--round-${roundness}`,
      error && 'ui-input-number--error',
      disabled && 'ui-input-number--disabled',
      $attrs.class
    ]"
  >
    <span v-if="hasPrefix" class="ui-input-number__decoration ui-input-number__prefix" aria-hidden="true">
      <slot name="prefix"></slot>
    </span>
    <input
      ref="input"
      class="ui-input-number__field"
      type="text"
      inputmode="decimal"
      :style="centered ? { textAlign: 'center' } : {}"
      :value="displayValue"
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
    <span v-if="hasSuffix" class="ui-input-number__decoration ui-input-number__suffix" aria-hidden="true">
      <slot name="suffix"></slot>
    </span>
  </span>
</template>

<script>
export default {
  name: 'InputNumber',
  inheritAttrs: false,
  props: {
    value: { default: null },
    modelValue: { default: undefined },
    min: { type: Number, default: null },
    max: { type: Number, default: null },
    step: { type: Number, default: 1 },
    precision: { type: Number, default: null },
    placeholder: { type: String, default: '' },
    name: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    size: {
      type: String,
      default: 'md',
      validator: v => ['tiny', 'xs', 'sm', 'md', 'lg'].includes(v)
    },
    roundness: {
      type: String,
      default: 'default',
      validator: v => ['default', 'round'].includes(v)
    },
    error: { type: Boolean, default: false },
    centered: { type: Boolean, default: false }
  },
  emits: ['input', 'update:modelValue', 'change', 'focus', 'blur', 'pressEnter'],
  data() {
    return {
      focused: false,
      inputText: ''
    }
  },
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value
    },
    hasPrefix() {
      return !!((this.$scopedSlots && this.$scopedSlots['prefix']) || this.$slots['prefix'])
    },
    hasSuffix() {
      return !!((this.$scopedSlots && this.$scopedSlots['suffix']) || this.$slots['suffix'])
    },
    effectivePrecision() {
      if (this.precision !== null) return this.precision
      const s = String(this.step)
      const dot = s.indexOf('.')
      return dot >= 0 ? s.length - dot - 1 : 0
    },
    displayValue() {
      if (this.focused) return this.inputText
      const v = this.currentValue
      if (v === null || v === undefined) return ''
      const n = Number(v)
      if (isNaN(n)) return ''
      return n.toFixed(this.effectivePrecision)
    }
  },
  methods: {
    focus() {
      if (this.$refs.input) this.$refs.input.focus()
    },
    blur() {
      if (this.$refs.input) this.$refs.input.blur()
    },
    toPrecision(num) {
      return parseFloat(num.toFixed(this.effectivePrecision))
    },
    clamp(num) {
      let v = num
      if (this.max !== null && v > this.max) v = this.max
      if (this.min !== null && v < this.min) v = this.min
      return v
    },
    sanitize(raw) {
      let s = raw.replace(/[^\d.-]/g, '')
      const hasMinus = s.charAt(0) === '-'
      s = s.replace(/-/g, '')
      if (hasMinus) s = '-' + s
      if (this.effectivePrecision === 0) {
        s = s.replace(/\./g, '')
      } else {
        const firstDot = s.indexOf('.')
        if (firstDot >= 0) {
          s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, '')
        }
      }
      return s
    },
    commitInput() {
      const raw = this.inputText
      if (raw === '' || raw === '-') {
        this.$emit('input', null)
        this.$emit('update:modelValue', null)
        this.$emit('change', null)
        return
      }
      const num = parseFloat(raw)
      if (!isNaN(num)) {
        const committed = this.clamp(this.toPrecision(num))
        this.$emit('input', committed)
        this.$emit('update:modelValue', committed)
        this.$emit('change', committed)
        this.inputText = committed.toFixed(this.effectivePrecision)
      }
    },
    onInput(e) {
      const sanitized = this.sanitize(e.target.value)
      if (sanitized !== e.target.value) {
        const pos = Math.max(0, e.target.selectionStart - (e.target.value.length - sanitized.length))
        e.target.value = sanitized
        try {
          e.target.setSelectionRange(pos, pos)
        } catch (err) {
          console.error(err)
        }
      }
      this.inputText = sanitized
      if (sanitized === '' || sanitized === '-') return
      const num = parseFloat(sanitized)
      if (!isNaN(num)) {
        this.$emit('input', this.toPrecision(num))
        this.$emit('update:modelValue', this.toPrecision(num))
      }
    },
    onFocus(e) {
      this.focused = true
      const v = this.currentValue
      this.inputText =
        v !== null && v !== undefined ? parseFloat(Number(v).toFixed(this.effectivePrecision)).toString() : ''
      this.$emit('focus', this.currentValue, e)
    },
    onBlur(e) {
      this.focused = false
      this.commitInput()
      this.$emit('blur', this.currentValue, e)
    },
    onKeydown(e) {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const base = this.currentValue !== null && this.currentValue !== undefined ? Number(this.currentValue) : 0
        const next = this.clamp(this.toPrecision(base + this.step))
        this.$emit('input', next)
        this.$emit('update:modelValue', next)
        this.$emit('change', next)
        this.inputText = String(next)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const base = this.currentValue !== null && this.currentValue !== undefined ? Number(this.currentValue) : 0
        const next = this.clamp(this.toPrecision(base - this.step))
        this.$emit('input', next)
        this.$emit('update:modelValue', next)
        this.$emit('change', next)
        this.inputText = String(next)
      } else if (e.key === 'Enter') {
        this.commitInput()
        this.$emit('pressEnter', this.currentValue, e)
      }
    }
  }
}
</script>

<style src="./input-number.css" scoped></style>
