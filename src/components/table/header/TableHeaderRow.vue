<template>
  <tr
    v-bind="customAttrs"
    v-on="customListeners"
    :class="['ui-table__header-row', customAttrs.class]"
    :style="rowStyle"
  >
    <template v-if="hasSelectionHeader">
      <TableHeaderCell
        v-for="column in systemColumns"
        :key="column.key"
        :column="column"
        :is-last-item="false"
        :offset="column.fixed === 'left' ? leftStickyOffsets[column.key] : rightStickyOffsets[column.key]"
      />
      <th :colspan="selectionHeaderColspan" class="ui-table__header-cell ui-table__header-cell--bulk">
        <div :style="bulkHeaderStyle">
          <slot name="selectionHeader"></slot>
        </div>
      </th>
      <th v-if="hasScrollBar" class="ui-table__scrollbar-cell" aria-hidden="true" :style="styleFakeScrollbar" />
    </template>
    <template v-else>
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
    </template>
  </tr>
</template>

<script>
import TableHeaderCell from './TableHeaderCell.vue'
import { splitProps } from '../../../utils/common.js'
import ColumnDragHandle from '../ColumnDragHandle.vue'
import { SELECTION_COLUMN, DRAGGABLE_COLUMN } from '../constants.js'

export default {
  name: 'TableHeaderRow',
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
    },

    hasSelectionHeader: function () {
      const hasKeys = this.tableContext.selection.selectedRowKeys.length > 0
      const hasSlot = this.tableContext.layout.hasSlotSelectionHeader

      return hasKeys && hasSlot
    },

    systemColumns: function () {
      return this.tableContext.columns.flat.filter(function (col) {
        return col.type === SELECTION_COLUMN || col.type === DRAGGABLE_COLUMN
      })
    },

    selectionHeaderColspan: function () {
      return this.tableContext.columns.flat.length - this.systemColumns.length
    },

    bulkHeaderStyle: function () {
      var container = this.tableContext.layout.containerWidth
      if (!container) return {}
      var self = this
      var systemWidth = 0
      this.systemColumns.forEach(function (col) {
        var measured = self.columnWidths.get(col.key)
        systemWidth += measured != null ? measured : col.width || 0
      })
      return { width: container - systemWidth - 2 + 'px' } // Trừ đi border của table
    }
  },

  methods: {
    hanldeResize(width, column) {
      this.tableContext.actions.resize(column.key, width)
    }
  }
}
</script>
