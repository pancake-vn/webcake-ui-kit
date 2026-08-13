<template>
  <tr
    v-bind="customAttrs"
    v-on="customListeners"
    :class="[
      'ui-table__row',
      isLastItem && 'ui-table__row--last',
      isSelected && 'ui-table__row--selected',
      customAttrs.class
    ]"
    :style="rowStyle"
  >
    <TableCell
      v-for="column in tableContext.columns.flat"
      :key="column.key"
      :column="column"
      :record="record"
      :offset="column.fixed === 'left' ? leftStickyOffsets[column.key] : rightStickyOffsets[column.key]"
    >
      <template #bodyCell="slotData">
        <slot name="bodyCell" v-bind="slotData"></slot>
      </template>
    </TableCell>
  </tr>
</template>

<script>
import TableCell from './TableCell.vue'
import { splitProps } from '../../../utils/common.js'

export default {
  name: 'TableV2Row',
  components: { TableCell },
  inject: ['tableContext'],
  props: {
    record: { type: Object, required: true },
    rowIndex: { type: Number, required: true },
    isLastItem: { type: Boolean, default: false }
  },

  computed: {
    rowStyle() {
      return { height: this.tableContext.layout.rowHeight + 'px' }
    },

    isSelected: function () {
      var key = this.record[this.tableContext.layout.rowKey]
      return this.tableContext.selection.selectedRowKeys.indexOf(key) !== -1
    },

    leftStickyOffsets() {
      return this.tableContext.sticky.leftOffsets
    },

    rightStickyOffsets() {
      return this.tableContext.sticky.rightOffsets
    },

    customProps: function () {
      var fn = this.tableContext.rows.customRow
      return typeof fn === 'function' ? fn(this.record, this.rowIndex) || {} : {}
    },

    customAttrs: function () {
      return splitProps(this.customProps).attrs
    },

    customListeners: function () {
      return splitProps(this.customProps).listeners
    }
  }
}
</script>
