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
        hasMaxWidth && 'ui-tooltip__content--wrap',
        overlayClassName
      ]"
      :style="overlayStyle ? [tooltipStyle, overlayStyle] : tooltipStyle"
      role="tooltip"
    >
      <span class="ui-tooltip__text">
        <slot name="content">{{ title }}</slot>
      </span>
      <span
        v-if="arrow"
        :class="['ui-tooltip__arrow', `ui-tooltip__arrow--${side}`]"
        :style="arrowStyle"
        aria-hidden="true"
      ></span>
    </span>
  </span>
</template>

<script>
import { acquire, release } from '../../floating/portal-root.js'
import { nextZIndex } from '../../floating/layer-manager.js'

const GAP = 4
const EDGE_PAD = 4

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
    arrow: { type: Boolean, default: true },
    overlayClassName: { type: [String, Array, Object], default: null },
    overlayStyle: { type: [Object, Array], default: null }
  },
  emits: [],
  data() {
    return {
      hovered: false,
      triggerInView: true,
      positionStyle: {},
      arrowStyle: {}
    }
  },
  computed: {
    isVisible() {
      return (this.open || this.hovered) && this.triggerInView
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
      if (v) {
        this.$nextTick(() => {
          this._mountToPortal()
          this.updatePosition()
        })
      } else {
        this._unmountFromPortal()
      }
    },
    side() {
      if (this.isVisible) this.$nextTick(this.updatePosition)
    }
  },
  mounted() {
    const tip = this.$refs.tooltip
    if (tip) {
      this._originalParent = tip.parentNode
      this._originalNextSibling = tip.nextSibling
    }
    if (typeof IntersectionObserver !== 'undefined' && this.$refs.trigger) {
      this._triggerObserver = new IntersectionObserver(
        ([entry]) => {
          this.triggerInView = entry.isIntersecting
        },
        { threshold: 0 }
      )
      this._triggerObserver.observe(this.$refs.trigger)
    }
    window.addEventListener('scroll', this.onScrollOrResize, true)
    window.addEventListener('resize', this.onScrollOrResize)
    if (this.open) {
      this.$nextTick(() => {
        this._mountToPortal()
        this.updatePosition()
      })
    }
    if (typeof this.$on === 'function') {
      // eslint-disable-next-line vue/no-deprecated-events-api
      this.$on('hook:beforeDestroy', this.cleanup)
    }
  },
  beforeUnmount() {
    this.cleanup()
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle, vue/no-dupe-keys
  beforeDestroy() {
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
      // On first open positionStyle is {} so the element has CSS position:relative
      // inside the portal root (width:0). That makes inline-flex shrink to
      // min-content width instead of maxWidth, giving wrong offsetWidth/offsetHeight.
      // Force fixed here so the viewport is the containing block before we measure.
      tip.style.position = 'fixed'
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
      const vw = window.innerWidth
      const vh = window.innerHeight
      left = Math.max(EDGE_PAD, Math.min(left, vw - tw - EDGE_PAD))
      top = Math.max(EDGE_PAD, Math.min(top, vh - th - EDGE_PAD))

      if (this.side === 'top' || this.side === 'bottom') {
        this.arrowStyle = { left: t.left + t.width / 2 - left + 'px' }
      } else {
        this.arrowStyle = { top: t.top + t.height / 2 - top + 'px' }
      }

      this.positionStyle = {
        position: 'fixed',
        top: top + 'px',
        left: left + 'px',
        zIndex: nextZIndex()
      }
    },
    _mountToPortal() {
      const tip = this.$refs.tooltip
      if (typeof document === 'undefined' || !tip) return
      if (!this._tooltipPortalRoot) {
        this._tooltipPortalRoot = acquire()
      }
      if (this._tooltipPortalRoot && tip.parentNode !== this._tooltipPortalRoot) {
        this._tooltipPortalRoot.appendChild(tip)
      }
    },
    _unmountFromPortal() {
      const tip = this.$refs.tooltip
      if (!tip || !this._tooltipPortalRoot) return
      if (tip.parentNode === this._tooltipPortalRoot && this._originalParent) {
        this._originalParent.insertBefore(tip, this._originalNextSibling || null)
      }
      release()
      this._tooltipPortalRoot = null
    },
    cleanup() {
      if (this._triggerObserver) {
        this._triggerObserver.disconnect()
        this._triggerObserver = null
      }
      window.removeEventListener('scroll', this.onScrollOrResize, true)
      window.removeEventListener('resize', this.onScrollOrResize)
      const tip = this.$refs.tooltip
      if (tip && tip.parentNode && tip.parentNode !== this._originalParent) {
        tip.parentNode.removeChild(tip)
      }
      if (this._tooltipPortalRoot) {
        release()
        this._tooltipPortalRoot = null
      }
    }
  }
}
</script>

<style src="./tooltip.css" scoped></style>
