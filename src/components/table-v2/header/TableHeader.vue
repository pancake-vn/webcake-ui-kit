<template>
  <thead class="ui-table-v2__header">
    <TableHeaderRow />
  </thead>
</template>

<script>
import TableHeaderRow from './TableHeaderRow.vue'

export default {
  name: 'TableV2Header',
  components: { TableHeaderRow },
  inject: ['tableContext']
}
</script>
