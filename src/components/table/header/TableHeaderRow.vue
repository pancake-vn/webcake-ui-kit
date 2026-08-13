<template>
  <tr
    v-bind="customAttrs"
    v-on="customListeners"
    :class="['ui-table__header-row', customAttrs.class]"
    :style="rowStyle"
  >
    <TableHeaderCell
      v-for="(column, index) in tableContext.columns.flat"
      :key="column.key"
      :column="column"
      :is-last-item="index === tableContext.columns.flat.length - 1"
      :offset="column.fixed === 'left' ? leftStickyOffsets[column.key] : rightStickyOffsets[column.key]"
    >
      <template v-if="column.resizable && !isEmpty" #drag-handle>
        <ColumnDragHandle
          :column="column"
          :width="columnWidths.get(column.key)"
          :min-width="column.minWidth"
          :max-width="column.maxWidth"
          @resize="hanldeResize"
        />
      </template>
    </TableHeaderCell>
    <th v-if="hasScrollBar" class="ui-table__scrollbar-cell" aria-hidden="true" :style="styleFakeScrollbar" />
  </tr>
</template>

<script>
import TableHeaderCell from './TableHeaderCell.vue'
import { splitProps } from '../../../utils/common.js'
import ColumnDragHandle from '../ColumnDragHandle.vue'

export default {
  name: 'TableV2HeaderRow',
  components: {
    TableHeaderCell,
    ColumnDragHandle
  },
  inject: ['tableContext'],

  computed: {
    rowStyle() {
      return { height: this.tableContext.layout.headerHeight + 'px' }
    },

    hasScrollBar: function () {
      const w = parseFloat(this.tableContext.layout.scrollBarWidth)
      return !!w
    },

    columnWidths() {
      return this.tableContext.layout.columnWidths
    },

    leftStickyOffsets() {
      return this.tableContext.sticky.leftOffsets
    },

    rightStickyOffsets() {
      const scrollBarWidth = parseFloat(this.tableContext.layout.scrollBarWidth) || 0
      const rightOffsets = Object.fromEntries(
        Object.entries(this.tableContext.sticky.rightOffsets).map(([key, value]) => [key, value + scrollBarWidth])
      )

      return rightOffsets
    },

    hasFixedRight: function () {
      return Object.keys(this.rightStickyOffsets).length > 0
    },

    styleFakeScrollbar: function () {
      if (this.hasFixedRight) {
        return {
          position: 'sticky',
          right: '0'
        }
      }
      return {}
    },

    customProps: function () {
      var fn = this.tableContext.rows.customHeaderRow
      return typeof fn === 'function' ? fn(this.tableContext.columns.flat, 0) || {} : {}
    },

    customAttrs: function () {
      return splitProps(this.customProps).attrs
    },

    customListeners: function () {
      return splitProps(this.customProps).listeners
    },

    isEmpty: function () {
      return this.tableContext.data.display.length === 0
    }
  },

  methods: {
    hanldeResize(width, column) {
      this.tableContext.actions.resize(column.key, width)
    }
  }
}
</script>
