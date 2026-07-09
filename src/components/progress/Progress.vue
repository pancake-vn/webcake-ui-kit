<template>
  <div class="ui-progress" role="progressbar" :aria-valuemin="0" :aria-valuemax="max" :aria-valuenow="clampedValue">
    <div class="ui-progress__bar" :style="{ width: percent + '%' }" />
  </div>
</template>

<script>
export default {
  name: 'Progress',

  props: {
    // Current progress value, clamped to the [0, max] range.
    value: {
      type: Number,
      default: 0
    },
    // Upper bound of the progress scale (value === max renders a full bar).
    max: {
      type: Number,
      default: 100,
      validator: function (v) {
        return v > 0
      }
    }
  },

  emits: [],

  computed: {
    clampedValue() {
      if (this.value < 0) return 0
      if (this.value > this.max) return this.max
      return this.value
    },
    percent() {
      return (this.clampedValue / this.max) * 100
    }
  }
}
</script>

<style src="./progress.css" scoped></style>
