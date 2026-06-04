<template>
  <div
    class="ui-slider"
    :class="{
      'ui-slider--vertical': orientation === 'vertical',
      'ui-slider--disabled': disabled,
      'ui-slider--range': range
    }"
    :style="rootStyle"
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

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    value: { type: [Number, Array], default: 50 },
    modelValue: { default: null },
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
    disabled: { type: Boolean, default: false },
    width: { type: [String, Number], default: null },
    stepRanges: {
      type: Array,
      default: function () {
        return []
      },
      validator: function (v) {
        return v.every(function (seg) {
          return typeof seg.step === 'number' && seg.step > 0
        })
      }
    }
  },

  emits: ['change', 'input', 'update:modelValue'],

  data: function () {
    var mv = this.modelValue !== null ? this.modelValue : this.value
    var singleInit = typeof mv === 'number' ? mv : 50
    var rangeInit = Array.isArray(mv) ? mv : Array.isArray(this.rangeValue) ? this.rangeValue : [25, 75]
    return {
      localValue: singleInit,
      localRangeMin: rangeInit[0],
      localRangeMax: rangeInit[1],
      dragging: null,
      dragAccum: 0,
      dragLastX: 0,
      dragLastY: 0,
      dragTrackRect: null,
      boundMouseMove: null,
      boundMouseUp: null,
      boundTouchMove: null,
      boundTouchEnd: null
    }
  },

  watch: {
    value: function (v) {
      if (typeof v === 'number') this.localValue = v
      else if (Array.isArray(v)) {
        this.localRangeMin = v[0]
        this.localRangeMax = v[1]
      }
    },
    modelValue: function (v) {
      if (typeof v === 'number') this.localValue = v
      else if (Array.isArray(v)) {
        this.localRangeMin = v[0]
        this.localRangeMax = v[1]
      }
    },
    rangeValue: function (v) {
      if (Array.isArray(v)) {
        this.localRangeMin = v[0]
        this.localRangeMax = v[1]
      }
    }
  },
  computed: {
    rootStyle: function () {
      if (this.width === null) return {}
      return { width: typeof this.width === 'number' ? this.width + 'px' : this.width }
    },
    totalSteps: function () {
      if (!this.stepRanges || this.stepRanges.length === 0) {
        return (this.max - this.min) / this.step
      }
      var total = 0
      var from = this.min
      for (var i = 0; i < this.stepRanges.length; i++) {
        var seg = this.stepRanges[i]
        var to = seg.to !== undefined ? seg.to : this.max
        total += (to - from) / seg.step
        from = to
      }
      return total
    },
    fillStyle: function () {
      var minPct = this.valueToRatio(this.localRangeMin)
      var maxPct = this.valueToRatio(this.localRangeMax)
      var valPct = this.valueToRatio(this.localValue)
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
      var p = this.valueToRatio(val)
      if (this.orientation === 'vertical') {
        return { bottom: p * 100 + '%' }
      }
      return { left: p * 100 + '%' }
    },
    valueToRatio: function (val) {
      if (!this.stepRanges || this.stepRanges.length === 0) {
        return (val - this.min) / (this.max - this.min)
      }
      var stepIndex = 0
      var from = this.min
      for (var i = 0; i < this.stepRanges.length; i++) {
        var seg = this.stepRanges[i]
        var to = seg.to !== undefined ? seg.to : this.max
        if (val <= to || i === this.stepRanges.length - 1) {
          stepIndex += (val - from) / seg.step
          break
        }
        stepIndex += (to - from) / seg.step
        from = to
      }
      return stepIndex / this.totalSteps
    },
    ratioToValue: function (ratio) {
      if (!this.stepRanges || this.stepRanges.length === 0) {
        return this.snap(this.min + ratio * (this.max - this.min))
      }
      var targetStep = ratio * this.totalSteps
      var accSteps = 0
      var from = this.min
      for (var i = 0; i < this.stepRanges.length; i++) {
        var seg = this.stepRanges[i]
        var to = seg.to !== undefined ? seg.to : this.max
        var segSteps = (to - from) / seg.step
        if (targetStep <= accSteps + segSteps || i === this.stepRanges.length - 1) {
          return this.snap(from + (targetStep - accSteps) * seg.step)
        }
        accSteps += segSteps
        from = to
      }
      return this.max
    },
    getSegmentAt: function (val) {
      if (!this.stepRanges || this.stepRanges.length === 0) {
        return { from: this.min, to: this.max, step: this.step }
      }
      var from = this.min
      for (var i = 0; i < this.stepRanges.length; i++) {
        var seg = this.stepRanges[i]
        var to = seg.to !== undefined ? seg.to : this.max
        if (val <= to || i === this.stepRanges.length - 1) {
          return { from: from, to: to, step: seg.step }
        }
        from = to
      }
      return { from: this.min, to: this.max, step: this.step }
    },
    snap: function (val) {
      var seg = this.getSegmentAt(val)
      var stepped = Math.round((val - seg.from) / seg.step) * seg.step + seg.from
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
      return this.ratioToValue(ratio)
    },
    valueAtStepOffset: function (baseVal, stepDelta) {
      var baseStep = Math.round(this.valueToRatio(baseVal) * this.totalSteps)
      var targetStep = Math.max(0, Math.min(this.totalSteps, baseStep + stepDelta))
      return this.ratioToValue(targetStep / this.totalSteps)
    },
    startDrag: function (which, event) {
      if (this.disabled) return
      this.dragging = which
      this.dragLastX = event.clientX
      this.dragLastY = event.clientY
      this.dragAccum = 0
      this.dragTrackRect = this.$refs.track.getBoundingClientRect()
      document.addEventListener('mousemove', this.boundMouseMove)
      document.addEventListener('mouseup', this.boundMouseUp)
    },
    startDragTouch: function (which, event) {
      if (this.disabled) return
      this.dragging = which
      var t = event.touches[0]
      this.dragLastX = t.clientX
      this.dragLastY = t.clientY
      this.dragAccum = 0
      this.dragTrackRect = this.$refs.track.getBoundingClientRect()
      document.addEventListener('touchmove', this.boundTouchMove, { passive: false })
      document.addEventListener('touchend', this.boundTouchEnd)
    },
    onMouseMove: function (event) {
      if (!this.dragging) return
      this.processDragDelta(this.dragging, event.clientX - this.dragLastX, event.clientY - this.dragLastY)
      this.dragLastX = event.clientX
      this.dragLastY = event.clientY
    },
    onTouchMove: function (event) {
      if (!this.dragging) return
      event.preventDefault()
      var t = event.touches[0]
      this.processDragDelta(this.dragging, t.clientX - this.dragLastX, t.clientY - this.dragLastY)
      this.dragLastX = t.clientX
      this.dragLastY = t.clientY
    },
    processDragDelta: function (which, deltaX, deltaY) {
      var pixelsPerStep =
        this.orientation === 'vertical'
          ? this.dragTrackRect.height / this.totalSteps
          : this.dragTrackRect.width / this.totalSteps
      this.dragAccum += (this.orientation === 'vertical' ? -deltaY : deltaX) / pixelsPerStep

      var steps =
        this.dragAccum >= 1 ? Math.floor(this.dragAccum) : this.dragAccum <= -1 ? Math.ceil(this.dragAccum) : 0
      if (steps === 0) return
      this.dragAccum -= steps

      var currentVal = which === 'single' ? this.localValue : which === 'min' ? this.localRangeMin : this.localRangeMax
      var newVal = this.valueAtStepOffset(currentVal, steps)
      if (newVal === currentVal) {
        this.dragAccum = 0
        return
      }
      this.applyValue(which, newVal)
    },
    stopDrag: function () {
      this.dragging = null
      this.dragAccum = 0
      this.dragTrackRect = null
      document.removeEventListener('mousemove', this.boundMouseMove)
      document.removeEventListener('mouseup', this.boundMouseUp)
      document.removeEventListener('touchmove', this.boundTouchMove)
      document.removeEventListener('touchend', this.boundTouchEnd)
    },
    applyValue: function (which, val) {
      var arr
      if (which === 'single') {
        this.localValue = val
        this.$emit('input', val)
        this.$emit('update:modelValue', val)
        this.$emit('change', val)
        return
      }
      if (which === 'min') {
        this.localRangeMin = this.snap(Math.min(val, this.localRangeMax - this.getSegmentAt(val).step))
      } else {
        this.localRangeMax = this.snap(Math.max(val, this.localRangeMin + this.getSegmentAt(val).step))
      }
      arr = [this.localRangeMin, this.localRangeMax]
      this.$emit('input', arr)
      this.$emit('update:modelValue', arr)
      this.$emit('change', arr)
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
      var current, newVal, stepSize
      if (which === 'single') {
        current = this.localValue
        stepSize = this.getSegmentAt(current).step
        newVal = isHome ? this.min : isEnd ? this.max : current + (isIncrease ? stepSize : -stepSize)
        this.applyValue('single', this.snap(newVal))
      } else if (which === 'min') {
        current = this.localRangeMin
        stepSize = this.getSegmentAt(current).step
        newVal = isHome
          ? this.min
          : isEnd
            ? this.localRangeMax - stepSize
            : current + (isIncrease ? stepSize : -stepSize)
        this.applyValue('min', this.snap(newVal))
      } else if (which === 'max') {
        current = this.localRangeMax
        stepSize = this.getSegmentAt(current).step
        newVal = isHome
          ? this.localRangeMin + stepSize
          : isEnd
            ? this.max
            : current + (isIncrease ? stepSize : -stepSize)
        this.applyValue('max', this.snap(newVal))
      }
    }
  }
}
</script>

<style src="./slider.css" scoped></style>
