<template>
  <span class="ui-spinner" :class="[`ui-spinner--${size}`, `ui-spinner--${type}`]" role="status" :aria-label="label">
    <svg class="ui-spinner__svg" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <circle class="ui-spinner__track" cx="6.5" cy="6.5" r="5" stroke-width="1.5" />
      <circle
        class="ui-spinner__arc"
        cx="6.5"
        cy="6.5"
        r="5"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-dasharray="23.56 7.85"
      />
    </svg>
  </span>
</template>

<script>
export default {
  name: 'Spinner',
  props: {
    size: {
      type: String,
      default: 'sm',
      validator: function (v) {
        return ['sm', 'md', 'lg'].indexOf(v) !== -1
      }
    },
    type: {
      type: String,
      default: 'default',
      validator: function (v) {
        return ['default', 'mirrored'].indexOf(v) !== -1
      }
    },
    label: {
      type: String,
      default: 'Loading'
    }
  },
  emits: []
}
</script>

<style src="./spinner.css" scoped></style>
