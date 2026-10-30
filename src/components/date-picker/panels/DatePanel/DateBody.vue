<template>
  <div class="ui-dp-date-body" role="grid" @keydown="onKeydown">
    <div class="ui-dp-date-body__weekdays" role="row">
      <span v-for="wd in weekdays" :key="wd" class="ui-dp-date-body__weekday" role="columnheader">{{ wd }}</span>
    </div>
    <div v-for="(row, ri) in matrix" :key="ri" class="ui-dp-date-body__row" role="row">
      <button
        v-for="cell in row"
        :key="cell.iso"
        role="gridcell"
        :tabindex="cell.iso === focusISO ? 0 : -1"
        :disabled="cell.disabled"
        :class="[
          'ui-dp-date-body__cell',
          !cell.inMonth && 'is-other-month',
          cell.today && 'is-today',
          isSelected(cell.iso) && 'is-selected',
          isRangeStart(cell.iso) && 'is-range-start',
          isRangeEnd(cell.iso) && 'is-range-end',
          isInRange(cell.iso) && 'is-in-range',
          cell.disabled && 'is-disabled'
        ]"
        @click="!cell.disabled && onSelect(cell.iso)"
        @mouseenter="onHover(cell.iso)"
        @mouseleave="onHover(null)"
      >
        <slot :cell="cell">{{ cell.day }}</slot>
      </button>
    </div>
  </div>
</template>

<script>
import { DATE_PICKER_CTX } from '../../context.js'

export default {
  name: 'DateBody',
  inject: { ctx: { from: DATE_PICKER_CTX, default: null } },
  props: {
    // Per-panel day matrix (differs between left/right range panels).
    matrix: { type: Array, default: () => [] }
  },
  emits: [],
  computed: {
    // Selection + config come from the shared context (no prop drilling).
    weekdays() {
      return this.ctx ? this.ctx.weekdays : []
    },
    focusISO() {
      return this.ctx ? this.ctx.focusISO : null
    },
    selected() {
      return this.ctx ? this.ctx.selected : []
    },
    rangeStart() {
      return this.ctx ? this.ctx.rangeStart : null
    },
    rangeEnd() {
      return this.ctx ? this.ctx.rangeEnd : null
    }
  },
  methods: {
    onSelect(iso) {
      if (this.ctx) this.ctx.selectDate(iso)
    },
    onHover(iso) {
      if (this.ctx) this.ctx.hover(iso)
    },
    onKeydown(e) {
      if (this.ctx) this.ctx.gridKeydown(e)
    },
    isSelected(iso) {
      return this.selected.includes(iso)
    },
    isRangeStart(iso) {
      return this.rangeStart === iso
    },
    isRangeEnd(iso) {
      return this.rangeEnd === iso
    },
    isInRange(iso) {
      if (!this.rangeStart || !this.rangeEnd) return false
      return iso > this.rangeStart && iso < this.rangeEnd
    }
  }
}
</script>

<style src="./date-body.css" scoped></style>
