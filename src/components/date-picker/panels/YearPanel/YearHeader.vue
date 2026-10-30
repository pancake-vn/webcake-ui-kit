<template>
  <div class="ui-dp-year-header">
    <Button size="xs" variant="ghost" :disabled="!canPrev" @click.stop="$emit('prev')">
      <template #icon><WkiChevronLeft /></template>
    </Button>

    <span class="ui-dp-year-header__label">{{ decadeStart }} – {{ decadeEnd }}</span>

    <Button size="xs" variant="ghost" :disabled="!canNext" @click.stop="$emit('next')">
      <template #icon><WkiChevronRight /></template>
    </Button>
  </div>
</template>

<script>
import Button from '../../../button/Button.vue'
import { WkiChevronLeft, WkiChevronRight } from '../../../../icons'

export default {
  name: 'YearHeader',
  components: { Button, WkiChevronLeft, WkiChevronRight },
  props: {
    decadeStart: { type: Number, default: 2020 },
    decadeEnd: { type: Number, default: 2031 },
    canPrev: { type: Boolean, default: true },
    canNext: { type: Boolean, default: true }
  },
  emits: ['prev', 'next']
}
</script>

<style src="./year-header.css" scoped></style>
