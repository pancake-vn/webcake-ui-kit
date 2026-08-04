<template>
  <div class="ui-table-v2">
    <TableLoading>
      <TableResizeObserver @resize="handleContainerResize">
        <TableWrapper>
          <template #bodyCell="slotData">
            <slot name="bodyCell" v-bind="slotData"></slot>
          </template>
          <template #empty>
            <slot name="empty"></slot>
          </template>
        </TableWrapper>
      </TableResizeObserver>
    </TableLoading>
  </div>
</template>

<script>
import { createTableContext } from './context/createTableContext.js'
import { flattenColumns } from './composables/useColumns.js'
import { sortData } from './composables/useSorter.js'
import { computeOffsets } from './composables/useSticky.js'
import { SELECTION_COLUMN, DRAGGABLE_COLUMN } from './constants.js'
import TableWrapper from './TableWrapper.vue'
import TableLoading from './TableLoading.vue'
import TableResizeObserver from './TableResizeObserver.vue'

export default {
  name: 'TableV2',

  components: { TableWrapper, TableLoading, TableResizeObserver },

  provide: function () {
    return { tableContext: this.tableCtx }
  },

  props: {
    columns: {
      type: Array,
      default: function () {
        return []
      }
    },
    dataSource: {
      type: Array,
      default: function () {
        return []
      }
    },
    bordered: { type: Boolean, default: false },
    size: { type: String, default: 'md' },
    rowKey: { type: String, default: 'key' },
    scroll: { type: Object, default: null },
    loading: { type: Boolean, default: false },
    rowSelection: { type: Object, default: null },
    customRow: { type: Function, default: null },
    customHeaderRow: { type: Function, default: null },
    rowDraggable: { type: Object, default: null },
    enableFixedLeft: { type: Boolean, default: false },
    rowHeight: { type: Number, default: 36 },
    headerHeight: { type: Number, default: 50 },
    emptyText: { type: String, default: '' },
    height: { type: [Number, String], default: 0 }
  },

  emits: ['change', 'sort-change', 'select-change'],

  data: function () {
    return { tableCtx: createTableContext() }
  },

  computed: {
    isEmpty: function () {
      return this.tableCtx.data.display.length === 0
    },

    columnsInput: function () {
      return {
        columns: this.columns,
        rowKey: this.rowKey,
        hasSelection: !!this.rowSelection,
        hasDraggable: !!this.rowDraggable
      }
    },

    rowsInput: function () {
      return { customRow: this.customRow, customHeaderRow: this.customHeaderRow }
    },

    layoutInput: function () {
      return {
        bordered: this.bordered,
        size: this.size,
        scroll: this.scroll,
        rowHeight: this.rowHeight,
        headerHeight: this.headerHeight,
        height: this.height
      }
    },

    dataInput: function () {
      return {
        source: this.dataSource,
        sortKey: this.tableCtx.sort.columnKey,
        sortOrder: this.tableCtx.sort.order,
        loading: this.loading,
        emptyText: this.emptyText
      }
    },

    stickyInput: function () {
      return {
        columns: this.tableCtx.columns.flat,
        widths: this.tableCtx.layout.columnWidths
      }
    },

    selectionInput: function () {
      return this.rowSelection
    },

    draggableInput: function () {
      return this.rowDraggable
    }
  },

  watch: {
    columnsInput: {
      immediate: true,
      handler: function (v) {
        var cols = flattenColumns(v.columns)
        const isHasFixedLeft = cols.some(col => col.fixed === 'left')
        if (v.hasSelection) {
          cols.unshift({
            key: '__selection__',
            type: SELECTION_COLUMN,
            width: 36,
            dataIndex: '',
            title: '',
            align: null,
            fixed: isHasFixedLeft || this.enableFixedLeft ? 'left' : null,
            ellipsis: false
          })
        }
        if (v.hasDraggable) {
          cols.unshift({
            key: '__draggable__',
            type: DRAGGABLE_COLUMN,
            width: 36,
            dataIndex: '',
            title: '',
            align: null,
            fixed: isHasFixedLeft || this.enableFixedLeft ? 'left' : null,
            ellipsis: false
          })
        }
        this.tableCtx.columns.flat = cols
        this.tableCtx.layout.rowKey = v.rowKey
      }
    },

    rowsInput: {
      immediate: true,
      handler: function (v) {
        this.tableCtx.rows.customRow = v.customRow
        this.tableCtx.rows.customHeaderRow = v.customHeaderRow
      }
    },

    layoutInput: {
      immediate: true,
      deep: true,
      handler: function (v) {
        this.tableCtx.layout.bordered = v.bordered
        this.tableCtx.layout.size = v.size
        this.tableCtx.layout.scroll = v.scroll
        this.tableCtx.layout.tableLayout = v.scroll && v.scroll.y ? 'fixed' : 'auto'
        this.tableCtx.layout.height = v.height
      }
    },

    dataInput: {
      immediate: true,
      handler: function (v) {
        this.tableCtx.data.source = v.source
        ;((this.tableCtx.data.display = v.sortKey ? sortData(v.source, v.sortKey, v.sortOrder) : v.source),
          (this.tableCtx.data.loading = v.loading))
        this.tableCtx.data.emptyText = v.emptyText
        console.log(this.tableCtx.data.emptyText)
      }
    },

    stickyInput: {
      deep: true,
      immediate: true,
      handler: function (v) {
        if (!v.columns.length) return
        var offsets = computeOffsets(v.columns, v.widths)
        this.tableCtx.sticky.leftOffsets = offsets.left
        this.tableCtx.sticky.rightOffsets = offsets.right
      }
    },

    selectionInput: {
      immediate: true,
      deep: true,
      handler: function (v) {
        if (!v) return
        this.tableCtx.selection.selectedRowKeys = v.selectedRowKeys || []
        this.tableCtx.selection.hideSelectAll = v.hideSelectAll
        this.tableCtx.selection.columnWidth = v.columnWidth
        this.tableCtx.selection.type = v.type
        this.tableCtx.selection.onChange = v.onChange
        this.tableCtx.selection.onSelect = v.onSelect
        this.tableCtx.selection.onSelectAll = v.onSelectAll
        this.tableCtx.selection.onSelectNone = v.onSelectNone
      }
    },

    draggableInput: {
      immediate: true,
      deep: true,
      handler: function (v) {
        this.tableCtx.draggable.enabled = !!v
        if (!v) return
        this.tableCtx.draggable.columnWidth = v.columnWidth || 36
        this.tableCtx.draggable.handleReorder = v.handleReorder || null
        this.tableCtx.draggable.enableAnimationFlip = v.enableAnimationFlip || false
      }
    }
  },

  created: function () {
    this.tableCtx.actions.sort = this.handleSort
    this.tableCtx.actions.select = this.handleSelect
    this.tableCtx.actions.resize = this.handleResize
    this.tableCtx.actions.reorder = this.handleReorder
  },

  methods: {
    handleSort: function (columnKey, order) {
      this.tableCtx.sort.columnKey = columnKey
      this.tableCtx.sort.order = order
      this.$emit('sort-change', { columnKey: columnKey, order: order })
      this.$emit('change', { sort: { columnKey: columnKey, order: order } })
    },

    handleSelect: function (keys, meta) {
      var prevKeys = this.tableCtx.selection.selectedRowKeys
      var display = this.tableCtx.data.display
      var rowKey = this.tableCtx.layout.rowKey
      var rs = this.rowSelection || {}

      this.tableCtx.selection.checkAll = keys.length === display.length && display.length > 0

      var selectedRows = display.filter(function (r) {
        return keys.indexOf(r[rowKey]) !== -1
      })

      if (rs.onChange) rs.onChange(keys, selectedRows)

      if (!meta) return

      if (meta.type === 'row') {
        if (rs.onSelect) rs.onSelect(meta.record, meta.selected, selectedRows, meta.nativeEvent)
      } else if (meta.type === 'all') {
        // changeRows = rows mới được check (chưa có trong prevKeys)
        var changeRows = display.filter(function (r) {
          return prevKeys.indexOf(r[rowKey]) === -1
        })
        if (rs.onSelectAll) rs.onSelectAll(true, selectedRows, changeRows)
      } else if (meta.type === 'none') {
        // changeRows = rows bị uncheck (đang có trong prevKeys)
        changeRows = display.filter(function (r) {
          return prevKeys.indexOf(r[rowKey]) !== -1
        })
        if (rs.onSelectAll) rs.onSelectAll(false, [], changeRows)
        if (rs.onSelectNone) rs.onSelectNone()
      }
    },

    handleResize: function (colKey, width) {
      var widths = new Map(this.tableCtx.layout.columnWidths)
      widths.set(colKey, width)
      this.tableCtx.layout.columnWidths = widths
    },

    handleReorder: function (oldIndex, newIndex) {
      const display = this.tableCtx.data.display.slice()
      const moved = display.splice(oldIndex, 1)[0]
      display.splice(newIndex, 0, moved)

      const cb = this.tableCtx.draggable.handleReorder
      if (typeof cb === 'function') cb(oldIndex, newIndex, display)
    },

    handleContainerResize: function (size) {
      this.tableCtx.layout.containerWidth = size.width
    }
  }
}
</script>

<style src="./style/table.css" scoped></style>
