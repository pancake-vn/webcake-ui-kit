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

<style scoped>
.wki-base-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  vertical-align: middle;
  line-height: 0;
}

.wki-base-icon ::v-deep svg {
  width: var(--wki-icon-size);
  height: var(--wki-icon-size);
  color: var(--wki-icon-color);
  stroke-width: var(--wki-icon-stroke-width);
  fill: var(--wki-icon-fill);
}
</style>
