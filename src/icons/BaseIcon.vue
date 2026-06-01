<template>
  <span class="wki-base-icon" :style="styles" v-bind="$attrs" v-on="listeners">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'BaseIcon',
  inheritAttrs: false,
  emits: [],
  props: {
    size: {
      type: [Number, String],
      default: 24
    },
    color: {
      type: String,
      default: 'currentColor'
    },
    strokeWidth: {
      type: [Number, String],
      default: 1.75
    },
    fill: {
      type: String,
      default: 'none'
    }
  },
  computed: {
    listeners() {
      return this.$listeners || {}
    },
    styles() {
      const s = typeof this.size === 'number' ? this.size + 'px' : this.size
      return {
        '--wki-icon-size': s,
        '--wki-icon-color': this.color,
        '--wki-icon-stroke-width': String(this.strokeWidth),
        '--wki-icon-fill': this.fill
      }
    }
  }
}
</script>

<style src="../styles/icons.css"></style>
