<template>
  <div
    class="ui-divider"
    :class="['ui-divider--' + direction, 'ui-divider--spacing-' + spacing]"
    role="separator"
    :aria-orientation="direction"
  />
</template>

<script>
export default {
  name: 'Divider',

  props: {
    direction: {
      type: String,
      default: 'horizontal',
      validator: function (v) {
        return ['horizontal', 'vertical'].indexOf(v) !== -1
      }
    },
    spacing: {
      type: String,
      default: 'none',
      validator: function (v) {
        return ['none', 'regular', 'spacious'].indexOf(v) !== -1
      }
    }
  },

  emits: []
}
</script>

<style src="./divider.css" scoped></style>
