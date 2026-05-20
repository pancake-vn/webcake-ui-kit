<template>
  <span class="ui-spinner" :class="[`ui-spinner--${size}`, `ui-spinner--${type}`]" role="status" :aria-label="label">
    <WkiLoaderCircle class="ui-spinner__svg" />
  </span>
</template>

<script>
import WkiLoaderCircle from '../../icons/LoaderCircle.vue'
export default {
  name: 'Spinner',
  components: {
    WkiLoaderCircle
  },
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
