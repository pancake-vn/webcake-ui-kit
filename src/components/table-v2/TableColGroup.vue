<template>
  <colgroup>
    <col
      v-for="col in tableContext.columns.flat"
      :key="col.key"
      :class="isSelectionCol(col) ? 'ui-table-v2__selection-col' : ''"
      :style="colStyle(col)"
    />
    <col v-if="hasScrollBar" :style="{ width: tableContext.layout.scrollBarWidth }" />
  </colgroup>
</template>

<script>
import { toCssSize } from '../../utils/common'
import { SELECTION_COLUMN, DRAGGABLE_COLUMN } from './constants.js'

export default {
  name: 'TableV2ColGroup',
  inject: ['tableContext'],
  props: {
    isHeader: { type: Boolean, default: false }
  },
  methods: {
    toCssSize,
    colStyle: function (col) {
      const res = {}
      res.width = (this.tableContext.layout.columnWidths.get(col.key) || col.width) + 'px'
      if (col.type === SELECTION_COLUMN) {
        const w = (this.tableContext.selection.columnWidth || 36) + 'px'
        res.width = w
        res.minWidth = w
        res.maxWidth = w
      }
      if (col.type === DRAGGABLE_COLUMN) {
        const w = (this.tableContext.draggable.columnWidth || 36) + 'px'
        res.width = w
        res.minWidth = w
        res.maxWidth = w
      }
      return res
    },
    isSelectionCol: function (col) {
      return col.type === SELECTION_COLUMN
    },
    isDraggableCol: function (col) {
      return col.key === DRAGGABLE_COLUMN
    }
  },
  computed: {
    hasScrollBar: function () {
      return this.isHeader && this.tableContext.layout.scrollBarWidth != '0px'
    }
  }
}
</script>
