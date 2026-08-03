<template>
  <span
    :class="[
      'ui-input-counter',
      `ui-input-counter--size-${size}`,
      `ui-input-counter--round-${roundness}`,
      error && 'ui-input-counter--error',
      disabled && 'ui-input-counter--disabled',
      $attrs.class
    ]"
  >
    <span class="ui-input-counter__main">
      <span v-if="hasPrefix" class="ui-input-counter__decoration ui-input-counter__prefix" aria-hidden="true">
        <slot name="prefix"></slot>
      </span>
      <input
        ref="input"
        class="ui-input-counter__field"
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
      <span v-if="hasSuffix" class="ui-input-counter__decoration ui-input-counter__suffix" aria-hidden="true">
        <slot name="suffix"></slot>
      </span>
    </span>
    <span class="ui-input-counter__controls">
      <button
        type="button"
        class="ui-input-counter__btn ui-input-counter__btn--minus"
        aria-label="Decrease"
        tabindex="-1"
        :disabled="!canDecrement"
        @mousedown.prevent
        @click="decrement"
      >
        <WkiMinus :size="12" />
      </button>
      <button
        type="button"
        class="ui-input-counter__btn ui-input-counter__btn--add"
        aria-label="Increase"
        tabindex="-1"
        :disabled="!canIncrement"
        @mousedown.prevent
        @click="increment"
      >
        <WkiPlus :size="12" />
      </button>
    </span>
  </span>
</template>

<script>
import { WkiMinus, WkiPlus } from '../../icons'

export default {
  name: 'InputCounter',
  inheritAttrs: false,
  components: {
    WkiMinus,
    WkiPlus
  },
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
    error: { type: Boolean, default: false },
    centered: { type: Boolean, default: false },
    size: {
      type: String,
      default: 'md',
      validator: v => ['xs', 'sm', 'md', 'lg'].includes(v)
    },
    roundness: {
      type: String,
      default: 'default',
      validator: v => ['default', 'round'].includes(v)
    }
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
    numericValue() {
      const v = this.currentValue
      if (v === null || v === undefined || v === '') return null
      const n = Number(v)
      return isNaN(n) ? null : n
    },
    canDecrement() {
      if (this.disabled || this.readonly) return false
      if (this.min === null) return true
      return (this.numericValue === null ? 0 : this.numericValue) > this.min
    },
    canIncrement() {
      if (this.disabled || this.readonly) return false
      if (this.max === null) return true
      return (this.numericValue === null ? 0 : this.numericValue) < this.max
    },
    displayValue() {
      if (this.focused) return this.inputText
      if (this.numericValue === null) return ''
      return this.numericValue.toFixed(this.effectivePrecision)
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
    emitValue(v) {
      this.$emit('input', v)
      this.$emit('update:modelValue', v)
      this.$emit('change', v)
    },
    stepBy(direction) {
      if (this.disabled || this.readonly) return
      const base = this.numericValue === null ? 0 : this.numericValue
      const next = this.clamp(this.toPrecision(base + direction * this.step))
      this.emitValue(next)
      if (this.focused) this.inputText = String(next)
    },
    increment() {
      this.stepBy(1)
    },
    decrement() {
      this.stepBy(-1)
    },
    commitInput() {
      const raw = this.inputText
      if (raw === '' || raw === '-') {
        this.emitValue(null)
        return
      }
      const num = parseFloat(raw)
      if (!isNaN(num)) {
        const committed = this.clamp(this.toPrecision(num))
        this.emitValue(committed)
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
      this.inputText = this.numericValue === null ? '' : String(this.numericValue)
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
        this.increment()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        this.decrement()
      } else if (e.key === 'Enter') {
        this.commitInput()
        this.$emit('pressEnter', this.currentValue, e)
      }
    }
  }
}
</script>

<style src="./input-counter.css" scoped></style>
