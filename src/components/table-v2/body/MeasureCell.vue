<template>
  <TableResizeObserver @resize="handleCellResize">
    <td ref="cellRef" :style="{ padding: '0', border: '0', height: '0' }">
      <div :style="{ height: 0, overflow: 'hidden' }">&nbsp;</div>
    </td>
  </TableResizeObserver>
</template>

<script>
import TableResizeObserver from '../TableResizeObserver.vue'
import { DRAGGABLE_COLUMN, SELECTION_COLUMN } from '../constants.js'
export default {
  name: 'MeasureCell',
  components: { TableResizeObserver },
  props: {
    measureColumnWidth: {
      type: Boolean,
      default: false
    },
    colKey: {
      type: String,
      required: true
    }
  },
  inject: ['tableContext'],

  methods: {
    handleCellResize({ offsetWidth }) {
      if (this.colKey === DRAGGABLE_COLUMN || this.colKey === SELECTION_COLUMN) {
        return
      }
      this.tableContext.actions.resize(this.colKey, offsetWidth)
    }
  },

  mounted() {
    if (this.$refs.cellRef) {
      this.handleCellResize({ offsetWidth: this.$refs.cellRef.offsetWidth })
    }
  }
}
</script>
