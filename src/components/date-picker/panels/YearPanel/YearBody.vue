<template>
  <div class="ui-dp-year-body">
    <button
      v-for="item in years"
      :key="item.value"
      :disabled="item.disabled"
      :class="[
        'ui-dp-year-body__cell',
        item.selected && 'is-selected',
        item.current && 'is-current',
        item.disabled && 'is-disabled'
      ]"
      @click="!item.disabled && $emit('select', item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'YearBody',
  props: {
    // Array of { label, value (year number), selected, current, disabled }
    years: { type: Array, default: () => [] }
  },
  emits: ['select']
}
</script>

<style src="./year-body.css" scoped></style>
