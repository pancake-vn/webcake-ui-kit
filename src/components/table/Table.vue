<template>
  <div class="ui-table">
    <TableLoading>
      <TableResizeObserver @resize="handleContainerResize">
        <TableWrapper>
          <template #bodyCell="slotData">
            <slot name="bodyCell" v-bind="slotData"></slot>
          </template>
          <template #empty>
            <slot name="empty"></slot>
          </template>
          <template #selectionHeader>
            <slot name="selectionHeader"></slot>
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
import {
  flattenRecords,
  collectAllKeys,
  collectDescendantKeys,
  moveTreeNodeByDrop
} from './composables/useFlattenRecords.js'
import { SELECTION_COLUMN, DRAGGABLE_COLUMN } from './constants.js'
import TableWrapper from './TableWrapper.vue'
import TableLoading from './TableLoading.vue'
import TableResizeObserver from './TableResizeObserver.vue'

export default {
  name: 'Table',

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
    rowHeight: { type: Number, default: 50 },
    headerHeight: { type: Number, default: 40 },
    emptyText: { type: String, default: '' },
    height: { type: [Number, String], default: 0 },
    childrenField: { type: String, default: null },
    defaultExpandAll: { type: Boolean, default: false },
    indentSize: { type: Number, default: 28 }
  },

  emits: ['change', 'sort-change', 'select-change', 'expand'],

  data: function () {
    var expandedKeys = []
    if (this.childrenField && this.defaultExpandAll) {
      expandedKeys = Array.from(collectAllKeys(this.dataSource, this.rowKey, this.childrenField))
    }
    return {
      tableCtx: createTableContext(),
      innerExpandedKeys: expandedKeys
    }
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
      const hasSlotSelectionHeader = !!(
        (this.$scopedSlots && this.$scopedSlots['selectionHeader']) ||
        this.$slots['selectionHeader']
      )
      return {
        bordered: this.bordered,
        size: this.size,
        scroll: this.scroll,
        rowHeight: this.rowHeight,
        headerHeight: this.headerHeight,
        height: this.height,
        hasSlotSelectionHeader: hasSlotSelectionHeader
      }
    },

    dataInput: function () {
      return {
        source: this.dataSource,
        rowKey: this.rowKey,
        sortKey: this.tableCtx.sort.columnKey,
        sortOrder: this.tableCtx.sort.order,
        loading: this.loading,
        emptyText: this.emptyText,
        childrenField: this.childrenField,
        expandedKeys: this.innerExpandedKeys
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
        this.tableCtx.layout.headerHeight = v.headerHeight
        this.tableCtx.layout.rowHeight = v.rowHeight
        this.tableCtx.layout.hasSlotSelectionHeader = v.hasSlotSelectionHeader
      }
    },

    dataInput: {
      immediate: true,
      handler: function (v) {
        this.tableCtx.data.source = v.source
        var sorted = v.sortKey ? sortData(v.source, v.sortKey, v.sortOrder) : v.source
        if (v.childrenField) {
          var expandedSet = new Set(v.expandedKeys.map(String))
          this.tableCtx.data.display = flattenRecords(sorted, v.rowKey, v.childrenField, expandedSet)
        } else {
          this.tableCtx.data.display = sorted
        }
        this.tableCtx.data.loading = v.loading
        this.tableCtx.data.emptyText = v.emptyText
      }
    },

    innerExpandedKeys: function (v) {
      this.tableCtx.tree.expandedKeys = v
    },

    childrenField: {
      immediate: true,
      handler: function (v) {
        this.tableCtx.tree.childrenField = v
      }
    },

    indentSize: {
      immediate: true,
      handler: function (v) {
        this.tableCtx.tree.indentSize = v
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
        this.tableCtx.selection.hideSelectAll = !!v.hideSelectAll
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
    this.tableCtx.actions.expand = this.handleExpand
    this.tableCtx.tree.expandedKeys = this.innerExpandedKeys
  },

  methods: {
    handleSort: function (columnKey, order) {
      this.tableCtx.sort.columnKey = columnKey
      this.tableCtx.sort.order = order
      this.$emit('sort-change', { columnKey: columnKey, order: order })
      this.$emit('change', { sort: { columnKey: columnKey, order: order } })
    },

    handleSelect: function (keys, meta) {
      var prevKeys = this.tableCtx.selection.selectedRowKeys.slice()
      var display = this.tableCtx.data.display
      var rowKey = this.tableCtx.layout.rowKey
      var rs = this.rowSelection || {}

      // Cascade check for tree tables when checkStrictly === false
      if (this.childrenField && rs.checkStrictly === false && meta && meta.type === 'row') {
        var descKeys = collectDescendantKeys(this.dataSource, this.rowKey, this.childrenField, meta.record[rowKey])
        if (descKeys.length > 0) {
          if (meta.selected) {
            var combined = keys.slice()
            for (var di = 0; di < descKeys.length; di++) {
              if (combined.indexOf(descKeys[di]) === -1) combined.push(descKeys[di])
            }
            keys = combined
          } else {
            keys = keys.filter(function (k) {
              return descKeys.indexOf(k) === -1
            })
          }
        }
      }

      var selectedRows = display.filter(function (r) {
        return keys.indexOf(r[rowKey]) !== -1
      })

      if (rs.onChange) rs.onChange(keys, selectedRows)

      if (!meta) return

      if (meta.type === 'row') {
        if (rs.onSelect) rs.onSelect(meta.record, meta.selected, selectedRows, meta.nativeEvent)
      } else if (meta.type === 'all') {
        var addedRows = display.filter(function (r) {
          return prevKeys.indexOf(r[rowKey]) === -1
        })
        if (rs.onSelectAll) rs.onSelectAll(true, selectedRows, addedRows)
      } else if (meta.type === 'none') {
        var removedRows = display.filter(function (r) {
          return prevKeys.indexOf(r[rowKey]) !== -1
        })
        if (rs.onSelectAll) rs.onSelectAll(false, [], removedRows)
        if (rs.onSelectNone) rs.onSelectNone()
      }
    },

    handleResize: function (colKey, width) {
      var widths = new Map(this.tableCtx.layout.columnWidths)
      widths.set(colKey, width)
      this.tableCtx.layout.columnWidths = widths
    },

    handleReorder: function (oldIndex, newIndex, dragOffset) {
      var cb = this.tableCtx.draggable.handleReorder
      if (this.childrenField) {
        var newTree = moveTreeNodeByDrop(
          this.tableCtx.data.display,
          this.dataSource,
          this.rowKey,
          this.childrenField,
          oldIndex,
          newIndex,
          dragOffset || 0,
          this.tableCtx.tree.indentSize
        )
        if (!newTree) return
        if (typeof cb === 'function') cb(oldIndex, newIndex, newTree)
      } else {
        var flatDisplay = this.tableCtx.data.display.slice()
        var moved = flatDisplay.splice(oldIndex, 1)[0]
        flatDisplay.splice(newIndex, 0, moved)
        if (typeof cb === 'function') cb(oldIndex, newIndex, flatDisplay)
      }
    },

    handleExpand: function (key) {
      var keyStr = String(key)
      var idx = this.innerExpandedKeys.indexOf(keyStr)
      var next
      if (idx === -1) {
        next = this.innerExpandedKeys.concat(keyStr)
      } else {
        next = this.innerExpandedKeys.filter(function (k) {
          return k !== keyStr
        })
      }
      this.innerExpandedKeys = next
      this.$emit('expand', idx === -1, key)
    },

    handleContainerResize: function (size) {
      this.tableCtx.layout.containerWidth = size.width
    }
  }
}
</script>

<style src="./style/table.css" scoped></style>
