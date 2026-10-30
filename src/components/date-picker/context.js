// Provide/inject key for the date-picker context. A string key works in both
// Vue 2.7 and Vue 3 Options API.
export const DATE_PICKER_CTX = 'wkDatePickerCtxV2'

/**
 * Build the provide/inject context bound to a picker host (DatePicker | RangePicker).
 *
 * Reactivity: every field is a getter that reads the host's live reactive state.
 * When a child reads `ctx.selected` (etc.) inside its own render/computed, the
 * access reaches the host's reactive property and registers the child as a
 * dependency — so it stays reactive in BOTH Vue 2.7 and Vue 3 without the context
 * object itself needing to be reactive. Actions delegate to host methods (guarded
 * so a host that doesn't implement one — e.g. RangePicker has no time panel — is a
 * no-op rather than a crash).
 *
 * This carries only the state that is IDENTICAL across every panel/side:
 * selection, config, and the selection actions. Per-panel view data (the day
 * matrix, month label, prev/next availability) differs between the left/right
 * range panels, so it stays as props on PickerPanel.
 *
 * @param {object} host DatePicker or RangePicker component instance (`this`).
 */
export function createDatePickerContext(host) {
  return {
    // --- config (same for all panels) ---
    get picker() {
      return host.picker
    },
    get locale() {
      return host.locale
    },
    get weekStart() {
      return host.weekStart
    },
    get weekdays() {
      return host.weekdays
    },
    get disableOpts() {
      return host.disableOpts
    },
    get showYearJump() {
      return host.showYearJump
    },
    get showTime() {
      return !!host.showTime
    },
    get showSeconds() {
      return !!host.showSeconds
    },
    get hourStep() {
      return host.hourStep || 1
    },
    get minuteStep() {
      return host.minuteStep || 1
    },
    get secondStep() {
      return host.secondStep || 1
    },
    get disabledTime() {
      return host.disabledTime || null
    },
    get timeValue() {
      return host.timeValue || { hour: 0, minute: 0, second: 0 }
    },

    // --- selection state ---
    // selected: ISO[] for single/multiple. range uses rangeStart/rangeEnd.
    get selected() {
      return host.ctxSelected || []
    },
    get rangeStart() {
      return host.ctxRangeStart || null
    },
    get rangeEnd() {
      return host.ctxRangeEnd || null
    },
    get focusISO() {
      return host.focusISO || null
    },

    // --- range / format helpers ---
    get isRange() {
      return 'rangeStartSel' in host
    },
    get format() {
      return host.resolvedFormat || 'YYYY-MM-DD'
    },
    get cancelText() {
      return host.cancelText || 'Cancel'
    },
    get confirmText() {
      return host.confirmText || 'Apply'
    },
    get presets() {
      return host.presets || []
    },
    get showFooter() {
      return !!host.showFooter
    },
    get size() {
      return host.size || 'md'
    },

    // --- actions ---
    selectDate(iso) {
      if (host.onSelectDate) host.onSelectDate(iso)
    },
    hover(iso) {
      if (host.onHover) host.onHover(iso)
    },
    changeTime(t) {
      if (host.onTimeChange) host.onTimeChange(t)
    },
    gridKeydown(e) {
      if (host.onGridKeydown) host.onGridKeydown(e)
    },
    selectPreset(value) {
      if (host.onSelectPreset) host.onSelectPreset(value)
    },
    cancel() {
      if (host.close) host.close()
    },
    confirm() {
      if (host.onConfirm) host.onConfirm()
    }
  }
}
