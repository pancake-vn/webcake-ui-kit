<template>
  <div
    :class="['ui-table', bordered && 'ui-table--bordered', hasVerticalScroll && 'ui-table--scroll-y']"
    :style="containerStyle"
  >
    <table class="ui-table__table" :style="tableStyle">
      <colgroup>
        <col v-if="hasSelection" class="ui-table__col ui-table__col--selection" />
        <col v-for="col in columns" :key="colKey(col)" :style="colStyle(col)" />
      </colgroup>
      <thead class="ui-table__head">
        <tr
          :class="['ui-table__row', 'ui-table__row--head', scrollbarWidth > 0 && 'ui-table__row--has-scrollbar']"
          :style="{ height: toCssSize(headerHeight) }"
        >
          <th
            v-if="hasSelection"
            class="ui-table__cell ui-table__th ui-table__cell--selection"
            :style="headCellStyle(0)"
          >
            <WkCheckbox :checked="allSelected" :disabled="!rows.length" @change="onToggleAll" />
          </th>
          <th
            v-for="(col, i) in columns"
            :key="colKey(col)"
            :class="[
              'ui-table__cell',
              'ui-table__th',
              `ui-table__cell--${alignOf(col)}`,
              isSortable(col) && 'ui-table__th--sortable'
            ]"
            :style="headCellStyle(hasSelection ? i + 1 : i, col)"
            :tabindex="isSortable(col) ? 0 : undefined"
            :aria-sort="ariaSort(col)"
            @click="onHeaderClick(col)"
            @keydown.enter.prevent="onHeaderClick(col)"
            @keydown.space.prevent="onHeaderClick(col)"
          >
            <span class="ui-table__th-inner">
              <slot name="headerCell" :column="col">{{ col.title }}</slot>
              <span
                v-if="isSortable(col)"
                :class="['ui-table__sort', sortStateOf(col) ? 'ui-table__sort--active' : 'ui-table__sort--inactive']"
                aria-hidden="true"
              >
                <WkiArrowUp v-if="sortStateOf(col) === 'ascend'" :size="16" />
                <WkiArrowDown v-else-if="sortStateOf(col) === 'descend'" :size="16" />
                <WkiArrowDownUp v-else :size="16" />
              </span>
            </span>
          </th>
          <th
            v-if="scrollbarWidth > 0"
            class="ui-table__th--scrollbar"
            :style="{ width: scrollbarWidth + 'px' }"
            aria-hidden="true"
          />
        </tr>
      </thead>
      <tbody class="ui-table__body" :style="bodyStyle">
        <tr v-if="!rows.length" class="ui-table__row ui-table__row--empty">
          <td class="ui-table__cell ui-table__empty-cell" :colspan="totalColumns">
            <slot name="emptyText">
              <WkEmpty :title="emptyText" />
            </slot>
          </td>
        </tr>
        <tr
          v-for="(record, index) in rows"
          v-else
          :key="getRowKey(record, index)"
          :class="['ui-table__row', 'ui-table__row--body', isSelected(record, index) && 'ui-table__row--selected']"
          :style="{ height: toCssSize(rowHeight) }"
          @click="onRowClick(record, index, $event)"
        >
          <td v-if="hasSelection" class="ui-table__cell ui-table__td ui-table__cell--selection">
            <WkCheckbox :checked="isSelected(record, index)" @change="checked => onToggleRow(record, index, checked)" />
          </td>
          <td
            v-for="col in columns"
            :key="colKey(col)"
            :class="[
              'ui-table__cell',
              'ui-table__td',
              `ui-table__cell--${alignOf(col)}`,
              col.ellipsis && 'ui-table__cell--ellipsis'
            ]"
            :style="colStyle(col)"
          >
            <slot name="bodyCell" :column="col" :record="record" :text="cellText(col, record)" :index="index">{{
              cellText(col, record)
            }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import WkCheckbox from '../checkbox/Checkbox.vue'
import WkEmpty from '../empty/Empty.vue'
import WkiArrowUp from '../../icons/ArrowUp.vue'
import WkiArrowDown from '../../icons/ArrowDown.vue'
import WkiArrowDownUp from '../../icons/ArrowDownUp.vue'
import { toCssSize } from '../../utils/common'

function defaultCompare(a, b) {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b))
}

export default {
  name: 'Table',
  components: { WkCheckbox, WkEmpty, WkiArrowUp, WkiArrowDown, WkiArrowDownUp },
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
    headerHeight: { type: [Number, String], default: 39 }
  },
  emits: ['change', 'sort-change', 'update:selectedRowKeys', 'selection-change', 'row-click'],
  data() {
    return {
      sortField: null,
      sortOrder: null,
      internalSelected: this.selectedRowKeys.slice(),
      scrollbarWidth: 0,
      colWidths: [],
      toCssSize
    }
  },
  computed: {
    hasSelection() {
      return !!this.rowSelection
    },
    totalColumns() {
      return this.columns.length + (this.hasSelection ? 1 : 0)
    },
    rows() {
      const data = this.dataSource.slice()
      if (!this.sortField || !this.sortOrder) return data
      const col = this.columns.find(c => this.fieldOf(c) === this.sortField)
      if (!col || !col.sorter) return data
      const cmp =
        typeof col.sorter === 'function' ? col.sorter : (a, b) => defaultCompare(a[this.sortField], b[this.sortField])
      data.sort(cmp)
      if (this.sortOrder === 'descend') data.reverse()
      return data
    },
    allSelected() {
      if (!this.rows.length) return false
      return this.rows.every((record, index) => this.internalSelected.includes(this.getRowKey(record, index)))
    },
    hasVerticalScroll() {
      return this.height != null || !!(this.scroll && this.scroll.y != null)
    },
    containerStyle() {
      const scroll = this.scroll || {}
      return scroll.x != null ? { overflowX: 'auto' } : {}
    },
    bodyStyle() {
      const scroll = this.scroll || {}
      if (this.height != null) return { height: toCssSize(this.height) }
      if (scroll.y != null) return { maxHeight: toCssSize(scroll.y) }
      return {}
    },
    tableStyle() {
      const scroll = this.scroll || {}
      return scroll.x != null ? { minWidth: toCssSize(scroll.x) } : {}
    }
  },
  watch: {
    selectedRowKeys(next) {
      this.internalSelected = (next || []).slice()
    }
  },
  mounted() {
    this.$nextTick(this.syncScrollbarGutter)
  },
  updated() {
    this.$nextTick(this.syncScrollbarGutter)
  },
  methods: {
    syncScrollbarGutter() {
      if (!this.$el) return
      const body = this.$el.querySelector('.ui-table__body')
      this.scrollbarWidth = body && this.hasVerticalScroll ? body.offsetWidth - body.clientWidth : 0

      if (this.hasVerticalScroll) {
        const firstRow = this.$el.querySelector('.ui-table__row--body')
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
      if (this.hasVerticalScroll && this.colWidths[index] !== undefined) {
        return { width: `${this.colWidths[index]}px` }
      }
      return col ? this.colStyle(col) : {}
    },
    fieldOf(col) {
      return col.dataIndex != null ? col.dataIndex : col.key
    },
    colKey(col) {
      return col.key != null ? col.key : col.dataIndex
    },
    colStyle(col) {
      if (col.width == null) return {}
      return { width: typeof col.width === 'number' ? `${col.width}px` : col.width }
    },
    alignOf(col) {
      return ['left', 'right', 'center'].includes(col.align) ? col.align : 'left'
    },
    cellText(col, record) {
      const field = this.fieldOf(col)
      return field != null ? record[field] : ''
    },
    isSortable(col) {
      return !!col.sorter
    },
    sortStateOf(col) {
      return this.sortField === this.fieldOf(col) ? this.sortOrder : null
    },
    ariaSort(col) {
      const state = this.sortStateOf(col)
      if (state === 'ascend') return 'ascending'
      if (state === 'descend') return 'descending'
      return undefined
    },
    onHeaderClick(col) {
      if (!this.isSortable(col)) return
      const field = this.fieldOf(col)
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
      return this.internalSelected.includes(this.getRowKey(record, index))
    },
    emitSelection() {
      const keys = this.internalSelected.slice()
      const selectedRows = this.dataSource.filter((record, index) => keys.includes(this.getRowKey(record, index)))
      this.$emit('update:selectedRowKeys', keys)
      this.$emit('selection-change', keys, selectedRows)
    },
    onToggleRow(record, index, checked) {
      const key = this.getRowKey(record, index)
      const set = this.internalSelected.filter(k => k !== key)
      if (checked) set.push(key)
      this.internalSelected = set
      this.emitSelection()
    },
    onToggleAll(checked) {
      this.internalSelected = checked ? this.rows.map((record, index) => this.getRowKey(record, index)) : []
      this.emitSelection()
    },
    onRowClick(record, index, event) {
      this.$emit('row-click', record, index, event)
    }
  }
}
</script>

<style src="./table.css" scoped></style>
