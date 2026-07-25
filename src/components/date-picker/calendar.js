// Pure calendar math for the date-picker — no Vue, no component state.
//
// Everything here operates on plain values (ISO 'YYYY-MM-DD' strings, Day.js
// instances, plain option objects) so it can be unit-tested in isolation and
// reused by the week/month/quarter/year panels in Phase 2. The picker stores
// its selection as ISO strings internally (stable identity, no deep-reactive
// Day.js objects in `data`) and only converts to Date/formatted output at the
// component boundary.
import dayjs from 'dayjs'
import * as _customParseFormat from 'dayjs/plugin/customParseFormat'
import * as _localeData from 'dayjs/plugin/localeData'

dayjs.extend(_customParseFormat.default || _customParseFormat)
dayjs.extend(_localeData.default || _localeData)

export const ISO = 'YYYY-MM-DD'

// Normalize any accepted value (Date | ISO/formatted string | Day.js | number)
// into a Day.js instance, or null when empty/invalid. `format` is consulted for
// string parsing so a custom `format` prop round-trips.
export function toDayjs(value, format) {
  if (value == null || value === '') return null
  if (dayjs.isDayjs(value)) return value.isValid() ? value : null
  if (value instanceof Date) {
    const d = dayjs(value)
    return d.isValid() ? d : null
  }
  if (typeof value === 'number') {
    const d = dayjs(value)
    return d.isValid() ? d : null
  }
  // string: try the explicit format first, then ISO, then loose parse.
  if (typeof value === 'string') {
    if (format) {
      const byFmt = dayjs(value, format)
      if (byFmt.isValid()) return byFmt
    }
    const byIso = dayjs(value, ISO)
    if (byIso.isValid()) return byIso
    const loose = dayjs(value)
    return loose.isValid() ? loose : null
  }
  return null
}

// Day.js → canonical ISO date key (drops time; the day grid keys on this).
export function toISO(value, format) {
  const d = toDayjs(value, format)
  return d ? d.format(ISO) : null
}

// Is `d` (Day.js) outside the allowed window / vetoed by disabledDate(Date)?
export function isDateDisabled(d, opts) {
  if (!d) return true
  const o = opts || {}
  if (o.minDate && d.isBefore(o.minDate, 'day')) return true
  if (o.maxDate && d.isAfter(o.maxDate, 'day')) return true
  if (typeof o.disabledDate === 'function' && o.disabledDate(d.toDate())) return true
  return false
}

// Locale-aware weekday header labels, rotated to `weekStart` (0 = Sunday).
// Uses Day.js localeData min-weekday names ('Su','Mo',...).
export function weekdayLabels(weekStart, locale) {
  const base = (locale ? dayjs().locale(locale) : dayjs()).localeData().weekdaysMin()
  const out = []
  for (let i = 0; i < 7; i++) out.push(base[(i + weekStart) % 7])
  return out
}

// Build the 6×7 (42-cell) day grid for the month containing `viewDate`.
// `weekStart` rotates the leading offset. Cells outside the view month are
// flagged `outside` (rendered muted) but remain selectable unless disabled.
export function buildDayMatrix(viewDate, weekStart, opts) {
  const ws = weekStart || 0
  const first = viewDate.startOf('month')
  const offset = (first.day() - ws + 7) % 7
  const start = first.subtract(offset, 'day')
  const today = dayjs()
  const month = viewDate.month()
  const cells = []
  for (let i = 0; i < 35; i++) {
    const d = start.add(i, 'day')
    const dow = d.day()
    cells.push({
      iso: d.format(ISO),
      day: d.date(),
      outside: d.month() !== month,
      today: d.isSame(today, 'day'),
      weekend: dow === 0 || dow === 6,
      disabled: isDateDisabled(d, opts)
    })
  }
  return cells
}

// Order two ISO keys ascending, tolerating either being null.
export function orderISO(a, b) {
  if (a == null) return { start: b, end: b }
  if (b == null) return { start: a, end: a }
  return a <= b ? { start: a, end: b } : { start: b, end: a }
}

// Position of a cell within an active range [start,end] (both ISO), used to pick
// the connected-band radius: 'single' | 'left' | 'middle' | 'right' | null.
export function rangePosition(iso, start, end) {
  if (!start && !end) return null
  const s = start
  const e = end || start
  if (s === e) return iso === s ? 'single' : null
  if (iso === s) return 'left'
  if (iso === e) return 'right'
  if (iso > s && iso < e) return 'middle'
  return null
}

// True when `iso` sits strictly inside (start,end) — the range fill band.
export function isWithinRange(iso, start, end) {
  if (!start || !end || start === end) return false
  return iso > start && iso < end
}
