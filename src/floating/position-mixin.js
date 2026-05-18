// Tracks a reference element and updates a floating element's position
// whenever either resizes or the viewport scrolls. Uses ResizeObserver +
// a single passive-capture scroll listener throttled via requestAnimationFrame
// so the work stays cheap even on long-scroll containers.

import { computePosition } from './compute-position.js'

export default {
  data() {
    return { pmTop: 0, pmLeft: 0, pmResolvedPlacement: '', pmAnchorWidth: 0 }
  },
  methods: {
    _pmAttach(refEl, floatEl) {
      if (typeof window === 'undefined') return
      this._pmRefEl = refEl
      this._pmFloatEl = floatEl
      this._pmTick = () => {
        if (this._pmRaf) return
        this._pmRaf = window.requestAnimationFrame(() => {
          this._pmRaf = null
          this._pmUpdate()
        })
      }
      window.addEventListener('scroll', this._pmTick, { passive: true, capture: true })
      window.addEventListener('resize', this._pmTick)
      if (typeof window.ResizeObserver === 'function') {
        this._pmRO = new window.ResizeObserver(this._pmTick)
        if (refEl) this._pmRO.observe(refEl)
        if (floatEl) this._pmRO.observe(floatEl)
      }
      this._pmUpdate()
    },
    _pmDetach() {
      if (typeof window === 'undefined') return
      if (this._pmTick) {
        window.removeEventListener('scroll', this._pmTick, true)
        window.removeEventListener('resize', this._pmTick)
      }
      if (this._pmRaf) {
        window.cancelAnimationFrame(this._pmRaf)
        this._pmRaf = null
      }
      if (this._pmRO) {
        this._pmRO.disconnect()
        this._pmRO = null
      }
      this._pmRefEl = null
      this._pmFloatEl = null
      this._pmTick = null
    },
    _pmUpdate() {
      const ref = this._pmRefEl
      const float = this._pmFloatEl
      if (!ref || !float || typeof ref.getBoundingClientRect !== 'function') return
      const placement = this.placement || 'bottom-start'
      const offset = typeof this.offset === 'number' ? this.offset : 4
      const r = ref.getBoundingClientRect()
      // Use offsetWidth/offsetHeight (pre-transform layout size) so that CSS enter/leave
      // animations (e.g. scale(0.96)) don't skew the dimension used in top/left placement math.
      const f = { width: float.offsetWidth, height: float.offsetHeight }
      const result = computePosition(r, f, placement, { offset })
      this.pmTop = result.top
      this.pmLeft = result.left
      this.pmResolvedPlacement = result.placement
      this.pmAnchorWidth = r.width
    }
  },
  beforeDestroy() {
    this._pmDetach()
  },
  beforeUnmount() {
    this._pmDetach()
  }
}
