// Configured Day.js singleton for the date-picker.
//
// Day.js ships as a tiny core; every feature the picker needs (custom format
// parsing, locale-aware week start, week/quarter numbers, inclusive comparisons)
// lives in an opt-in plugin. We register them ONCE here and re-export the same
// instance so every date-picker file shares one configured dayjs — importing
// `dayjs` directly elsewhere would get the unconfigured core.
//
// `dayjs.extend` is idempotent (re-extending with the same plugin is a no-op),
// so this module is safe to import from multiple files under both the Vite
// (Vue 3) and webpack (Vue 2) bundlers.
import dayjs from 'dayjs'

import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'

dayjs.extend(customParseFormat)
dayjs.extend(localeData)
dayjs.extend(weekday)
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)
dayjs.extend(advancedFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(quarterOfYear)

export default dayjs
