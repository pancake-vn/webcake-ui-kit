<template>
  <div class="ui-dp-date-header">
    <div class="ui-dp-date-header__actions">
      <Button v-if="showYearJump" size="xs" variant="ghost" :disabled="!canPrevYear" @click.stop="$emit('prev-year')">
        <template #icon>
          <WkiChevronsLeft />
        </template>
      </Button>
      <Button size="xs" variant="ghost" :disabled="!canPrev" @click.stop="$emit('prev')">
        <template #icon>
          <WkiChevronLeft />
        </template>
      </Button>
    </div>

    <div class="ui-dp-date-header__label">
      <div v-for="(v, i) in resolvedViews" :key="i" class="ui-dp-date-header__values" @click="$emit('click-month', i)">
        <p>
          <span @click.stop="$emit('click-month', i)">{{ v.monthLabel }}</span>
          <span @click.stop="$emit('click-year', i)">{{ v.yearLabel }}</span>
        </p>
      </div>
    </div>

    <div class="ui-dp-date-header__actions">
      <Button size="xs" variant="ghost" :disabled="!canNext" @click.stop="$emit('next')">
        <template #icon>
          <WkiChevronRight />
        </template>
      </Button>
      <Button v-if="showYearJump" size="xs" variant="ghost" :disabled="!canNextYear" @click.stop="$emit('next-year')">
        <template #icon>
          <WkiChevronsRight />
        </template>
      </Button>
    </div>
  </div>
</template>

<script>
import Button from '../../../button/Button.vue'
import { WkiChevronsLeft, WkiChevronsRight, WkiChevronLeft, WkiChevronRight } from '../../../../icons'
export default {
  name: 'DateHeader',
  components: {
    Button,
    WkiChevronsLeft,
    WkiChevronsRight,
    WkiChevronLeft,
    WkiChevronRight
  },
  props: {
    views: { type: Array, default: () => [] },
    canPrev: { type: Boolean, default: true },
    canNext: { type: Boolean, default: true },
    canPrevYear: { type: Boolean, default: true },
    canNextYear: { type: Boolean, default: true },
    showYearJump: { type: Boolean, default: true }
  },
  computed: {
    resolvedViews() {
      return this.views.length ? this.views : [{ monthLabel: this.monthLabel }]
    }
  },
  emits: ['prev', 'next', 'prev-year', 'next-year', 'click-month', 'click-year'],
  mounted() {
    console.log(this.views, 'views')
  }
}
</script>

<style src="./date-header.css" scoped></style>
