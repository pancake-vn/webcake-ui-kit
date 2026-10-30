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
      <div
        :ref="triggerRef"
        v-bind="attrs"
        :class="[
          'ui-dp-range-trigger',
          `ui-dp-range-trigger--${size}`,
          disabled && 'is-disabled',
          isOpen && 'is-focus'
        ]"
        :tabindex="disabled ? -1 : 0"
        role="combobox"
        :aria-expanded="isOpen ? 'true' : 'false'"
        @click="onTriggerClick"
        @keydown="onTriggerKeydown"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      >
        <span class="ui-dp-range-trigger__icon"><WkiCalendar :size="16" /></span>

        <span class="ui-dp-range-trigger__start" :class="{ 'is-placeholder': !rangeStartSel }">
          {{ rangeStartSel ? formatDisplay(rangeStartSel) : startPlaceholder }}
        </span>
        <span class="ui-dp-range-trigger__separator"> – </span>
        <span class="ui-dp-range-trigger__end" :class="{ 'is-placeholder': !rangeEndSel }">
          {{ rangeEndSel ? formatDisplay(rangeEndSel) : endPlaceholder }}
        </span>

        <span
          v-if="clearable && hasValue && !disabled"
          role="button"
          tabindex="0"
          class="ui-dp-range-trigger__clear"
          aria-label="Clear"
          @click.stop="onClear"
          @keydown.enter.stop.prevent="onClear"
          @keydown.space.stop.prevent="onClear"
        >
          <WkiX :size="14" />
        </span>
      </div>
    </template>

    <PickerPanel
      :views="[leftView, rightView]"
      :can-prev="canPrev"
      :can-next="canNext"
      :can-prev-year="canPrevYear"
      :can-next-year="canNextYear"
      @prev="shiftMonth(-1)"
      @next="shiftMonth(1)"
      @prev-year="shiftYear(-1)"
      @next-year="shiftYear(1)"
      @set-view="onSetView"
    />
  </Menu>
</template>

<script>
import Menu from '../menu/Menu.vue'
import PickerPanel from './panels/PickerPanel.vue'
import { WkiCalendar, WkiX } from '../../icons'
import { DATE_PICKER_CTX, createDatePickerContext } from './context.js'
import dayjs, { ISO, toDayjs, toISO, weekdayLabels, buildDayMatrix, orderISO } from './generate/dayjs.js'

export default {
  name: 'RangePicker',
  components: { Menu, PickerPanel, WkiCalendar, WkiX },
  model: { prop: 'value', event: 'change' },
  provide() {
    return { [DATE_PICKER_CTX]: createDatePickerContext(this) }
  },
  props: {
    value: { type: Array, default: undefined },
    modelValue: { type: Array, default: undefined },
    picker: {
      type: String,
      default: 'date',
      validator: v => ['date', 'month', 'year'].includes(v)
    },
    format: { type: String, default: null },
    valueFormat: { type: String, default: null },
    placeholder: { type: Array, default: null },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    minDate: { type: [Date, String, Number], default: null },
    maxDate: { type: [Date, String, Number], default: null },
    disabledDate: { type: Function, default: null },
    locale: { type: String, default: 'en' },
    weekStart: { type: Number, default: 0 },
    showYearJump: { type: Boolean, default: true },
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
  emits: ['change', 'update:modelValue', 'open', 'close', 'clear', 'calendar-change', 'focus', 'blur'],
  data() {
    return {
      isOpen: false,
      rangeStartSel: null,
      rangeEndSel: null,
      rangePicking: false,
      viewISO: dayjs().format(ISO),
      hoverISO: null,
      focusISO: null
    }
  },
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value
    },
    resolvedFormat() {
      return this.format || 'YYYY-MM-DD'
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
    leftView() {
      const v = dayjs(this.viewISO, ISO)
      return {
        matrix: buildDayMatrix(v, this.weekStart, this.disableOpts),
        monthLabel: (this.locale ? v.locale(this.locale) : v).format('MMMM'),
        yearLabel: (this.locale ? v.locale(this.locale) : v).format('YYYY'),
        month: v.month(),
        year: v.year()
      }
    },
    rightView() {
      const v = dayjs(this.viewISO, ISO).add(1, 'month')
      return {
        matrix: buildDayMatrix(v, this.weekStart, this.disableOpts),
        monthLabel: (this.locale ? v.locale(this.locale) : v).format('MMMM'),
        yearLabel: (this.locale ? v.locale(this.locale) : v).format('YYYY'),
        month: v.month(),
        year: v.year()
      }
    },
    resolvedRange() {
      if (this.rangePicking && this.rangeStartSel) {
        return orderISO(this.rangeStartSel, this.hoverISO || this.rangeStartSel)
      }
      if (this.rangeStartSel || this.rangeEndSel) {
        return orderISO(this.rangeStartSel, this.rangeEndSel)
      }
      return { start: null, end: null }
    },
    ctxSelected() {
      return []
    },
    ctxRangeStart() {
      return this.resolvedRange.start
    },
    ctxRangeEnd() {
      return this.resolvedRange.end
    },
    hasValue() {
      return !!(this.rangeStartSel || this.rangeEndSel)
    },
    startPlaceholder() {
      return (this.placeholder && this.placeholder[0]) || 'Start date'
    },
    endPlaceholder() {
      return (this.placeholder && this.placeholder[1]) || 'End date'
    },
    canPrev() {
      if (!this.min) return true
      return dayjs(this.viewISO, ISO).subtract(1, 'month').endOf('month').isSameOrAfter(this.min, 'day')
    },
    canNext() {
      if (!this.max) return true
      return dayjs(this.viewISO, ISO).add(2, 'month').startOf('month').isSameOrBefore(this.max, 'day')
    },
    canPrevYear() {
      return true
    },
    canNextYear() {
      return true
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
      const arr = Array.isArray(this.currentValue) ? this.currentValue : []
      this.rangeStartSel = toISO(arr[0], this.resolvedFormat)
      this.rangeEndSel = toISO(arr[1], this.resolvedFormat)
      this.rangePicking = false
      const anchor = this.rangeStartSel || this.rangeEndSel
      this.viewISO = (anchor ? dayjs(anchor, ISO) : dayjs()).format(ISO)
    },
    buildOut(iso) {
      if (!iso) return null
      const d = dayjs(iso, ISO)
      return this.valueFormat ? d.format(this.valueFormat) : d.toDate()
    },
    emitValue() {
      const out = [
        this.rangeStartSel ? this.buildOut(this.rangeStartSel) : null,
        this.rangeEndSel ? this.buildOut(this.rangeEndSel) : null
      ]
      this.$emit('change', out)
      this.$emit('update:modelValue', out)
    },
    formatDisplay(iso) {
      let d = dayjs(iso, ISO)
      if (this.locale) d = d.locale(this.locale)
      return d.format(this.resolvedFormat)
    },
    onSelectDate(iso) {
      if (!iso) return
      if (!this.rangePicking) {
        this.rangeStartSel = iso
        this.rangeEndSel = null
        this.rangePicking = true
        this.hoverISO = iso
        this.$emit('calendar-change', [this.buildOut(iso), null])
      } else {
        const ordered = orderISO(this.rangeStartSel, iso)
        this.rangeStartSel = ordered.start
        this.rangeEndSel = ordered.end
        this.rangePicking = false
        this.hoverISO = null
        this.$emit('calendar-change', [this.buildOut(ordered.start), this.buildOut(ordered.end)])
        this.emitValue()
        this.isOpen = false
      }
    },
    onHover(iso) {
      if (this.rangePicking) this.hoverISO = iso
    },
    onClear() {
      this.rangeStartSel = null
      this.rangeEndSel = null
      this.rangePicking = false
      this.hoverISO = null
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
      this.isOpen = !this.isOpen
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
    onMenuChange(v) {
      this.isOpen = v
    },
    onMenuOpen() {
      const anchor = this.rangeStartSel || this.rangeEndSel
      this.viewISO = (anchor ? dayjs(anchor, ISO) : dayjs()).format(ISO)
      this.focusISO = this.rangeStartSel || dayjs().format(ISO)
      this.$emit('open')
    },
    onMenuClose() {
      if (this.rangePicking) {
        this.rangePicking = false
        this.hoverISO = null
        this.syncFromValue()
      }
      this.$emit('close')
    },
    onSelectPreset(value) {
      if (!Array.isArray(value)) return
      const start = (dayjs.isDayjs(value[0]) ? value[0] : dayjs(value[0])).format(ISO)
      const end = (dayjs.isDayjs(value[1]) ? value[1] : dayjs(value[1])).format(ISO)
      const ordered = orderISO(start, end)
      this.rangeStartSel = ordered.start
      this.rangeEndSel = ordered.end
      this.rangePicking = false
      this.hoverISO = null
      this.emitValue()
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

<style src="./range-picker.css" scoped></style>
