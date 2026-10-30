<template>
  <div class="ui-dp-picker-panel-wrapper">
    <PickerPresets v-if="hasPresets" />
    <div class="ui-dp-picker-content">
      <div class="ui-dp-picker-panel">
        <div class="ui-dp-picker-panel__main">
          <!-- Date panel: one header spans all views, one body per view -->
          <template v-if="panelMode === 'date'">
            <DateHeader
              :views="views"
              :can-prev="canPrev"
              :can-next="canNext"
              :can-prev-year="canPrevYear"
              :can-next-year="canNextYear"
              :show-year-jump="showYearJump"
              @prev="$emit('prev')"
              @next="$emit('next')"
              @prev-year="$emit('prev-year')"
              @next-year="$emit('next-year')"
              @click-month="panelMode = 'month'"
              @click-year="panelMode = 'year'"
            />
            <div class="ui-dp-picker-panel__bodies">
              <DateBody v-for="(view, i) in views" :key="i" :matrix="view.matrix">
                <template #default="slotProps">
                  <slot name="cell" v-bind="slotProps" />
                </template>
              </DateBody>
            </div>
          </template>

          <!-- Month panel: 3×4 grid -->
          <template v-else-if="panelMode === 'month'">
            <MonthHeader
              :year="localYear"
              :can-prev="canPrevYear"
              :can-next="canNextYear"
              @prev="shiftYear(-1)"
              @next="shiftYear(1)"
              @click-year="panelMode = 'year'"
            />
            <MonthBody :months="monthCells" @select="onSelectMonth" />
          </template>

          <!-- Year panel: 3×4 grid -->
          <template v-else-if="panelMode === 'year'">
            <YearHeader
              :decade-start="localDecadeStart"
              :decade-end="localDecadeStart + 11"
              :can-prev="true"
              :can-next="true"
              @prev="shiftDecade(-1)"
              @next="shiftDecade(1)"
            />
            <YearBody :years="yearCells" @select="onSelectYear" />
          </template>
        </div>

        <div v-if="showTime && panelMode === 'date'" class="ui-dp-picker-panel__time">
          <TimePanel />
        </div>
      </div>
      <PickerFooter v-if="hasFooter" />
    </div>
  </div>
</template>

<script>
import DateHeader from './DatePanel/DateHeader.vue'
import DateBody from './DatePanel/DateBody.vue'
import MonthHeader from './MonthPanel/MonthHeader.vue'
import MonthBody from './MonthPanel/MonthBody.vue'
import YearHeader from './YearPanel/YearHeader.vue'
import YearBody from './YearPanel/YearBody.vue'
import TimePanel from './TimePanel/TimePanel.vue'
import PickerPresets from './PickerPresets.vue'
import PickerFooter from './PickerFooter.vue'
import { DATE_PICKER_CTX } from '../context.js'
import { buildMonthList, buildYearList, decadeStart } from '../generate/dayjs.js'

export default {
  name: 'PickerPanel',
  components: {
    DateHeader,
    DateBody,
    MonthHeader,
    MonthBody,
    YearHeader,
    YearBody,
    TimePanel,
    PickerPresets,
    PickerFooter
  },
  inject: { ctx: { from: DATE_PICKER_CTX, default: null } },
  props: {
    views: { type: Array, default: () => [] }, // [{ matrix, monthLabel, month, year }]
    canPrev: { type: Boolean, default: true },
    canNext: { type: Boolean, default: true },
    canPrevYear: { type: Boolean, default: true },
    canNextYear: { type: Boolean, default: true }
  },
  emits: ['prev', 'next', 'prev-year', 'next-year', 'set-view'],
  data() {
    const picker = this.ctx ? this.ctx.picker : 'date'
    const firstView = this.views && this.views[0]
    const year = firstView ? firstView.year : new Date().getFullYear()
    return {
      panelMode: picker === 'month' ? 'month' : picker === 'year' ? 'year' : 'date',
      localYear: year,
      localDecadeStart: decadeStart(year)
    }
  },
  computed: {
    picker() {
      return this.ctx ? this.ctx.picker : 'date'
    },
    locale() {
      return this.ctx ? this.ctx.locale : 'en'
    },
    disableOpts() {
      return this.ctx ? this.ctx.disableOpts : {}
    },
    selected() {
      return this.ctx ? this.ctx.selected : []
    },
    showYearJump() {
      return this.ctx ? this.ctx.showYearJump : true
    },
    showTime() {
      return this.ctx ? this.ctx.showTime : false
    },
    hasPresets() {
      return this.ctx ? this.ctx.presets.length > 0 : false
    },
    hasFooter() {
      return this.ctx ? this.ctx.showFooter : false
    },
    ctxSize() {
      return this.ctx ? this.ctx.size : 'md'
    },
    monthCells() {
      return buildMonthList(this.localYear, this.locale, this.disableOpts).map((m, i) => ({
        ...m,
        selected:
          this.picker === 'month' &&
          this.selected.includes(String(this.localYear) + '-' + String(i + 1).padStart(2, '0') + '-01'),
        current: i === new Date().getMonth() && this.localYear === new Date().getFullYear()
      }))
    },
    yearCells() {
      return buildYearList(this.localDecadeStart, this.disableOpts).map(y => ({
        ...y,
        selected: this.picker === 'year' && this.selected.some(s => s.startsWith(String(y.value))),
        current: y.value === new Date().getFullYear()
      }))
    }
  },
  watch: {
    views(v) {
      if (v && v[0]) this.localYear = v[0].year
    },
    picker(v) {
      this.panelMode = v === 'month' ? 'month' : v === 'year' ? 'year' : 'date'
    }
  },
  methods: {
    shiftYear(delta) {
      this.localYear += delta
    },
    shiftDecade(delta) {
      this.localDecadeStart += delta * 12
    },
    onSelectMonth(month) {
      if (this.picker === 'month') {
        if (this.ctx) this.ctx.selectDate(String(this.localYear) + '-' + String(month + 1).padStart(2, '0') + '-01')
      } else {
        this.$emit('set-view', { year: this.localYear, month })
        this.panelMode = 'date'
      }
    },
    onSelectYear(year) {
      this.localYear = year
      this.localDecadeStart = decadeStart(year)
      if (this.picker === 'year') {
        if (this.ctx) this.ctx.selectDate(String(year) + '-01-01')
      } else {
        this.panelMode = 'month'
      }
    }
  }
}
</script>

<style src="./picker-panel.css" scoped></style>
