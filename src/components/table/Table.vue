<template>
  <div
    :class="[
      'ui-table',
      bordered && 'ui-table--bordered',
      isFixedLayout && 'ui-table--scroll-y',
      resizeState && 'ui-table--resizing'
    ]"
    :style="containerStyle"
  >
    <table class="ui-table__table" :style="tableStyle">
      <colgroup>
        <col v-if="hasDrag" class="ui-table__col ui-table__col--drag" />
        <col v-if="hasSelection" class="ui-table__col ui-table__col--selection" />
        <col v-for="col in normalizedColumns" :key="col._key" :style="col._style" />
      </colgroup>
      <thead ref="tableHead" class="ui-table__head">
        <tr
          :class="['ui-table__row', 'ui-table__row--head', scrollbarWidth > 0 && 'ui-table__row--has-scrollbar']"
          :style="[{ height: toCssSize(headerHeight) }, rowScrollStyle]"
        >
          <th
            v-if="hasDrag"
            :class="['ui-table__cell', 'ui-table__th', 'ui-table__cell--drag', 'ui-table__cell--fixed-left']"
            :style="[headCellStyle(0), { left: '0px' }]"
            aria-hidden="true"
          />
          <th
            v-if="hasSelection"
            :class="[
              'ui-table__cell',
              'ui-table__th',
              'ui-table__cell--selection',
              'ui-table__cell--fixed-left',
              !prefixStickyLeft && 'ui-table__cell--fixed-left-last'
            ]"
            :style="[headCellStyle(hasDrag ? 1 : 0), { left: selectionStickyOffset + 'px' }]"
          >
            <WkCheckbox :checked="allSelected" :disabled="!rows.length" @change="onToggleAll" />
          </th>
          <th
            v-for="(col, i) in normalizedColumns"
            :key="col._key"
            :class="[
              'ui-table__cell',
              'ui-table__th',
              'ui-table__th-flex',
              `ui-table__cell--${col._align}`,
              col._isSortable && 'ui-table__th--sortable',
              col._fixed && `ui-table__cell--fixed-${col._fixed}`,
              col._isLastFixedLeft && 'ui-table__cell--fixed-left-last',
              col._isFirstFixedRight && 'ui-table__cell--fixed-right-first'
            ]"
            :style="[
              headCellStyle((hasDrag ? 1 : 0) + (hasSelection ? 1 : 0) + i, col),
              col._fixed === 'left' ? { [col._fixed]: col._stickyOffset + 'px' } : {},
              col._fixed === 'right' ? { [col._fixed]: col._stickyOffset + 'px' } : {}
            ]"
            :tabindex="col._isSortable ? 0 : undefined"
            :aria-sort="col._ariaSort"
            @click="onHeaderClick(col)"
            @keydown.enter.prevent="onHeaderClick(col)"
            @keydown.space.prevent="onHeaderClick(col)"
            v-bind="col._headerAttrs"
            v-on="col._headerListeners"
          >
            <div class="ui-table__th-inner-wrap">
              <span class="ui-table__th-inner">
                <slot name="headerCell" :column="col">{{ col.title }}</slot>
                <span
                  v-if="col._isSortable"
                  :class="['ui-table__sort', col._sortState ? 'ui-table__sort--active' : 'ui-table__sort--inactive']"
                  aria-hidden="true"
                >
                  <WkiArrowUp v-if="col._sortState === 'ascend'" :size="16" />
                  <WkiArrowDown v-else-if="col._sortState === 'descend'" :size="16" />
                  <WkiArrowDownUp v-else :size="16" />
                </span>
              </span>
              <div
                v-if="col._resizable"
                :class="['ui-table__resize-handle', col._fixed === 'right' && 'ui-table__resize-handle--left']"
                @pointerdown.stop.prevent="onResizeStart($event, col, i)"
              />
            </div>
          </th>
          <th
            v-if="scrollbarWidth > 0"
            class="ui-table__th--scrollbar"
            :style="{ width: scrollbarWidth + 'px', position: 'sticky', right: '0px' }"
            aria-hidden="true"
          />
        </tr>
      </thead>
      <tbody ref="tableBody" class="ui-table__body" :style="bodyStyle" @scroll="onBodyScroll" @dragleave="onDragLeave">
        <tr v-if="!rows.length" class="ui-table__row ui-table__row--empty">
          <td class="ui-table__cell ui-table__empty-cell" :colspan="totalColumns">
            <slot name="emptyText">
              <WkEmpty :title="emptyText" />
            </slot>
          </td>
        </tr>
        <template v-else>
          <!-- Top spacer reserves the height of the rows scrolled out above the window. -->
          <tr v-if="isVirtual" class="ui-table__spacer" :style="{ height: topSpacerHeight + 'px' }" aria-hidden="true">
            <td class="ui-table__spacer-cell" :colspan="totalColumns" />
          </tr>
          <tr
            v-for="row in mappedRenderRows"
            :key="row._key"
            :ref="'row-' + row._key"
            :class="[
              'ui-table__row',
              'ui-table__row--body',
              row._selected && 'ui-table__row--selected',
              hasDrag && dragState && row._index === dragState.currentIndex && 'ui-table__row--dragging'
            ]"
            :style="[{ height: toCssSize(rowHeight) }, rowScrollStyle]"
            v-bind="row._attrs"
            v-on="row._listeners"
            @click="hasSelection ? onRowClick(row._record, row._index, $event) : undefined"
            @dragover.prevent="onDragOver($event, row._index)"
            @drop.prevent="onDrop($event, row._index)"
          >
            <td
              v-if="hasDrag"
              :class="['ui-table__cell', 'ui-table__td', 'ui-table__cell--drag', 'ui-table__cell--fixed-left']"
              :style="[{ left: '0px' }]"
              draggable="true"
              @dragstart.stop="onDragStart($event, row)"
              @dragend="onDragEnd"
              @click.stop
            >
              <WkiGripVertical :size="16" />
            </td>
            <td
              v-if="hasSelection"
              :class="[
                'ui-table__cell',
                'ui-table__td',
                'ui-table__cell--selection',
                'ui-table__cell--fixed-left',
                !prefixStickyLeft && 'ui-table__cell--fixed-left-last'
              ]"
              :style="[{ left: selectionStickyOffset + 'px' }]"
              @click.stop="onSelectionCellClick(row._record, row._index, $event)"
            >
              <WkCheckbox :checked="row._selected" />
            </td>
            <td
              v-for="col in normalizedColumns"
              :key="col._key"
              :class="[
                'ui-table__cell',
                'ui-table__td',
                `ui-table__cell--${col._align}`,
                col.ellipsis && 'ui-table__cell--ellipsis',
                col._fixed && `ui-table__cell--fixed-${col._fixed}`,
                col._isLastFixedLeft && 'ui-table__cell--fixed-left-last',
                col._isFirstFixedRight && 'ui-table__cell--fixed-right-first'
              ]"
              :style="[
                col._style,
                col._fixed
                  ? { [col._fixed]: col._stickyOffset - (col._fixed === 'right' ? scrollbarWidth : 0) + 'px' }
                  : {}
              ]"
            >
              <slot
                name="bodyCell"
                :column="col"
                :record="row._record"
                :text="cellText(col, row._record)"
                :index="row._index"
                >{{ cellText(col, row._record) }}</slot
              >
            </td>
          </tr>
          <!-- Bottom spacer reserves the height of the rows below the window. -->
          <tr
            v-if="isVirtual"
            class="ui-table__spacer"
            :style="{ height: bottomSpacerHeight + 'px' }"
            aria-hidden="true"
          >
            <td class="ui-table__spacer-cell" :colspan="totalColumns" />
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import WkCheckbox from '../checkbox/Checkbox.vue'
import WkEmpty from '../empty/Empty.vue'
import { WkiGripVertical, WkiArrowDown, WkiArrowDownUp, WkiArrowUp } from '../../icons'
import { toCssSize } from '../../utils/common'
import { computeVirtualWindow } from '../../utils/virtualScroll'

function defaultCompare(a, b) {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b))
}

const EMPTY_BINDINGS = Object.freeze({ attrs: {}, on: {} })

export default {
  name: 'Table',
  components: { WkCheckbox, WkEmpty, WkiGripVertical, WkiArrowDown, WkiArrowDownUp, WkiArrowUp },
  props: {
    // Column descriptors: { title, dataIndex, key?, width?, align?, sorter?, ellipsis? }
    columns: { type: Array, default: () => [] },
    // Row records. Each record should expose a stable key (see rowKey).
    dataSource: { type: Array, default: () => [] },
    // How to derive a row's key: a record field name, or a function (record) => key.
    rowKey: { type: [String, Function], default: 'key' },
    // Outer border + vertical column dividers.
    bordered: { type: Boolean, default: false },
    // Render a leading checkbox column for row selection.
    rowSelection: { type: Boolean, default: false },
    isDrag: { type: Boolean, default: false },
    // Controlled selection — array of selected row keys.
    selectedRowKeys: { type: Array, default: () => [] },
    // Placeholder shown when dataSource is empty.
    emptyText: { type: String, default: 'No data' },
    // Fixed scroll viewport: { x, y } as px (number) or any CSS size (string).
    // x sets the table min-width (horizontal scroll); y caps the body height (vertical scroll + sticky header).
    scroll: { type: Object, default: null },
    // Fixed overall height of the table viewport (px number or CSS size). Enables vertical scroll + sticky header.
    height: { type: [Number, String], default: null },
    rowHeight: { type: [Number, String], default: 39 },
    headerHeight: { type: [Number, String], default: 39 },
    customRow: { type: Function, default: null },
    customHeader: { type: Function, default: null },
    // Virtualize the body: render only the rows visible in the viewport (+ overscan).
    // Requires a vertical-scroll viewport (height or scroll.y) and a numeric rowHeight.
    virtual: { type: Boolean, default: false },
    // Extra rows rendered above and below the viewport to cushion fast scrolling.
    overscan: { type: Number, default: 8 }
  },
  emits: ['change', 'sort-change', 'update:selectedRowKeys', 'selection-change', 'drag-record'],
  data() {
    return {
      sortField: null,
      sortOrder: null,
      internalSelected: this.selectedRowKeys.slice(),
      scrollbarWidth: 0,
      colWidths: [],
      lastClickedIndex: null,
      scrollTop: 0,
      containerHeight: 0,
      rafId: null,
      toCssSize,
      resizeState: null,
      columnWidths: {},
      dragState: null,
      dragOverIndex: null,
      internalData: this.dataSource.slice()
    }
  },
  computed: {
    selectedKeysSet() {
      return new Set(this.internalSelected)
    },
    normalizedColumns() {
      const prefixDomCount = (this.hasDrag ? 1 : 0) + (this.hasSelection ? 1 : 0)

      const domWidth = domIdx => {
        const dataIdx = domIdx - prefixDomCount
        if (dataIdx >= 0 && dataIdx < this.columns.length) {
          const col = this.columns[dataIdx]
          const key = col.key != null ? col.key : col.dataIndex
          // resize override > DOM measurement > width prop
          if (key != null && this.columnWidths[key] != null) return this.columnWidths[key]
          if (this.colWidths[domIdx] != null) return this.colWidths[domIdx]
          const w = col.width
          return w != null ? (typeof w === 'number' ? w : parseFloat(w) || 0) : 0
        }
        // prefix columns (drag, selection) — DOM only, no prop fallback
        return this.colWidths[domIdx] != null ? this.colWidths[domIdx] : 0
      }

      const cols = this.columns.map((col, i) => {
        const _key = col.key != null ? col.key : col.dataIndex
        const _align = ['left', 'right', 'center'].includes(col.align) ? col.align : 'left'
        const overrideW = this.columnWidths[_key]
        let _style = {}
        if (overrideW != null) {
          _style = { width: `${overrideW}px` }
        } else if (col.width != null) {
          _style = { width: typeof col.width === 'number' ? `${col.width}px` : col.width }
        }
        const _isSortable = !!col.sorter
        const _field = col.dataIndex != null ? col.dataIndex : col.key

        let _sortState = null
        if (this.sortField === _field) {
          _sortState = this.sortOrder
        }

        let _ariaSort = undefined
        if (_sortState === 'ascend') _ariaSort = 'ascending'
        else if (_sortState === 'descend') _ariaSort = 'descending'

        // Pre-compute header bindings once per column instead of calling
        // customHeaderAttrs / customHeaderListeners every render.
        const _headerBindings = this.customHeader ? this.splitBindings(this.customHeader(col, i)) : EMPTY_BINDINGS
        const _fixed = col.fixed === 'left' ? 'left' : col.fixed === 'right' ? 'right' : null
        return {
          ...col,
          _key,
          _align,
          _style,
          _isSortable,
          _field,
          _sortState,
          _ariaSort,
          _headerAttrs: _headerBindings.attrs,
          _headerListeners: _headerBindings.on,
          _fixed,
          _isLastFixedLeft: false,
          _isLastFixedRight: false,
          _resizable: col.resizable != null ? col.resizable : false
        }
      })

      let leftAccum = 0
      for (let i = 0; i < prefixDomCount; i++) leftAccum += domWidth(i)
      for (let i = 0; i < cols.length; i++) {
        cols[i]._stickyOffset = leftAccum
        leftAccum += domWidth(prefixDomCount + i)
      }

      let rightAccum = this.scrollbarWidth
      for (let i = cols.length - 1; i >= 0; i--) {
        if (cols[i]._fixed === 'right') {
          cols[i]._stickyOffset = rightAccum
          rightAccum += domWidth(prefixDomCount + i)
        }
      }

      let lastLeftIdx,
        firstRightIdx = -1
      for (let i = 0; i < cols.length; i++) {
        if (cols[i]._fixed === 'left') lastLeftIdx = i
        if (cols[i]._fixed === 'right' && firstRightIdx === -1) firstRightIdx = i
      }

      if (lastLeftIdx >= 0) cols[lastLeftIdx]._isLastFixedLeft = true
      if (firstRightIdx >= 0) cols[firstRightIdx]._isFirstFixedRight = true

      return cols
    },
    hasSelection() {
      return !!this.rowSelection
    },
    hasDrag() {
      return !!this.isDrag
    },
    // True when any data column is fixed-left — prefix columns must also become sticky.
    prefixStickyLeft() {
      return this.normalizedColumns.some(c => c._fixed === 'left')
    },
    hasStickyRight() {
      return this.normalizedColumns.some(c => c._fixed === 'right')
    },
    // Pixel offset of the selection column when sticky (sits after the drag column).
    selectionStickyOffset() {
      return this.hasDrag ? (this.colWidths[0] != null ? this.colWidths[0] : 44) : 0
    },
    totalColumns() {
      return this.columns.length + (this.hasDrag ? 1 : 0) + (this.hasSelection ? 1 : 0)
    },
    rows() {
      const data = this.internalData.slice()
      if (!this.sortField || !this.sortOrder) return data
      const col = this.normalizedColumns.find(c => c._field === this.sortField)
      if (!col || !col.sorter) return data
      const cmp =
        typeof col.sorter === 'function' ? col.sorter : (a, b) => defaultCompare(a[this.sortField], b[this.sortField])
      data.sort(cmp)
      if (this.sortOrder === 'descend') data.reverse()
      return data
    },
    allSelected() {
      if (!this.rows.length) return false
      return this.rows.every((record, index) => this.selectedKeysSet.has(this.getRowKey(record, index)))
    },
    isFixedLayout() {
      const scroll = this.scroll || {}
      return this.height != null || scroll.y != null || scroll.x != null
    },
    containerStyle() {
      return {}
    },
    tableStyle() {
      return {}
    },
    rowScrollStyle() {
      const scroll = this.scroll || {}
      return scroll.x != null && this.isFixedLayout ? { minWidth: toCssSize(scroll.x) } : {}
    },
    bodyStyle() {
      const scroll = this.scroll || {}
      const style = {}
      if (this.height != null) {
        style.height = toCssSize(this.height)
      } else if (scroll.y != null) {
        style.maxHeight = toCssSize(scroll.y)
      }
      if (this.isFixedLayout) {
        style.overflowY = scroll.y != null || this.height != null ? 'auto' : 'visible'
        style.overflowX = scroll.x != null ? 'auto' : 'hidden'
      }
      return style
    },
    // Numeric row height — virtualization needs a fixed px value. String sizes are
    // parsed (e.g. '40px' -> 40); anything unparseable falls back to the prop default.
    rowHeightPx() {
      if (typeof this.rowHeight === 'number') return this.rowHeight
      const parsed = parseFloat(this.rowHeight)
      return Number.isFinite(parsed) ? parsed : 39
    },
    // Virtualization is only meaningful inside a bounded, scrollable viewport.
    isVirtual() {
      // Virtualization is only meaningful inside a bounded vertical viewport.
      return this.virtual && (this.height != null || (this.scroll && this.scroll.y != null)) && this.rows.length > 0
    },
    virtualWindow() {
      return computeVirtualWindow({
        scrollTop: this.scrollTop,
        rowHeight: this.rowHeightPx,
        containerHeight: this.containerHeight,
        total: this.rows.length,
        overscan: this.overscan
      })
    },
    // Rows actually committed to the DOM: a slice when virtual, otherwise everything.
    slicedRenderRows() {
      if (!this.isVirtual) return this.rows
      return this.rows.slice(this.virtualWindow.startIndex, this.virtualWindow.endIndex)
    },
    // Pre-compute key, index, selected state, and customRow bindings for each row.
    // This eliminates repeated method calls (getRowKey, rowIndex, isSelected,
    // customRowAttrs, customRowListeners) inside the v-for template.
    mappedRenderRows() {
      const startIndex = this.isVirtual ? this.virtualWindow.startIndex : 0
      const hasCustomRow = !!this.customRow
      return this.slicedRenderRows.map((record, i) => {
        const index = startIndex + i
        const key = this.getRowKey(record, index)
        const selected = this.selectedKeysSet.has(key)
        const bindings = hasCustomRow ? this.splitBindings(this.customRow(record, index)) : EMPTY_BINDINGS
        return {
          _record: record,
          _index: index,
          _key: key,
          _selected: selected,
          _attrs: bindings.attrs,
          _listeners: bindings.on
        }
      })
    },
    // Kept as aliases so template references (renderRows) don't break if used externally.
    renderRows() {
      return this.mappedRenderRows
    },
    topSpacerHeight() {
      return this.isVirtual ? this.virtualWindow.offsetY : 0
    },
    bottomSpacerHeight() {
      if (!this.isVirtual) return 0
      const rendered = this.slicedRenderRows.length * this.rowHeightPx
      return Math.max(0, this.virtualWindow.totalHeight - this.virtualWindow.offsetY - rendered)
    }
  },
  watch: {
    selectedRowKeys(next) {
      this.internalSelected = (next || []).slice()
    },
    dataSource(next) {
      if (!this.dragState) {
        this.internalData = (next || []).slice()
      }
    }
  },
  mounted() {
    this.initResizeObserver()
  },
  // Declare both teardown hooks: Vue 2.7 fires beforeDestroy, Vue 3.4 fires beforeUnmount.
  // The runtime that doesn't recognize a hook simply ignores it.
  beforeUnmount() {
    this.teardown()
  },
  methods: {
    // Split a customRow/customHeader result into plain attributes and event listeners.
    // The public API mirrors ant-design-vue's `onClick`/`onDblclick`/... convention, which
    // Vue 3 auto-resolves to listeners when spread via v-bind — but Vue 2 would bind them as
    // raw DOM attributes. So we strip the `onXxx` keys into a v-on map (event name lower-cased)
    // and leave the rest for v-bind, which works identically on both runtimes.
    splitBindings(raw) {
      const attrs = {}
      const on = {}
      if (raw) {
        Object.keys(raw).forEach(key => {
          const match = /^on([A-Z].*)$/.exec(key)
          if (match) {
            on[match[1].charAt(0).toLowerCase() + match[1].slice(1)] = raw[key]
          } else {
            attrs[key] = raw[key]
          }
        })
      }
      return { attrs, on }
    },
    teardown() {
      if (this._resizeObserver) {
        this._resizeObserver.disconnect()
        this._resizeObserver = null
      }
      if (this.rafId != null) {
        cancelAnimationFrame(this.rafId)
        this.rafId = null
      }
    },
    // Use ResizeObserver instead of updated() + window resize to measure scrollbar
    // gutter and container height. This avoids triggering a second render cycle
    // every time Vue updates the DOM.
    initResizeObserver() {
      const body = this.$refs.tableBody
      if (!body) return
      this._resizeObserver = new ResizeObserver(() => {
        this.syncScrollbarGutter()
      })
      this._resizeObserver.observe(body)
      // Initial measurement.
      this.$nextTick(this.syncScrollbarGutter)
    },
    onBodyScroll(e) {
      const top = e.target.scrollTop
      const left = e.target.scrollLeft
      // Coalesce bursts of scroll events into a single state update per frame so we
      // re-slice at most once per repaint — keeps 10k+ rows smooth.
      if (this.rafId != null) return
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null
        this.scrollTop = top
        // Sync horizontal scroll to keep the header aligned with the body.
        const head = this.$refs.tableHead
        if (head) head.scrollLeft = left
      })
    },
    syncScrollbarGutter() {
      const body = this.$refs.tableBody
      if (!body) return

      const hasY = this.height != null || (this.scroll && this.scroll.y != null)
      this.scrollbarWidth = hasY ? body.offsetWidth - body.clientWidth : 0

      if (hasY) {
        this.containerHeight = body.clientHeight
      }

      if (this.isFixedLayout) {
        const firstRow = body.querySelector('.ui-table__row--body')
        if (firstRow) {
          const cells = Array.from(firstRow.children)
          const widths = cells.map(c => c.getBoundingClientRect().width)
          const changed =
            widths.length !== this.colWidths.length ||
            widths.some((w, i) => Math.abs(w - (this.colWidths[i] || 0)) > 0.1)
          if (changed) {
            this.colWidths = widths
          }
        } else if (this.colWidths.length) {
          this.colWidths = []
        }
      } else if (this.colWidths.length) {
        this.colWidths = []
      }
    },
    headCellStyle(index, col = null) {
      if (this.isFixedLayout && this.colWidths[index] !== undefined) {
        return { width: `${this.colWidths[index]}px` }
      }
      return col ? col._style : {}
    },
    cellText(col, record) {
      const field = col._field
      return field != null ? record[field] : ''
    },
    onHeaderClick(col) {
      if (!col._isSortable) return
      const field = col._field
      let order
      if (this.sortField !== field) {
        order = 'ascend'
      } else {
        order = this.sortOrder === 'ascend' ? 'descend' : this.sortOrder === 'descend' ? null : 'ascend'
      }
      this.sortField = order ? field : null
      this.sortOrder = order
      const payload = { field: this.sortField, order }
      this.$emit('sort-change', payload)
      this.$emit('change', { sorter: payload })
    },
    getRowKey(record, index) {
      if (typeof this.rowKey === 'function') return this.rowKey(record)
      const key = record[this.rowKey]
      return key != null ? key : index
    },
    isSelected(record, index) {
      return this.selectedKeysSet.has(this.getRowKey(record, index))
    },
    emitSelection() {
      const keys = this.internalSelected.slice()
      const selectedRows = this.dataSource.filter((record, index) => keys.includes(this.getRowKey(record, index)))
      this.$emit('update:selectedRowKeys', keys)
      this.$emit('selection-change', keys, selectedRows)
    },
    handleSelection(record, index, checked, e) {
      const isShiftKey = e && e.shiftKey

      if (isShiftKey && this.lastClickedIndex != null) {
        // Shift+click: select range from lastClickedIndex to current index
        const start = Math.min(this.lastClickedIndex, index)
        const end = Math.max(this.lastClickedIndex, index)
        const rangeKeys = []
        for (let i = start; i <= end; i++) {
          rangeKeys.push(this.getRowKey(this.rows[i], i))
        }
        // Merge with existing selection (union)
        const set = new Set(this.internalSelected)
        rangeKeys.forEach(k => set.add(k))
        this.internalSelected = Array.from(set)
      } else {
        // Normal click / Cmd+click: toggle individual row
        const key = this.getRowKey(record, index)
        const set = this.internalSelected.filter(k => k !== key)
        if (checked) set.push(key)
        this.internalSelected = set
      }
      this.lastClickedIndex = index
      this.emitSelection()
    },
    onSelectionCellClick(record, index, e) {
      // Click on the checkbox <td> — MouseEvent has modifier keys
      const currentlySelected = this.isSelected(record, index)
      this.handleSelection(record, index, !currentlySelected, e)
    },
    onRowClick(record, index, e) {
      // Click on the row body — handle Shift/Cmd selection
      const isMetaKey = e.metaKey || e.ctrlKey
      const isShiftKey = e.shiftKey
      if (!isMetaKey && !isShiftKey) return
      const key = this.getRowKey(record, index)
      const currentlySelected = this.internalSelected.includes(key)
      this.handleSelection(record, index, !currentlySelected, e)
    },
    onToggleAll(checked) {
      this.internalSelected = checked ? this.rows.map((record, index) => this.getRowKey(record, index)) : []
      this.emitSelection()
    },
    onDragStart(e, row) {
      this.dragState = { fromIndex: row._index, currentIndex: row._index, record: row._record }
      e.dataTransfer.effectAllowed = 'move'

      const tr = e.currentTarget.closest('tr')
      const rect = tr.getBoundingClientRect()
      const tableEl = this.$el.querySelector('.ui-table__table')

      // Shallow-clone the full ancestor chain so scoped CSS selectors
      // (e.g. .ui-table--scroll-y .ui-table__row[data-v-xxx]) still match.
      const wrapper = this.$el.cloneNode(false)
      wrapper.style.position = 'fixed'
      wrapper.style.top = '-9999px'
      wrapper.style.left = '-9999px'
      wrapper.style.width = rect.width + 'px'
      wrapper.style.pointerEvents = 'none'

      const table = tableEl.cloneNode(false)
      const colgroup = tableEl.querySelector('colgroup')
      if (colgroup) table.appendChild(colgroup.cloneNode(true))

      const tbody = this.$refs.tableBody.cloneNode(false)
      tbody.style.overflow = 'visible'
      tbody.style.maxHeight = 'none'
      tbody.style.height = 'auto'

      const clonedRow = tr.cloneNode(true)
      clonedRow.classList.remove('ui-table__row--dragging')
      clonedRow.classList.add('ui-table__row--drag-preview')

      tbody.appendChild(clonedRow)
      table.appendChild(tbody)
      wrapper.appendChild(table)
      document.body.appendChild(wrapper)

      e.dataTransfer.setDragImage(wrapper, e.clientX - rect.left, e.clientY - rect.top)
      requestAnimationFrame(() => document.body.removeChild(wrapper))
    },
    onDragOver(e, index) {
      if (!this.dragState) return
      if (index === this.dragState.currentIndex) return
      // Only reorder once the pointer crosses the row's midpoint to prevent oscillation.
      const rect = e.currentTarget.getBoundingClientRect()
      const midY = rect.top + rect.height / 1.5
      if (index > this.dragState.currentIndex && e.clientY < midY) return
      if (index < this.dragState.currentIndex && e.clientY > midY) return
      // FLIP — snapshot "First" positions before the data changes.
      const firstRects = this.snapshotRowRects()
      const data = this.internalData.slice()
      const [moved] = data.splice(this.dragState.currentIndex, 1)
      data.splice(index, 0, moved)
      this.internalData = data
      this.dragState = { ...this.dragState, currentIndex: index }
      this.$nextTick(() => this.flipAnimateRows(firstRects))
    },
    onDragLeave(e) {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        this.dragOverIndex = null
      }
    },
    onDrop(e, toIndex) {
      if (!this.dragState) return
      const { fromIndex, record, currentIndex } = this.dragState
      this.$emit('drag-record', { record, fromIndex, toIndex: currentIndex }, e)
      this.dragState = null
      this.dragOverIndex = null
    },
    onDragEnd() {
      if (this.dragState) {
        // Drag cancelled (no drop) — revert live reorder.
        this.internalData = this.dataSource.slice()
      }
      this.dragState = null
      this.dragOverIndex = null
    },
    // FLIP helpers -------------------------------------------------------
    snapshotRowRects() {
      const rects = {}
      this.mappedRenderRows.forEach(row => {
        const refName = 'row-' + row._key
        // Vue 2: $refs for v-for are arrays; Vue 3: also arrays
        const els = this.$refs[refName]
        const el = Array.isArray(els) ? els[0] : els
        if (el) {
          // In Vue 2, el is the DOM node. In Vue 3 with <tr>, el is also the DOM node.
          const dom = el.$el || el
          rects[row._key] = dom.getBoundingClientRect()
        }
      })
      return rects
    },
    flipAnimateRows(firstRects) {
      this.mappedRenderRows.forEach(row => {
        const refName = 'row-' + row._key
        const els = this.$refs[refName]
        const el = Array.isArray(els) ? els[0] : els
        if (!el) return
        const dom = el.$el || el
        const first = firstRects[row._key]
        if (!first) return
        const last = dom.getBoundingClientRect()
        const deltaY = first.top - last.top
        if (Math.abs(deltaY) < 1) return
        // Invert: jump the row back to its old position.
        dom.style.transition = 'none'
        dom.style.transform = `translateY(${deltaY}px)`
        // Play: animate from inverted position to final position.
        requestAnimationFrame(() => {
          dom.style.transition = 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
          dom.style.transform = ''
          const onEnd = () => {
            dom.style.transition = ''
            dom.style.transform = ''
            dom.removeEventListener('transitionend', onEnd)
          }
          dom.addEventListener('transitionend', onEnd, { once: true })
        })
      })
    },
    onResizeStart(e, col, colIndex) {
      const th = e.currentTarget.closest('th')
      this.resizeState = {
        colKey: col._key,
        domIdx: (this.hasDrag ? 1 : 0) + (this.hasSelection ? 1 : 0) + colIndex,
        startX: e.clientX,
        startWidth: th.getBoundingClientRect().width,
        minWidth: typeof col.minWidth === 'number' ? col.minWidth : 40,
        reverse: col._fixed === 'right'
      }
      e.currentTarget.setPointerCapture(e.pointerId)
      document.addEventListener('pointermove', this.onResizeMove)
      document.addEventListener('pointerup', this.onResizeEnd, { once: true })
    },
    onResizeMove(e) {
      if (!this.resizeState) return
      const { colKey, startX, startWidth, minWidth, reverse } = this.resizeState
      const delta = reverse ? startX - e.clientX : e.clientX - startX
      const newWidth = Math.max(minWidth, startWidth + delta)
      // Spread into a new object so Vue detects the change (direct property
      this.columnWidths = { ...this.columnWidths, [colKey]: newWidth }

      // colWidths is stale during drag — patch the domIdx slot so sticky
      // offsets for columns AFTER this one are also correct immediately.
      const domIdx = this.resizeState.domIdx
      const next = this.colWidths.slice()
      next[domIdx] = newWidth
      this.colWidths = next
      // Re-measure so colWidths reflects the final DOM state.
      this.$nextTick(this.syncScrollbarGutter)
    },

    onResizeEnd() {
      document.removeEventListener('pointermove', this.onResizeMove)
      this.resizeState = null
    }
  }
}
</script>

<style src="./table.css" scoped></style>
