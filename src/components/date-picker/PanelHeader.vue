<template>
  <div class="ui-cal-header">
    <div class="ui-cal-header__nav ui-cal-header__nav--prev">
      <WkButton v-if="showYearJump" variant="ghost" size="xs" aria-label="Previous year" @click="$emit('prev-year')">
        <template #icon><WkiChevronsLeft :size="16" /></template>
      </WkButton>
      <WkButton variant="ghost" size="xs" :disabled="!canPrev" aria-label="Previous month" @click="$emit('prev')">
        <template #icon><WkiChevronLeft :size="16" /></template>
      </WkButton>
    </div>

    <div class="ui-cal-header__labels">
      <div v-for="(panel, i) in panels" :key="i" class="ui-cal-header__group">
        <!-- Month: WkSelect when opted-in, otherwise the clickable text label. -->
        <span v-if="showSelectMonth" class="ui-cal-header__select ui-cal-header__select--month">
          <WkSelect
            size="xs"
            :value="String(panel.month)"
            :options="monthOptions"
            :dropdown-match-select-width="false"
            @change="m => $emit('set-month', { index: i, month: Number(m) })"
          />
        </span>
        <button
          v-else
          type="button"
          :class="[
            'ui-cal-header__label',
            showSelectYear && !showSelectMonth && 'ui-cal-header__label_month_not_select'
          ]"
          @click="$emit('label-click', { index: i, part: 'month' })"
        >
          {{ monthName(panel.month) }}
        </button>

        <!-- Year: WkSelect when opted-in, otherwise the clickable text label. -->
        <span v-if="showSelectYear" class="ui-cal-header__select ui-cal-header__select--year">
          <WkSelect
            size="xs"
            :value="String(panel.year)"
            :options="yearOptions"
            @change="y => $emit('set-year', { index: i, year: Number(y) })"
          />
        </span>
        <button
          v-else
          type="button"
          :class="[
            'ui-cal-header__label',
            !showSelectYear && showSelectMonth && 'ui-cal-header__label_year_not_select'
          ]"
          @click="$emit('label-click', { index: i, part: 'year' })"
        >
          {{ panel.year }}
        </button>
      </div>
    </div>

    <div class="ui-cal-header__nav ui-cal-header__nav--next">
      <WkButton variant="ghost" size="xs" :disabled="!canNext" aria-label="Next month" @click="$emit('next')">
        <template #icon><WkiChevronRight :size="16" /></template>
      </WkButton>
      <WkButton v-if="showYearJump" variant="ghost" size="xs" aria-label="Next year" @click="$emit('next-year')">
        <template #icon><WkiChevronsRight :size="16" /></template>
      </WkButton>
    </div>
  </div>
</template>

<script>
import WkButton from '../button/Button.vue'
import WkSelect from '../select/Select.vue'
import { WkiChevronLeft, WkiChevronRight, WkiChevronsLeft, WkiChevronsRight } from '../../icons'

export default {
  name: 'PanelHeader',
  components: { WkButton, WkSelect, WkiChevronLeft, WkiChevronRight, WkiChevronsLeft, WkiChevronsRight },
  props: {
    // One entry per visible month: { month: 0-11, year: Number }.
    panels: { type: Array, default: () => [] },
    // Localized month names as select options: [{ label, value: '0'..'11' }].
    monthOptions: { type: Array, default: () => [] },
    // Selectable years: [{ label, value: 'YYYY' }].
    yearOptions: { type: Array, default: () => [] },
    // Swap the month / year label for a WkSelect dropdown.
    showSelectMonth: { type: Boolean, default: false },
    showSelectYear: { type: Boolean, default: false },
    canPrev: { type: Boolean, default: true },
    canNext: { type: Boolean, default: true },
    // Double-chevron year jump (used by month/year drill views in Phase 2).
    showYearJump: { type: Boolean, default: false }
  },
  emits: ['prev', 'next', 'prev-year', 'next-year', 'set-month', 'set-year', 'label-click'],
  methods: {
    monthName(month) {
      const opt = this.monthOptions[month]
      return opt ? opt.label : month + 1
    }
  }
}
</script>

<style src="./panel-header.css" scoped></style>
