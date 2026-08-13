<template>
  <thead class="ui-table__header">
    <TableHeaderRow />
  </thead>
</template>

<script>
import TableHeaderRow from './TableHeaderRow.vue'

export default {
  name: 'TableHeader',
  components: { TableHeaderRow },
  inject: ['tableContext']
}
</script>
