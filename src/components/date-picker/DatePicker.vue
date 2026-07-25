<template>
  <Menu
    class="ui-date-picker"
    :open="isOpen"
    :placement="placement"
    :offset="6"
    :close-on-select="false"
    :disabled="disabled"
    @change="onMenuChange"
    @open="onMenuOpen"
    @close="onMenuClose"
    :overlayStyle="{ maxHeight: 'max-content' }"
  >
    <template #trigger="{ triggerRef, attrs }">
      <div
        :ref="triggerRef"
        class="ui-date-picker__trigger"
        :class="[`ui-date-picker__trigger--${size}`, disabled && 'is-disabled', isOpen && 'is-focus']"
        v-bind="attrs"
        :tabindex="disabled ? -1 : 0"
        role="combobox"
        :aria-expanded="isOpen ? 'true' : 'false'"
        @click="onTriggerClick"
        @keydown="onTriggerKeydown"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      >
        <span class="ui-date-picker__icon">
          <WkiCalendar :size="16" />
        </span>
        <span class="ui-date-picker__text" :class="{ 'is-placeholder': !hasValue }">
          {{ hasValue ? displayText : placeholderText }}
        </span>
        <span
          v-if="clearable && hasValue && !disabled"
          role="button"
          tabindex="0"
          class="ui-date-picker__clear"
          aria-label="Clear"
          @click.stop="onClear"
          @keydown.enter.stop.prevent="onClear"
          @keydown.space.stop.prevent="onClear"
        >
          <WkiX :size="14" />
        </span>
      </div>
    </template>

    <CalendarPanel
      :views="views"
      :month-options="monthOptions"
      :year-options="yearOptions"
      :show-select-month="showSelectMonth"
      :show-select-year="showSelectYear"
      :weekdays="weekdays"
      :mode="mode"
      :selected="viewSelected"
      :range-start="resolvedRange.start"
      :range-end="resolvedRange.end"
      :focus-iso="focusISO"
      :can-prev="canPrev"
      :can-next="canNext"
      :show-time="showTime"
      :time-value="timeValue"
      :show-seconds="showSeconds"
      :hour-step="hourStep"
      :minute-step="minuteStep"
      :second-step="secondStep"
      :disabled-time="disabledTime"
      :show-footer="showFooter"
      :show-today="showToday && mode === 'single'"
      :show-clear="clearable"
      :show-confirm="confirmVisible"
      :today-disabled="todayDisabled"
      :confirm-disabled="confirmDisabled"
      :today-text="todayText"
      :clear-text="clearText"
      :confirm-text="confirmText"
      @prev="shiftMonth(-1)"
      @next="shiftMonth(1)"
      @prev-year="shiftYear(-1)"
      @next-year="shiftYear(1)"
      @set-month="onSetMonth"
      @set-year="onSetYear"
      @select="onSelectDate"
      @hover="onHover"
      @grid-keydown="onGridKeydown"
      @time-change="onTimeChange"
      @today="onToday"
      @clear="onClear"
      @confirm="onConfirm"
    >
      <template #cell="slotProps">
        <slot name="cell" v-bind="slotProps">{{ slotProps.cell.day }}</slot>
      </template>
    </CalendarPanel>
  </Menu>
</template>

<script>
/**
 * @typedef {'date'|'week'|'month'|'quarter'|'year'} PickerType
 * @typedef {'single'|'range'|'multiple'} SelectionMode
 * @typedef {Date|string|number} DateInput
 *
 * @typedef {Object} DatePickerProps
 * @property {DateInput|DateInput[]} [modelValue]  Vue 3 v-model. single→DateInput, range/multiple→DateInput[].
 * @property {DateInput|DateInput[]} [value]       Vue 2 v-model (via model:{prop:'value',event:'change'}).
 * @property {PickerType} [picker='date']          Granularity. Phase 1 implements 'date'.
 * @property {SelectionMode} [mode='single']       Selection behaviour.
 * @property {boolean} [showTime=false]            Append a time column; gates emit behind Confirm.
 * @property {string} [format]                     Display format (dayjs tokens). Defaults by showTime.
 * @property {string|null} [valueFormat=null]      When set, emit formatted strings; else emit Date objects.
 * @property {string|string[]} [placeholder]       Trigger placeholder (array for range [start,end]).
 * @property {boolean} [disabled=false]
 * @property {boolean} [clearable=true]
 * @property {DateInput} [minDate]
 * @property {DateInput} [maxDate]
 * @property {(date: Date) => boolean} [disabledDate]
 * @property {() => Object} [disabledTime]         Returns { disabledHours, disabledMinutes, disabledSeconds }.
 * @property {string} [locale='en']
 * @property {number} [weekStart=0]                0 = Sunday.
 * @property {number} [months=1]                   Visible month panels (1–3).
 * @property {number} [maxCount=0]                 Cap for mode='multiple' (0 = unlimited).
 *
 * Emits: update:modelValue, change, open, close, calendar-change, clear, confirm, today, focus, blur.
 */
import Menu from '../menu/Menu.vue'
import CalendarPanel from './CalendarPanel.vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(customParseFormat)
dayjs.extend(localeData)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
import { ISO, toDayjs, toISO, isDateDisabled, weekdayLabels, buildDayMatrix, orderISO } from './calendar.js'
import { WkiCalendar, WkiX } from '../../icons'

export default {
  name: 'DatePicker',
  components: { Menu, CalendarPanel, WkiCalendar, WkiX },
  // Vue 2 v-model binds `value`/`change`; Vue 3 v-model binds `modelValue`/`update:modelValue`.
  model: { prop: 'value', event: 'change' },
  props: {
    value: { type: [Date, String, Number, Array], default: undefined },
    modelValue: { type: [Date, String, Number, Array], default: undefined },
    picker: {
      type: String,
      default: 'date',
      validator: v => ['date', 'week', 'month', 'quarter', 'year'].includes(v)
    },
    mode: {
      type: String,
      default: 'single',
      validator: v => ['single', 'range', 'multiple'].includes(v)
    },
    showTime: { type: Boolean, default: false },
    format: { type: String, default: null },
    valueFormat: { type: String, default: null },
    placeholder: { type: [String, Array], default: null },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    minDate: { type: [Date, String, Number], default: null },
    maxDate: { type: [Date, String, Number], default: null },
    disabledDate: { type: Function, default: null },
    disabledTime: { type: Function, default: null },
    locale: { type: String, default: 'en' },
    weekStart: { type: Number, default: 0 },
    months: { type: Number, default: 1 },
    maxCount: { type: Number, default: 0 },
    showToday: { type: Boolean, default: true },
    showFooter: { type: Boolean, default: true },
    // Swap the header month / year label for a WkSelect dropdown.
    showSelectMonth: { type: Boolean, default: false },
    showSelectYear: { type: Boolean, default: false },
    showConfirm: { type: Boolean, default: undefined },
    showSeconds: { type: Boolean, default: false },
    hourStep: { type: Number, default: 1 },
    minuteStep: { type: Number, default: 1 },
    secondStep: { type: Number, default: 1 },
    placement: { type: String, default: 'bottom-start' },
    size: {
      type: String,
      default: 'md',
      validator: v => ['sm', 'md', 'lg'].includes(v)
    },
    todayText: { type: String, default: 'Today' },
    clearText: { type: String, default: 'Clear' },
    confirmText: { type: String, default: 'OK' }
  },
  emits: [
    'change',
    'update:modelValue',
    'open',
    'close',
    'calendar-change',
    'clear',
    'confirm',
    'today',
    'focus',
    'blur'
  ],
  data() {
    return {
      isOpen: false,
      // single & multiple: array of ISO keys. range uses the two fields below.
      selection: [],
      rangeStartSel: null,
      rangeEndSel: null,
      rangePicking: false,
      viewISO: dayjs().format(ISO),
      hoverISO: null,
      focusISO: null,
      timeValue: { hour: 0, minute: 0, second: 0 }
    }
  },
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value
    },
    monthsCount() {
      const n = parseInt(this.months, 10) || 1
      return Math.min(3, Math.max(1, n))
    },
    resolvedFormat() {
      if (this.format) return this.format
      return this.showTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'
    },
    min() {
      return toDayjs(this.minDate)
    },
    max() {
      return toDayjs(this.maxDate)
    },
    disableOpts() {
      return { minDate: this.min, maxDate: this.max, disabledDate: this.disabledDate }
    },
    weekdays() {
      return weekdayLabels(this.weekStart, this.locale)
    },
    views() {
      const base = dayjs(this.viewISO, ISO)
      const out = []
      for (let i = 0; i < this.monthsCount; i++) {
        const v = base.add(i, 'month')
        out.push({
          matrix: buildDayMatrix(v, this.weekStart, this.disableOpts),
          monthLabel: (this.locale ? v.locale(this.locale) : v).format('MMMM YYYY'),
          month: v.month(),
          year: v.year()
        })
      }
      return out
    },
    // Localized full month names as header-select options (value = '0'..'11').
    monthOptions() {
      const names = (this.locale ? dayjs().locale(this.locale) : dayjs()).localeData().months()
      return names.map((label, i) => ({ label, value: String(i) }))
    },
    // Year range for the header select — bounded by min/max when present,
    // otherwise ±10 years around the visible month; always spans the view.
    yearOptions() {
      const cur = dayjs(this.viewISO, ISO).year()
      let startY = this.min ? this.min.year() : cur - 10
      let endY = this.max ? this.max.year() : cur + 10
      startY = Math.min(startY, cur)
      endY = Math.max(endY, cur + this.monthsCount - 1)
      const out = []
      for (let y = startY; y <= endY; y++) out.push({ label: String(y), value: String(y) })
      return out
    },
    // What CalendarView highlights as 'selected' (range handled via rangeStart/End).
    viewSelected() {
      return this.mode === 'range' ? [] : this.selection
    },
    // Range band endpoints, including the live hover preview mid-selection.
    resolvedRange() {
      if (this.mode !== 'range') return { start: null, end: null }
      if (this.rangePicking && this.rangeStartSel) {
        return orderISO(this.rangeStartSel, this.hoverISO || this.rangeStartSel)
      }
      if (this.rangeStartSel || this.rangeEndSel) {
        return orderISO(this.rangeStartSel, this.rangeEndSel)
      }
      return { start: null, end: null }
    },
    hasValue() {
      if (this.mode === 'range') return !!(this.rangeStartSel || this.rangeEndSel)
      return this.selection.length > 0
    },
    displayText() {
      if (this.mode === 'single') {
        return this.selection.length ? this.formatDisplay(this.selection[0]) : ''
      }
      if (this.mode === 'multiple') {
        return this.selection.map(iso => this.formatDisplay(iso)).join(', ')
      }
      const s = this.rangeStartSel ? this.formatDisplay(this.rangeStartSel) : ''
      const e = this.rangeEndSel ? this.formatDisplay(this.rangeEndSel) : ''
      return s || e ? `${s} - ${e}` : ''
    },
    placeholderText() {
      if (Array.isArray(this.placeholder)) {
        return this.placeholder.filter(Boolean).join(' - ') || 'Select date'
      }
      if (this.placeholder) return this.placeholder
      return this.mode === 'range' ? 'Start date - End date' : 'Select date'
    },
    confirmVisible() {
      return this.showConfirm === undefined ? this.showTime : this.showConfirm
    },
    confirmDisabled() {
      return !this.hasValue
    },
    todayDisabled() {
      return isDateDisabled(dayjs(), this.disableOpts)
    },
    canPrev() {
      if (!this.min) return true
      return dayjs(this.viewISO, ISO).subtract(1, 'month').endOf('month').isSameOrAfter(this.min, 'day')
    },
    canNext() {
      if (!this.max) return true
      const last = dayjs(this.viewISO, ISO).add(this.monthsCount - 1, 'month')
      return last.add(1, 'month').startOf('month').isSameOrBefore(this.max, 'day')
    }
  },
  watch: {
    currentValue: {
      handler() {
        this.syncFromValue()
      },
      deep: true
    },
    mode() {
      this.syncFromValue()
    }
  },
  created() {
    this.syncFromValue()
  },
  methods: {
    // ---- value <-> internal sync -------------------------------------------
    syncFromValue() {
      const val = this.currentValue
      const fmt = this.resolvedFormat
      if (this.mode === 'single') {
        const iso = toISO(val, fmt)
        this.selection = iso ? [iso] : []
        if (iso) this.captureTime(val)
      } else if (this.mode === 'multiple') {
        const arr = Array.isArray(val) ? val : []
        this.selection = arr.map(v => toISO(v, fmt)).filter(Boolean)
      } else {
        const arr = Array.isArray(val) ? val : []
        this.rangeStartSel = toISO(arr[0], fmt)
        this.rangeEndSel = toISO(arr[1], fmt)
        this.rangePicking = false
      }
      this.syncViewToSelection()
    },
    captureTime(val) {
      const d = toDayjs(val, this.resolvedFormat)
      if (d) this.timeValue = { hour: d.hour(), minute: d.minute(), second: d.second() }
    },
    syncViewToSelection() {
      const anchor = (this.mode === 'range' ? this.rangeStartSel || this.rangeEndSel : this.selection[0]) || null
      this.viewISO = (anchor ? dayjs(anchor, ISO) : dayjs()).format(ISO)
    },
    // ---- output -------------------------------------------------------------
    buildOut(iso) {
      if (!iso) return null
      let d = dayjs(iso, ISO)
      if (this.showTime) {
        d = d
          .hour(this.timeValue.hour)
          .minute(this.timeValue.minute)
          .second(this.showSeconds ? this.timeValue.second : 0)
      }
      return this.valueFormat ? d.format(this.valueFormat) : d.toDate()
    },
    emitValue() {
      let out
      if (this.mode === 'single') {
        out = this.selection.length ? this.buildOut(this.selection[0]) : null
      } else if (this.mode === 'multiple') {
        out = this.selection.map(iso => this.buildOut(iso))
      } else {
        out = [
          this.rangeStartSel ? this.buildOut(this.rangeStartSel) : null,
          this.rangeEndSel ? this.buildOut(this.rangeEndSel) : null
        ]
      }
      this.$emit('change', out)
      this.$emit('update:modelValue', out)
    },
    formatDisplay(iso) {
      let d = dayjs(iso, ISO)
      if (this.showTime) {
        d = d.hour(this.timeValue.hour).minute(this.timeValue.minute).second(this.timeValue.second)
      }
      if (this.locale) d = d.locale(this.locale)
      return d.format(this.resolvedFormat)
    },
    // ---- selection ----------------------------------------------------------
    onSelectDate(iso) {
      if (!iso) return
      if (this.mode === 'single') {
        this.selection = [iso]
        if (this.confirmVisible) return // wait for Confirm
        this.emitValue()
        this.closePicker()
      } else if (this.mode === 'multiple') {
        const idx = this.selection.indexOf(iso)
        let next = idx === -1 ? this.selection.concat([iso]) : this.selection.filter(x => x !== iso)
        if (this.maxCount > 0 && next.length > this.maxCount) {
          next = next.slice(next.length - this.maxCount)
        }
        this.selection = next
        this.emitValue()
      } else {
        this.selectRange(iso)
      }
    },
    selectRange(iso) {
      if (!this.rangePicking) {
        this.rangeStartSel = iso
        this.rangeEndSel = null
        this.rangePicking = true
        this.hoverISO = iso
        this.$emit('calendar-change', [this.buildOut(iso), null])
        return
      }
      const ordered = orderISO(this.rangeStartSel, iso)
      this.rangeStartSel = ordered.start
      this.rangeEndSel = ordered.end
      this.rangePicking = false
      this.hoverISO = null
      this.$emit('calendar-change', [this.buildOut(ordered.start), this.buildOut(ordered.end)])
      if (this.confirmVisible) return
      this.emitValue()
      this.closePicker()
    },
    onHover(iso) {
      if (this.mode === 'range' && this.rangePicking) this.hoverISO = iso
    },
    onTimeChange(t) {
      this.timeValue = t
      // Reflect time live for single once a day is chosen (still gated by Confirm for emit).
      if (!this.confirmVisible && this.hasValue) this.emitValue()
    },
    // ---- footer actions -----------------------------------------------------
    onToday() {
      if (this.todayDisabled) return
      this.onSelectDate(dayjs().format(ISO))
      this.$emit('today')
    },
    onClear() {
      this.selection = []
      this.rangeStartSel = null
      this.rangeEndSel = null
      this.rangePicking = false
      this.hoverISO = null
      this.emitValue()
      this.$emit('clear')
    },
    onConfirm() {
      this.emitValue()
      this.$emit('confirm')
      this.closePicker()
    },
    // ---- navigation ---------------------------------------------------------
    shiftMonth(delta) {
      this.viewISO = dayjs(this.viewISO, ISO).add(delta, 'month').format(ISO)
    },
    shiftYear(delta) {
      this.viewISO = dayjs(this.viewISO, ISO).add(delta, 'year').format(ISO)
    },
    // Header month/year selects target panel `index`; rebase viewISO so that
    // panel shows the chosen month/year (subtract its offset from the anchor).
    onSetMonth({ index, month }) {
      // date(1) first so setting the month never overflows (e.g. Jul 31 → Feb).
      const target = dayjs(this.viewISO, ISO).date(1).add(index, 'month').month(month)
      this.viewISO = target.subtract(index, 'month').format(ISO)
    },
    onSetYear({ index, year }) {
      const target = dayjs(this.viewISO, ISO).date(1).add(index, 'month').year(year)
      this.viewISO = target.subtract(index, 'month').format(ISO)
    },
    // ---- keyboard -----------------------------------------------------------
    onTriggerClick() {
      if (this.disabled) return
      this.isOpen ? this.closePicker() : this.openPicker()
    },
    onTriggerKeydown(e) {
      if (this.disabled) return
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        this.openPicker()
      } else if (e.key === 'Escape') {
        this.closePicker()
      }
    },
    onGridKeydown(e) {
      const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
      let base = this.focusISO || this.selection[0] || this.rangeStartSel || dayjs().format(ISO)
      let d = dayjs(base, ISO)
      let handled = true
      if (map[e.key] !== undefined) {
        d = d.add(map[e.key], 'day')
      } else if (e.key === 'Home') {
        d = d.subtract((d.day() - this.weekStart + 7) % 7, 'day')
      } else if (e.key === 'End') {
        d = d.add(6 - ((d.day() - this.weekStart + 7) % 7), 'day')
      } else if (e.key === 'PageUp') {
        d = d.add(e.shiftKey ? -1 : 0, 'year').add(e.shiftKey ? 0 : -1, 'month')
      } else if (e.key === 'PageDown') {
        d = d.add(e.shiftKey ? 1 : 0, 'year').add(e.shiftKey ? 0 : 1, 'month')
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (this.focusISO && !isDateDisabled(dayjs(this.focusISO, ISO), this.disableOpts)) {
          this.onSelectDate(this.focusISO)
        }
        e.preventDefault()
        return
      } else {
        handled = false
      }
      if (!handled) return
      e.preventDefault()
      this.focusISO = d.format(ISO)
      this.ensureVisible(d)
      this.$nextTick(this.focusActiveCell)
    },
    ensureVisible(d) {
      const first = dayjs(this.viewISO, ISO).startOf('month')
      const last = dayjs(this.viewISO, ISO)
        .add(this.monthsCount - 1, 'month')
        .endOf('month')
      if (d.isBefore(first, 'day')) this.viewISO = d.format(ISO)
      else if (d.isAfter(last, 'day')) this.viewISO = d.subtract(this.monthsCount - 1, 'month').format(ISO)
    },
    focusActiveCell() {
      const el =
        this.$el && this.$el.querySelector ? document.querySelector('.ui-menu .ui-cal-cell[tabindex="0"]') : null
      if (el) el.focus()
    },
    // ---- open/close ---------------------------------------------------------
    openPicker() {
      if (this.disabled || this.isOpen) return
      this.isOpen = true
    },
    closePicker() {
      if (!this.isOpen) return
      this.isOpen = false
    },
    onMenuChange(v) {
      this.isOpen = v
    },
    onMenuOpen() {
      this.syncViewToSelection()
      this.focusISO = (this.mode === 'range' ? this.rangeStartSel : this.selection[0]) || dayjs().format(ISO)
      this.$emit('open')
    },
    onMenuClose() {
      // Abandon a half-picked range so reopening starts clean.
      if (this.rangePicking) {
        this.rangePicking = false
        this.hoverISO = null
        this.syncFromValue()
      }
      this.$emit('close')
    },
    // ---- exposed (via $refs) ------------------------------------------------
    focus() {
      const el = this.$el && this.$el.querySelector('.ui-date-picker__trigger')
      if (el) el.focus()
    },
    blur() {
      const el = this.$el && this.$el.querySelector('.ui-date-picker__trigger')
      if (el) el.blur()
    },
    open() {
      this.openPicker()
    },
    close() {
      this.closePicker()
    }
  }
}
</script>

<style src="./date-picker.css" scoped></style>
