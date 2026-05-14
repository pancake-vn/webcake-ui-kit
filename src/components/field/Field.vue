<template>
  <div
    :class="[
      'ui-field',
      `ui-field--${layout}`,
      layout === 'horizontal' && `ui-field--align-${align}`,
      required && 'ui-field--required',
      isError && 'ui-field--error'
    ]"
  >
    <div
      v-if="hasLabel"
      class="ui-field__label"
      :style="layout === 'horizontal' ? { flexBasis: normalizedLabelWidth, width: normalizedLabelWidth } : null"
    >
      <slot name="label">{{ label }}</slot>
    </div>
    <div class="ui-field__body">
      <div class="ui-field__control">
        <slot></slot>
      </div>
      <div v-if="hasMessage" class="ui-field__message">
        <span class="ui-field__message-icon" aria-hidden="true">
          <slot name="message-icon">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="6.25" stroke="currentColor" stroke-width="1.3" />
              <path d="M8 7.25v3.75" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
              <circle cx="8" cy="5.25" r="0.75" fill="currentColor" />
            </svg>
          </slot>
        </span>
        <span class="ui-field__message-text">
          <slot name="message">{{ isError ? errorText : helpText }}</slot>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Field',
  props: {
    layout: {
      type: String,
      default: 'vertical',
      validator: v => ['vertical', 'horizontal'].includes(v)
    },
    label: { type: String, default: '' },
    required: { type: Boolean, default: false },
    helpText: { type: String, default: '' },
    errorText: { type: String, default: '' },
    labelWidth: { type: [String, Number], default: '120px' },
    align: {
      type: String,
      default: 'center',
      validator: v => ['start', 'center'].includes(v)
    }
  },
  emits: [],
  computed: {
    hasLabel() {
      return !!this.label || !!((this.$scopedSlots && this.$scopedSlots.label) || this.$slots.label)
    },
    isError() {
      return !!this.errorText
    },
    hasMessage() {
      return (
        !!this.errorText ||
        !!this.helpText ||
        !!((this.$scopedSlots && this.$scopedSlots.message) || this.$slots.message)
      )
    },
    normalizedLabelWidth() {
      return typeof this.labelWidth === 'number' ? `${this.labelWidth}px` : this.labelWidth
    }
  }
}
</script>

<style src="./field.css" scoped></style>
