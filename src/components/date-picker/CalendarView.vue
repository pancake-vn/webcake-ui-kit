<template>
  <div class="ui-cal-view">
    <div class="ui-cal-view__weekdays" aria-hidden="true">
      <span v-for="(w, i) in weekdays" :key="i" class="ui-cal-view__weekday">{{ w }}</span>
    </div>
    <div class="ui-cal-view__grid" role="grid" @mouseleave="$emit('hover', null)">
      <button
        v-for="cell in matrix"
        :key="cell.iso"
        type="button"
        role="gridcell"
        class="ui-cal-cell"
        :class="cellClass(cell)"
        :disabled="cell.disabled"
        :tabindex="cell.iso === focusIso ? 0 : -1"
        :aria-selected="isSelected(cell) ? 'true' : 'false'"
        :aria-current="cell.today ? 'date' : null"
        @click="onSelect(cell)"
        @mouseenter="onHover(cell)"
        @focus="onHover(cell)"
      >
        <span class="ui-cal-cell__inner">
          <slot name="cell" :cell="cell">{{ cell.day }}</slot>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { rangePosition, isWithinRange } from './calendar.js'

export default {
  name: 'CalendarView',
  props: {
    // 42-cell array from buildDayMatrix().
    matrix: { type: Array, default: () => [] },
    // 7 weekday header labels, already rotated to weekStart.
    weekdays: { type: Array, default: () => [] },
    mode: { type: String, default: 'single' },
    // Selected ISO keys (single => [iso], multiple => [...isos], range => []).
    selected: { type: Array, default: () => [] },
    // Resolved range endpoints (include live hover preview) for the band.
    rangeStart: { type: String, default: null },
    rangeEnd: { type: String, default: null },
    // Roving keyboard focus target.
    focusIso: { type: String, default: null },
    // When true (multi-month view), suppress selection/range styling on days
    // that belong to an adjacent month so each panel only paints its own days.
    clipOutside: { type: Boolean, default: false }
  },
  emits: ['select', 'hover'],
  methods: {
    isSelected(cell) {
      if (this.clipOutside && cell.outside) return false
      if (this.mode === 'range') {
        return cell.iso === this.rangeStart || cell.iso === this.rangeEnd
      }
      return this.selected.indexOf(cell.iso) !== -1
    },
    cellClass(cell) {
      const cls = {
        'is-outside': cell.outside,
        'is-today': cell.today,
        'is-weekend': cell.weekend,
        'is-disabled': cell.disabled,
        // The filled endpoint chip is clipped on outside days (via isSelected)
        // so a shared date isn't drawn "active" in two panels at once...
        'is-selected': this.isSelected(cell),
        'is-focus': cell.iso === this.focusIso
      }
      if (this.mode === 'range') {
        // ...but the connecting band (::before) DOES extend onto outside days so
        // the range reads continuously to each panel's edge.
        const pos = rangePosition(cell.iso, this.rangeStart, this.rangeEnd)
        const clippedOutside = this.clipOutside && cell.outside
        if (pos === 'middle') {
          cls['is-in-range'] = true
        } else if (pos === 'left' || pos === 'right') {
          // A true endpoint (with chip) gets the rounded half end-cap; an outside
          // endpoint has no chip, so give it a FULL band segment instead of a
          // bare half-cell — otherwise the panel edge shows a broken 50% band.
          if (clippedOutside) cls['is-in-range'] = true
          else cls['is-range-' + pos] = true
        } else if (pos === 'single' && !clippedOutside) {
          cls['is-range-single'] = true
        }
        if (isWithinRange(cell.iso, this.rangeStart, this.rangeEnd)) cls['is-in-range'] = true
      }
      return cls
    },
    onSelect(cell) {
      if (cell.disabled) return
      this.$emit('select', cell.iso)
    },
    onHover(cell) {
      if (cell.disabled) return
      this.$emit('hover', cell.iso)
    }
  }
}
</script>

<style src="./calendar-view.css" scoped></style>
