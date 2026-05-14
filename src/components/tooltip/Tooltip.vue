<template>
  <span class="ui-tooltip">
    <span
      ref="trigger"
      class="ui-tooltip__trigger"
      @mouseenter="onShow"
      @mouseleave="onHide"
      @focusin="onShow"
      @focusout="onHide"
    >
      <slot></slot>
    </span>
    <span
      ref="tooltip"
      v-show="isVisible"
      :class="[
        'ui-tooltip__content',
        `ui-tooltip__content--${color}`,
        `ui-tooltip__content--${side}`,
        hasMaxWidth && 'ui-tooltip__content--wrap'
      ]"
      :style="tooltipStyle"
      role="tooltip"
    >
      <span class="ui-tooltip__text">
        <slot name="content">{{ title }}</slot>
      </span>
      <span v-if="arrow" :class="['ui-tooltip__arrow', `ui-tooltip__arrow--${side}`]" aria-hidden="true"></span>
    </span>
  </span>
</template>

<script>
const GAP = 4

export default {
  name: 'Tooltip',
  props: {
    side: {
      type: String,
      default: 'top',
      validator: v => ['top', 'bottom', 'left', 'right'].includes(v)
    },
    title: { type: String, default: '' },
    maxWidth: { type: [String, Number], default: '' },
    open: { type: Boolean, default: false },
    color: {
      type: String,
      default: 'default',
      validator: v => ['default', 'brand', 'destructive'].includes(v)
    },
    arrow: { type: Boolean, default: true }
  },
  emits: [],
  data() {
    return {
      hovered: false,
      positionStyle: {}
    }
  },
  computed: {
    isVisible() {
      return this.open || this.hovered
    },
    hasMaxWidth() {
      return this.maxWidth !== '' && this.maxWidth !== null && this.maxWidth !== undefined
    },
    tooltipStyle() {
      const style = Object.assign({}, this.positionStyle)
      if (this.hasMaxWidth) {
        style.maxWidth = typeof this.maxWidth === 'number' ? `${this.maxWidth}px` : this.maxWidth
      }
      return style
    }
  },
  watch: {
    isVisible(v) {
      if (v) this.$nextTick(this.updatePosition)
    },
    side() {
      if (this.isVisible) this.$nextTick(this.updatePosition)
    }
  },
  mounted() {
    if (typeof document !== 'undefined' && this.$refs.tooltip) {
      document.body.appendChild(this.$refs.tooltip)
    }
    window.addEventListener('scroll', this.onScrollOrResize, true)
    window.addEventListener('resize', this.onScrollOrResize)
    if (this.open) this.$nextTick(this.updatePosition)
    if (typeof this.$on === 'function') {
      // eslint-disable-next-line vue/no-deprecated-events-api
      this.$on('hook:beforeDestroy', this.cleanup)
    }
  },
  beforeUnmount() {
    this.cleanup()
  },
  methods: {
    onShow() {
      this.hovered = true
    },
    onHide() {
      this.hovered = false
    },
    onScrollOrResize() {
      if (this.isVisible) this.updatePosition()
    },
    updatePosition() {
      const trigger = this.$refs.trigger
      const tip = this.$refs.tooltip
      if (!trigger || !tip) return
      const t = trigger.getBoundingClientRect()
      const tw = tip.offsetWidth
      const th = tip.offsetHeight
      let top = 0
      let left = 0
      if (this.side === 'top') {
        top = t.top - th - GAP
        left = t.left + (t.width - tw) / 2
      } else if (this.side === 'bottom') {
        top = t.bottom + GAP
        left = t.left + (t.width - tw) / 2
      } else if (this.side === 'left') {
        top = t.top + (t.height - th) / 2
        left = t.left - tw - GAP
      } else {
        top = t.top + (t.height - th) / 2
        left = t.right + GAP
      }
      this.positionStyle = {
        position: 'fixed',
        top: top + 'px',
        left: left + 'px',
        zIndex: 1050
      }
    },
    cleanup() {
      window.removeEventListener('scroll', this.onScrollOrResize, true)
      window.removeEventListener('resize', this.onScrollOrResize)
      if (this.$refs.tooltip && this.$refs.tooltip.parentNode === document.body) {
        document.body.removeChild(this.$refs.tooltip)
      }
    }
  }
}
</script>

<style src="./tooltip.css" scoped></style>
