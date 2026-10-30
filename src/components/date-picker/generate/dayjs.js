import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import 'dayjs/locale/vi'

dayjs.extend(localeData)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(weekOfYear)

export const ISO = 'YYYY-MM-DD'

/** Parse any date input into a dayjs object. Returns null if invalid. */
export function toDayjs(val, fmt) {
  if (!val) return null
  if (val instanceof Date) return dayjs(val)
  if (typeof val === 'number') return dayjs(val)
  if (fmt) {
    const d = dayjs(val, fmt)
    return d.isValid() ? d : null
  }
  const d = dayjs(val)
  return d.isValid() ? d : null
}

/** Convert any date input to an ISO string (YYYY-MM-DD). Returns null if invalid. */
export function toISO(val, fmt) {
  const d = toDayjs(val, fmt)
  return d ? d.format(ISO) : null
}

/** Check if a dayjs date is disabled by min/max/disabledDate options. */
export function isDateDisabled(d, { minDate, maxDate, disabledDate } = {}) {
  if (minDate && d.isBefore(minDate, 'day')) return true
  if (maxDate && d.isAfter(maxDate, 'day')) return true
  if (disabledDate && disabledDate(d.toDate())) return true
  return false
}

/** Build ordered weekday header labels starting at weekStart. */
export function weekdayLabels(weekStart = 0, locale = 'en') {
  const base = locale ? dayjs().locale(locale) : dayjs()
  const shorts = base.localeData().weekdaysShort()
  const out = []
  for (let i = 0; i < 7; i++) out.push(shorts[(weekStart + i) % 7])
  return out
}

/**
 * Build a 6×7 matrix of day cells for a given month view.
 * Each cell: { iso, day, inMonth, disabled, today }
 */
export function buildDayMatrix(viewDayjs, weekStart = 0, disableOpts = {}) {
  const firstOfMonth = viewDayjs.startOf('month')
  const offset = (firstOfMonth.day() - weekStart + 7) % 7
  const start = firstOfMonth.subtract(offset, 'day')
  const today = dayjs().format(ISO)
  const month = viewDayjs.month()
  const rows = []
  let cur = start
  for (let r = 0; r < 5; r++) {
    const row = []
    for (let c = 0; c < 7; c++) {
      const iso = cur.format(ISO)
      row.push({
        iso,
        day: cur.date(),
        inMonth: cur.month() === month,
        disabled: isDateDisabled(cur, disableOpts),
        today: iso === today
      })
      cur = cur.add(1, 'day')
    }
    rows.push(row)
  }
  return rows
}

/** Build a list of 12 month cells for a given year. */
export function buildMonthList(year, locale = 'en', disableOpts = {}) {
  const names = (locale ? dayjs().locale(locale) : dayjs()).localeData().monthsShort()
  return names.map((label, i) => {
    const d = dayjs().year(year).month(i).startOf('month')
    return {
      label,
      value: i,
      disabled: isDateDisabled(d, disableOpts)
    }
  })
}

/** Build a list of 12 year cells for a decade starting at decadeStart. */
export function buildYearList(decadeStart, disableOpts = {}) {
  const out = []
  for (let y = decadeStart; y < decadeStart + 12; y++) {
    const d = dayjs().year(y).startOf('year')
    out.push({ label: String(y), value: y, disabled: isDateDisabled(d, disableOpts) })
  }
  return out
}

/** Return decade start (e.g. 2020 for any year 2020-2029). */
export function decadeStart(year) {
  return Math.floor(year / 10) * 10
}

/** Sort two ISO strings and return { start, end }. */
export function orderISO(a, b) {
  if (!a && !b) return { start: null, end: null }
  if (!a) return { start: b, end: b }
  if (!b) return { start: a, end: a }
  return a <= b ? { start: a, end: b } : { start: b, end: a }
}

export default dayjs
