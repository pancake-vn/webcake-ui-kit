<template>
  <div
    class="ui-slider"
    :class="{
      'ui-slider--vertical': orientation === 'vertical',
      'ui-slider--disabled': disabled,
      'ui-slider--range': range
    }"
  >
    <div class="ui-slider__track" ref="track" @click="onTrackClick">
      <div class="ui-slider__fill" :style="fillStyle" />
      <div
        v-if="!range"
        class="ui-slider__thumb"
        role="slider"
        tabindex="0"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="localValue"
        :aria-orientation="orientation"
        :style="thumbStyle(localValue)"
        @mousedown.prevent="startDrag('single', $event)"
        @touchstart.prevent="startDragTouch('single', $event)"
        @keydown="onKeydown('single', $event)"
        @click.stop
      />
      <template v-if="range">
        <div
          class="ui-slider__thumb"
          role="slider"
          tabindex="0"
          :aria-valuemin="min"
          :aria-valuemax="localRangeMax"
          :aria-valuenow="localRangeMin"
          :aria-orientation="orientation"
          :style="thumbStyle(localRangeMin)"
          @mousedown.prevent="startDrag('min', $event)"
          @touchstart.prevent="startDragTouch('min', $event)"
          @keydown="onKeydown('min', $event)"
          @click.stop
        />
        <div
          class="ui-slider__thumb"
          role="slider"
          tabindex="0"
          :aria-valuemin="localRangeMin"
          :aria-valuemax="max"
          :aria-valuenow="localRangeMax"
          :aria-orientation="orientation"
          :style="thumbStyle(localRangeMax)"
          @mousedown.prevent="startDrag('max', $event)"
          @touchstart.prevent="startDragTouch('max', $event)"
          @keydown="onKeydown('max', $event)"
          @click.stop
        />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Slider',
  props: {
    value: { type: Number, default: 50 },
    rangeValue: {
      type: Array,
      default: function () {
        return [25, 75]
      }
    },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    range: { type: Boolean, default: false },
    orientation: {
      type: String,
      default: 'horizontal',
      validator: function (v) {
        return ['horizontal', 'vertical'].indexOf(v) !== -1
      }
    },
    disabled: { type: Boolean, default: false }
  },
  emits: ['change', 'input'],
  data: function () {
    return {
      localValue: this.value,
      localRangeMin: Array.isArray(this.rangeValue) ? this.rangeValue[0] : 25,
      localRangeMax: Array.isArray(this.rangeValue) ? this.rangeValue[1] : 75,
      dragging: null,
      boundMouseMove: null,
      boundMouseUp: null,
      boundTouchMove: null,
      boundTouchEnd: null
    }
  },
  watch: {
    value: function (v) {
      this.localValue = v
    },
    rangeValue: function (v) {
      if (Array.isArray(v)) {
        this.localRangeMin = v[0]
        this.localRangeMax = v[1]
      }
    }
  },
  computed: {
    fillStyle: function () {
      var minPct = (this.localRangeMin - this.min) / (this.max - this.min)
      var maxPct = (this.localRangeMax - this.min) / (this.max - this.min)
      var valPct = (this.localValue - this.min) / (this.max - this.min)
      if (this.orientation === 'vertical') {
        if (this.range) {
          return { bottom: minPct * 100 + '%', height: (maxPct - minPct) * 100 + '%' }
        }
        return { bottom: '0%', height: valPct * 100 + '%' }
      }
      if (this.range) {
        return { left: minPct * 100 + '%', width: (maxPct - minPct) * 100 + '%' }
      }
      return { left: '0%', width: valPct * 100 + '%' }
    }
  },
  created: function () {
    this.boundMouseMove = this.onMouseMove.bind(this)
    this.boundMouseUp = this.stopDrag.bind(this)
    this.boundTouchMove = this.onTouchMove.bind(this)
    this.boundTouchEnd = this.stopDrag.bind(this)
  },
  beforeUnmount: function () {
    this.cleanup()
  },
  methods: {
    cleanup: function () {
      document.removeEventListener('mousemove', this.boundMouseMove)
      document.removeEventListener('mouseup', this.boundMouseUp)
      document.removeEventListener('touchmove', this.boundTouchMove)
      document.removeEventListener('touchend', this.boundTouchEnd)
    },
    thumbStyle: function (val) {
      var p = (val - this.min) / (this.max - this.min)
      if (this.orientation === 'vertical') {
        return { bottom: p * 100 + '%' }
      }
      return { left: p * 100 + '%' }
    },
    snap: function (val) {
      var stepped = Math.round((val - this.min) / this.step) * this.step + this.min
      return Math.max(this.min, Math.min(this.max, parseFloat(stepped.toFixed(10))))
    },
    valueFromPointer: function (clientX, clientY) {
      var rect = this.$refs.track.getBoundingClientRect()
      var ratio
      if (this.orientation === 'vertical') {
        ratio = 1 - (clientY - rect.top) / rect.height
      } else {
        ratio = (clientX - rect.left) / rect.width
      }
      ratio = Math.max(0, Math.min(1, ratio))
      return this.snap(this.min + ratio * (this.max - this.min))
    },
    startDrag: function (which) {
      if (this.disabled) return
      this.dragging = which
      document.addEventListener('mousemove', this.boundMouseMove)
      document.addEventListener('mouseup', this.boundMouseUp)
    },
    startDragTouch: function (which) {
      if (this.disabled) return
      this.dragging = which
      document.addEventListener('touchmove', this.boundTouchMove, { passive: false })
      document.addEventListener('touchend', this.boundTouchEnd)
    },
    onMouseMove: function (event) {
      if (!this.dragging) return
      this.applyValue(this.dragging, this.valueFromPointer(event.clientX, event.clientY))
    },
    onTouchMove: function (event) {
      if (!this.dragging) return
      event.preventDefault()
      var t = event.touches[0]
      this.applyValue(this.dragging, this.valueFromPointer(t.clientX, t.clientY))
    },
    stopDrag: function () {
      this.dragging = null
      document.removeEventListener('mousemove', this.boundMouseMove)
      document.removeEventListener('mouseup', this.boundMouseUp)
      document.removeEventListener('touchmove', this.boundTouchMove)
      document.removeEventListener('touchend', this.boundTouchEnd)
    },
    applyValue: function (which, val) {
      if (which === 'single') {
        this.localValue = val
        this.$emit('input', val)
        this.$emit('change', val)
      } else if (which === 'min') {
        var newMin = Math.min(val, this.localRangeMax - this.step)
        this.localRangeMin = this.snap(newMin)
        this.$emit('change', [this.localRangeMin, this.localRangeMax])
      } else if (which === 'max') {
        var newMax = Math.max(val, this.localRangeMin + this.step)
        this.localRangeMax = this.snap(newMax)
        this.$emit('change', [this.localRangeMin, this.localRangeMax])
      }
    },
    onTrackClick: function (event) {
      if (this.disabled) return
      var val = this.valueFromPointer(event.clientX, event.clientY)
      if (!this.range) {
        this.applyValue('single', val)
        return
      }
      var distMin = Math.abs(val - this.localRangeMin)
      var distMax = Math.abs(val - this.localRangeMax)
      this.applyValue(distMin <= distMax ? 'min' : 'max', val)
    },
    onKeydown: function (which, event) {
      if (this.disabled) return
      var key = event.key
      var isIncrease = key === 'ArrowRight' || key === 'ArrowUp'
      var isDecrease = key === 'ArrowLeft' || key === 'ArrowDown'
      var isHome = key === 'Home'
      var isEnd = key === 'End'
      if (!isIncrease && !isDecrease && !isHome && !isEnd) return
      event.preventDefault()
      var current, newVal
      if (which === 'single') {
        current = this.localValue
        newVal = isHome ? this.min : isEnd ? this.max : current + (isIncrease ? this.step : -this.step)
        this.applyValue('single', this.snap(newVal))
      } else if (which === 'min') {
        current = this.localRangeMin
        newVal = isHome
          ? this.min
          : isEnd
            ? this.localRangeMax - this.step
            : current + (isIncrease ? this.step : -this.step)
        this.applyValue('min', this.snap(newVal))
      } else if (which === 'max') {
        current = this.localRangeMax
        newVal = isHome
          ? this.localRangeMin + this.step
          : isEnd
            ? this.max
            : current + (isIncrease ? this.step : -this.step)
        this.applyValue('max', this.snap(newVal))
      }
    }
  }
}
</script>

<style src="./slider.css" scoped></style>
