<template>
  <Menu
    :open="isOpen"
    :placement="placement"
    :offset="6"
    :close-on-select="false"
    :disabled="disabled"
    :overlay-style="{ maxHeight: 'max-content' }"
    @change="onMenuChange"
    @open="onMenuOpen"
    @close="onMenuClose"
  >
    <template #trigger="{ triggerRef, attrs }">
      <div :ref="triggerRef">
        <PickerTrigger
          v-bind="attrs"
          :display-text="displayText"
          :placeholder="placeholderText"
          :has-value="hasValue"
          :clearable="clearable"
          :disabled="disabled"
          :focused="isOpen"
          :size="size"
          @click="onTriggerClick"
          @keydown="onTriggerKeydown"
          @focus="$emit('focus', $event)"
          @blur="$emit('blur', $event)"
          @clear="onClear"
        >
          <template #icon
            ><slot name="icon"><WkiCalendar :size="16" /></slot
          ></template>
        </PickerTrigger>
      </div>
    </template>

    <PickerPanel
      :views="views"
      :can-prev="canPrev"
      :can-next="canNext"
      :can-prev-year="canPrevYear"
      :can-next-year="canNextYear"
      @prev="shiftMonth(-1)"
      @next="shiftMonth(1)"
      @prev-year="shiftYear(-1)"
      @next-year="shiftYear(1)"
      @set-view="onSetView"
    >
      <template #cell="slotProps">
        <slot name="cell" v-bind="slotProps" />
      </template>
    </PickerPanel>
  </Menu>
</template>

<script>
import Menu from '../menu/Menu.vue'
import PickerTrigger from './PickerTrigger.vue'
import PickerPanel from './panels/PickerPanel.vue'
import { WkiCalendar } from '../../icons'
import { DATE_PICKER_CTX, createDatePickerContext } from './context.js'
import dayjs, { ISO, toDayjs, toISO, isDateDisabled, weekdayLabels, buildDayMatrix } from './generate/dayjs.js'

export default {
  name: 'DatePicker',
  components: { Menu, PickerTrigger, PickerPanel, WkiCalendar },
  model: { prop: 'value', event: 'change' },
  provide() {
    return { [DATE_PICKER_CTX]: createDatePickerContext(this) }
  },
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
      validator: v => ['single', 'multiple'].includes(v)
    },
    showTime: { type: Boolean, default: false },
    format: { type: String, default: null },
    valueFormat: { type: String, default: null },
    placeholder: { type: String, default: null },
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
    showYearJump: { type: Boolean, default: true },
    showSeconds: { type: Boolean, default: false },
    hourStep: { type: Number, default: 1 },
    minuteStep: { type: Number, default: 1 },
    secondStep: { type: Number, default: 1 },
    placement: { type: String, default: 'bottom-start' },
    size: {
      type: String,
      default: 'md',
      validator: v => ['xs', 'sm', 'md', 'lg'].includes(v)
    },
    cancelText: { type: String, default: 'Cancel' },
    confirmText: { type: String, default: 'Apply' },
    presets: { type: Array, default: () => [] },
    showFooter: { type: Boolean, default: false }
  },
  emits: ['change', 'update:modelValue', 'open', 'close', 'clear', 'focus', 'blur'],
  data() {
    return {
      isOpen: false,
      selection: [],
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
          monthLabel: (this.locale ? v.locale(this.locale) : v).format('MMMM'),
          yearLabel: (this.locale ? v.locale(this.locale) : v).format('YYYY'),
          month: v.month(),
          year: v.year()
        })
      }
      return out
    },
    ctxSelected() {
      return this.selection
    },
    ctxRangeStart() {
      return null
    },
    ctxRangeEnd() {
      return null
    },
    hasValue() {
      return this.selection.length > 0
    },
    displayText() {
      if (this.mode === 'single') {
        return this.selection.length ? this.formatDisplay(this.selection[0]) : ''
      }
      return this.selection.map(iso => this.formatDisplay(iso)).join(', ')
    },
    placeholderText() {
      return this.placeholder || 'Select date'
    },
    canPrev() {
      if (!this.min) return true
      return dayjs(this.viewISO, ISO).subtract(1, 'month').endOf('month').isSameOrAfter(this.min, 'day')
    },
    canNext() {
      if (!this.max) return true
      const last = dayjs(this.viewISO, ISO).add(this.monthsCount - 1, 'month')
      return last.add(1, 'month').startOf('month').isSameOrBefore(this.max, 'day')
    },
    canPrevYear() {
      if (!this.min) return true
      return dayjs(this.viewISO, ISO).subtract(1, 'year').endOf('year').isSameOrAfter(this.min, 'day')
    },
    canNextYear() {
      if (!this.max) return true
      const last = dayjs(this.viewISO, ISO).add(this.monthsCount - 1, 'month')
      return last.add(1, 'year').startOf('year').isSameOrBefore(this.max, 'day')
    }
  },
  watch: {
    currentValue: {
      handler() {
        this.syncFromValue()
      },
      deep: true
    }
  },
  created() {
    this.syncFromValue()
  },
  methods: {
    syncFromValue() {
      const val = this.currentValue
      const fmt = this.resolvedFormat
      if (this.mode === 'single') {
        const iso = toISO(val, fmt)
        this.selection = iso ? [iso] : []
        if (iso) {
          const d = toDayjs(val, fmt)
          if (d) this.timeValue = { hour: d.hour(), minute: d.minute(), second: d.second() }
        }
      } else {
        const arr = Array.isArray(val) ? val : []
        this.selection = arr.map(v => toISO(v, fmt)).filter(Boolean)
      }
      this.syncView()
    },
    syncView() {
      const anchor = this.selection[0] || null
      this.viewISO = (anchor ? dayjs(anchor, ISO) : dayjs()).format(ISO)
    },
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
      const out =
        this.mode === 'single'
          ? this.selection.length
            ? this.buildOut(this.selection[0])
            : null
          : this.selection.map(iso => this.buildOut(iso))
      this.$emit('change', out)
      this.$emit('update:modelValue', out)
    },
    formatDisplay(iso) {
      let d = dayjs(iso, ISO)
      if (this.showTime) d = d.hour(this.timeValue.hour).minute(this.timeValue.minute).second(this.timeValue.second)
      if (this.locale) d = d.locale(this.locale)
      return d.format(this.resolvedFormat)
    },
    onSelectDate(iso) {
      if (!iso) return
      if (this.mode === 'single') {
        this.selection = [iso]
        this.emitValue()
        this.isOpen = false
      } else {
        const idx = this.selection.indexOf(iso)
        let next = idx === -1 ? this.selection.concat([iso]) : this.selection.filter(x => x !== iso)
        if (this.maxCount > 0 && next.length > this.maxCount) next = next.slice(next.length - this.maxCount)
        this.selection = next
        this.emitValue()
      }
    },
    onHover(iso) {
      this.hoverISO = iso
    },
    onTimeChange(t) {
      this.timeValue = t
    },
    onClear() {
      this.selection = []
      this.emitValue()
      this.$emit('clear')
    },
    shiftMonth(delta) {
      this.viewISO = dayjs(this.viewISO, ISO).add(delta, 'month').format(ISO)
    },
    shiftYear(delta) {
      this.viewISO = dayjs(this.viewISO, ISO).add(delta, 'year').format(ISO)
    },
    onSetView({ year, month }) {
      let d = dayjs(this.viewISO, ISO)
      if (year != null) d = d.year(year)
      if (month != null) d = d.month(month)
      this.viewISO = d.date(1).format(ISO)
    },
    onTriggerClick() {
      if (this.disabled) return
      this.isOpen ? (this.isOpen = false) : (this.isOpen = true)
    },
    onTriggerKeydown(e) {
      if (this.disabled) return
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        this.isOpen = true
      } else if (e.key === 'Escape') {
        this.isOpen = false
      }
    },
    onGridKeydown(e) {
      const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
      let base = this.focusISO || this.selection[0] || dayjs().format(ISO)
      let d = dayjs(base, ISO)
      let handled = true
      if (map[e.key] !== undefined) {
        d = d.add(map[e.key], 'day')
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
    },
    onMenuChange(v) {
      this.isOpen = v
    },
    onMenuOpen() {
      this.syncView()
      this.focusISO = this.selection[0] || dayjs().format(ISO)
      this.$emit('open')
    },
    onMenuClose() {
      this.$emit('close')
    },
    focus() {
      const el = this.$el && this.$el.querySelector('.ui-dp-trigger')
      if (el) el.focus()
    },
    blur() {
      const el = this.$el && this.$el.querySelector('.ui-dp-trigger')
      if (el) el.blur()
    },
    onSelectPreset(value) {
      if (Array.isArray(value)) return
      const d = dayjs.isDayjs(value) ? value : dayjs(value)
      if (d.isValid()) this.onSelectDate(d.format(ISO))
    },
    onConfirm() {
      this.isOpen = false
    },
    open() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false
    }
  }
}
</script>

<style src="./date-picker.css" scoped></style>
