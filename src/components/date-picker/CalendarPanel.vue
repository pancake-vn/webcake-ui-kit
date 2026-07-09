<template>
  <div class="ui-cal-panel" :class="{ 'ui-cal-panel--with-time': showTime }">
    <div class="ui-cal-panel__main">
      <slot name="header">
        <PanelHeader
          :panels="panels"
          :month-options="monthOptions"
          :year-options="yearOptions"
          :show-select-month="showSelectMonth"
          :show-select-year="showSelectYear"
          :can-prev="canPrev"
          :can-next="canNext"
          :show-year-jump="showYearJump"
          @prev="$emit('prev')"
          @next="$emit('next')"
          @prev-year="$emit('prev-year')"
          @next-year="$emit('next-year')"
          @set-month="p => $emit('set-month', p)"
          @set-year="p => $emit('set-year', p)"
          @label-click="p => $emit('label-click', p)"
        />
      </slot>

      <div class="ui-cal-panel__body">
        <div class="ui-cal-panel__months" @keydown="$emit('grid-keydown', $event)">
          <CalendarView
            v-for="(view, i) in views"
            :key="i"
            class="ui-cal-panel__month"
            :matrix="view.matrix"
            :weekdays="weekdays"
            :mode="mode"
            :selected="selected"
            :range-start="rangeStart"
            :range-end="rangeEnd"
            :focus-iso="focusIso"
            :clip-outside="views.length > 1"
            @select="iso => $emit('select', iso)"
            @hover="iso => $emit('hover', iso)"
          >
            <!-- Always forward; the fallback renders the day number when the
                 consumer hasn't supplied a custom #cell slot (dual-compat: no
                 $scopedSlots sniffing needed). -->
            <template #cell="slotProps">
              <slot name="cell" v-bind="slotProps">{{ slotProps.cell.day }}</slot>
            </template>
          </CalendarView>
        </div>

        <div v-if="showTime" class="ui-cal-panel__time">
          <slot name="time">
            <TimePanel
              :value="timeValue"
              :show-seconds="showSeconds"
              :hour-step="hourStep"
              :minute-step="minuteStep"
              :second-step="secondStep"
              :disabled-time="disabledTime"
              @change="t => $emit('time-change', t)"
            />
          </slot>
        </div>
      </div>
    </div>

    <slot name="footer">
      <PanelFooter
        v-if="showFooter"
        :show-today="showToday"
        :show-clear="showClear"
        :show-confirm="showConfirm"
        :today-disabled="todayDisabled"
        :confirm-disabled="confirmDisabled"
        :today-text="todayText"
        :clear-text="clearText"
        :confirm-text="confirmText"
        @today="$emit('today')"
        @clear="$emit('clear')"
        @confirm="$emit('confirm')"
      />
    </slot>
  </div>
</template>

<script>
import CalendarView from './CalendarView.vue'
import PanelHeader from './PanelHeader.vue'
import PanelFooter from './PanelFooter.vue'
import TimePanel from './TimePanel.vue'

export default {
  name: 'CalendarPanel',
  components: { CalendarView, PanelHeader, PanelFooter, TimePanel },
  props: {
    // [{ matrix, monthLabel, month, year }] — one per visible month.
    views: { type: Array, default: () => [] },
    // Localized month names + selectable years for the header dropdowns.
    monthOptions: { type: Array, default: () => [] },
    yearOptions: { type: Array, default: () => [] },
    showSelectMonth: { type: Boolean, default: false },
    showSelectYear: { type: Boolean, default: false },
    weekdays: { type: Array, default: () => [] },
    mode: { type: String, default: 'single' },
    selected: { type: Array, default: () => [] },
    rangeStart: { type: String, default: null },
    rangeEnd: { type: String, default: null },
    focusIso: { type: String, default: null },
    canPrev: { type: Boolean, default: true },
    canNext: { type: Boolean, default: true },
    showYearJump: { type: Boolean, default: false },
    // Time
    showTime: { type: Boolean, default: false },
    timeValue: { type: Object, default: () => ({ hour: 0, minute: 0, second: 0 }) },
    showSeconds: { type: Boolean, default: false },
    hourStep: { type: Number, default: 1 },
    minuteStep: { type: Number, default: 1 },
    secondStep: { type: Number, default: 1 },
    disabledTime: { type: Function, default: null },
    // Footer
    showFooter: { type: Boolean, default: true },
    showToday: { type: Boolean, default: true },
    showClear: { type: Boolean, default: true },
    showConfirm: { type: Boolean, default: false },
    todayDisabled: { type: Boolean, default: false },
    confirmDisabled: { type: Boolean, default: false },
    todayText: { type: String, default: 'Today' },
    clearText: { type: String, default: 'Clear' },
    confirmText: { type: String, default: 'OK' }
  },
  emits: [
    'prev',
    'next',
    'prev-year',
    'next-year',
    'set-month',
    'set-year',
    'label-click',
    'select',
    'hover',
    'grid-keydown',
    'time-change',
    'today',
    'clear',
    'confirm'
  ],
  computed: {
    panels() {
      return this.views.map(v => ({ month: v.month, year: v.year }))
    }
  }
}
</script>

<style src="./calendar-panel.css" scoped></style>
