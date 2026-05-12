<template>
  <span class="ui-spinner" :class="[`ui-spinner--${size}`, `ui-spinner--${type}`]" role="status" :aria-label="label">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-loader-circle-icon lucide-loader-circle ui-spinner__svg"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
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
