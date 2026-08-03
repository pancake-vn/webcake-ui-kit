<template>
  <div
    :class="['ui-table-v2__cell-resize-handle', dragging && 'dragging', reversed && 'reversed']"
    @mousedown.stop.prevent="handleMouseDown"
    @touchstart.stop.prevent="handleTouchStart"
    @click.stop.prevent
  >
    <div class="ui-table-v2__cell-resize-line"></div>
  </div>
</template>

<script>
export default {
  name: 'ColumnDragHandle',
  props: {
    column: { type: Object, required: true },
    width: { type: Number, default: 0 },
    minWidth: { type: Number, default: 50 },
    maxWidth: { type: Number, default: Infinity },
    reversed: { type: Boolean, default: false }
  },
  emits: ['resize'],
  data: function () {
    return {
      dragging: false
    }
  },
  created: function () {
    this._startX = 0
    this._baseWidth = 0
    this._rafId = null
    this._moveHandler = null
    this._stopHandler = null
  },
  beforeUnmount: function () {
    this._removeEvents()
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle, vue/no-dupe-keys
  beforeDestroy: function () {
    this._removeEvents()
  },
  methods: {
    _getPageX: function (e) {
      if (e.touches) {
        return e.touches.length ? e.touches[0].pageX : e.changedTouches[0].pageX
      }
      return e.pageX
    },
    _clampWidth: function (w) {
      const min = typeof this.minWidth === 'number' && !isNaN(this.minWidth) ? this.minWidth : 50
      const max = typeof this.maxWidth === 'number' && !isNaN(this.maxWidth) ? this.maxWidth : Infinity
      return Math.min(Math.max(w, min), max)
    },
    _updateWidth: function (e) {
      const deltaX = this._startX - this._getPageX(e)
      const w = this._clampWidth(this.reversed ? this._baseWidth + deltaX : this._baseWidth - deltaX)
      if (this._rafId) cancelAnimationFrame(this._rafId)
      this._rafId = requestAnimationFrame(() => {
        this.$emit('resize', w, this.column)
      })
    },
    _removeEvents: function () {
      if (this._moveHandler) {
        document.documentElement.removeEventListener('mousemove', this._moveHandler)
        document.documentElement.removeEventListener('touchmove', this._moveHandler)
        this._moveHandler = null
      }
      if (this._stopHandler) {
        document.documentElement.removeEventListener('mouseup', this._stopHandler)
        document.documentElement.removeEventListener('touchend', this._stopHandler)
        this._stopHandler = null
      }
      if (this._rafId) {
        cancelAnimationFrame(this._rafId)
        this._rafId = null
      }
    },
    _handleStart: function (e) {
      this.dragging = true
      this._removeEvents()
      this._baseWidth = this.$el.parentNode.getBoundingClientRect().width
      this._startX = this._getPageX(e)
      this._moveHandler = this._updateWidth.bind(this)
      this._stopHandler = e => {
        this.dragging = false
        this._updateWidth(e)
        this._removeEvents()
      }
      document.documentElement.addEventListener('mousemove', this._moveHandler)
      document.documentElement.addEventListener('touchmove', this._moveHandler, { passive: false })
      document.documentElement.addEventListener('mouseup', this._stopHandler)
      document.documentElement.addEventListener('touchend', this._stopHandler)
    },
    handleMouseDown: function (e) {
      if (e.which !== 1) return
      this._handleStart(e)
    },
    handleTouchStart: function (e) {
      this._handleStart(e)
    }
  }
}
</script>
