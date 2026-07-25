import dayjs from 'dayjs'
import * as _customParseFormat from 'dayjs/plugin/customParseFormat'
import * as _localeData from 'dayjs/plugin/localeData'
import * as _weekday from 'dayjs/plugin/weekday'
import * as _weekOfYear from 'dayjs/plugin/weekOfYear'
import * as _isoWeek from 'dayjs/plugin/isoWeek'
import * as _advancedFormat from 'dayjs/plugin/advancedFormat'
import * as _isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import * as _isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import * as _quarterOfYear from 'dayjs/plugin/quarterOfYear'

function resolvePlugin(mod, globalName) {
  if (typeof mod === 'function') return mod
  if (mod && typeof mod.default === 'function') return mod.default
  return (typeof globalThis !== 'undefined' && globalThis[globalName]) || mod
}

dayjs.extend(resolvePlugin(_customParseFormat, 'dayjs_plugin_customParseFormat'))
dayjs.extend(resolvePlugin(_localeData, 'dayjs_plugin_localeData'))
dayjs.extend(resolvePlugin(_weekday, 'dayjs_plugin_weekday'))
dayjs.extend(resolvePlugin(_weekOfYear, 'dayjs_plugin_weekOfYear'))
dayjs.extend(resolvePlugin(_isoWeek, 'dayjs_plugin_isoWeek'))
dayjs.extend(resolvePlugin(_advancedFormat, 'dayjs_plugin_advancedFormat'))
dayjs.extend(resolvePlugin(_isSameOrBefore, 'dayjs_plugin_isSameOrBefore'))
dayjs.extend(resolvePlugin(_isSameOrAfter, 'dayjs_plugin_isSameOrAfter'))
dayjs.extend(resolvePlugin(_quarterOfYear, 'dayjs_plugin_quarterOfYear'))

export default dayjs
