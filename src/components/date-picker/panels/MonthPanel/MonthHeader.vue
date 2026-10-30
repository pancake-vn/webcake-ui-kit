<template>
  <div class="ui-dp-month-header">
    <Button size="xs" variant="ghost" :disabled="!canPrev" @click.stop="$emit('prev')">
      <template #icon><WkiChevronLeft /></template>
    </Button>

    <button class="ui-dp-month-header__year-btn" @click="$emit('click-year')">
      {{ year }}
    </button>

    <Button size="xs" variant="ghost" :disabled="!canNext" @click.stop="$emit('next')">
      <template #icon><WkiChevronRight /></template>
    </Button>
  </div>
</template>

<script>
import Button from '../../../button/Button.vue'
import { WkiChevronLeft, WkiChevronRight } from '../../../../icons'

export default {
  name: 'MonthHeader',
  components: { Button, WkiChevronLeft, WkiChevronRight },
  props: {
    year: { type: Number, default: 0 },
    canPrev: { type: Boolean, default: true },
    canNext: { type: Boolean, default: true }
  },
  emits: ['prev', 'next', 'click-year']
}
</script>

<style src="./month-header.css" scoped></style>
