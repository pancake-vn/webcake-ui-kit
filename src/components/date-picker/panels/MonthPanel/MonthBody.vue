<template>
  <div class="ui-dp-month-body">
    <button
      v-for="item in months"
      :key="item.value"
      :disabled="item.disabled"
      :class="[
        'ui-dp-month-body__cell',
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
  name: 'MonthBody',
  props: {
    // Array of { label, value (0-11), selected, current, disabled }
    months: { type: Array, default: () => [] }
  },
  emits: ['select']
}
</script>

<style src="./month-body.css" scoped></style>
