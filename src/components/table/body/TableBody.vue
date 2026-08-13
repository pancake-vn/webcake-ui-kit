<template>
  <tbody class="ui-table__body">
    <template v-if="measureColumnWidth">
      <tr aria-hidden="true" class="ui-table__measure-row" :style="{ height: '0', fontSize: '0' }">
        <MeasureCell v-for="(column, colIndex) in tableContext.columns.flat" :key="colIndex" :colKey="column.key" />
      </tr>
    </template>

    <template v-if="isEmpty">
      <tr class="ui-table__row">
        <td colspan="100">
          <div class="ui-table__row-empty ui-table__empty" :style="emptyStyle">
            <slot name="empty">
              <div class="wrapper-img">
                <img
                  src="https://content.pancake.vn/web-media-262/2e/2a/0c/96/c2b58ae9f06c4dc2a3b83016e56d5b4132ff40637862ba23435e43a0-w:224-h:224-l:3927-t:image/png.png"
                />
              </div>
              <span class="wk-paragraph-small">{{ emptyText }}</span>
            </slot>
          </div>
        </td>
      </tr>
    </template>

    <TableRow
      v-for="(record, rowIndex) in tableContext.data.display"
      :key="record[tableContext.layout.rowKey]"
      :record="record"
      :row-index="rowIndex"
      :is-last-item="rowIndex == tableContext.data.display.length - 1"
    >
      <template #bodyCell="slotData">
        <slot name="bodyCell" v-bind="slotData"></slot>
      </template>
    </TableRow>
  </tbody>
</template>

<script>
import Sortable from 'sortablejs'
import TableRow from './TableRow.vue'
import MeasureCell from './MeasureCell.vue'

export default {
  name: 'TableV2Body',
  components: { TableRow, MeasureCell },
  props: {
    measureColumnWidth: {
      type: Boolean,
      default: false
    },
    isEmpty: {
      type: Boolean,
      default: false
    }
  },
  inject: ['tableContext'],
  watch: {
    'tableContext.draggable.enabled': function (val) {
      val ? this._initSortable() : this._destroySortable()
    },
    'tableContext.draggable.enableAnimationFlip': function () {
      if (this.tableContext.draggable.enabled) this._initSortable()
    }
  },
  mounted: function () {
    if (this.tableContext.draggable.enabled) {
      this._initSortable()
    }
  },
  computed: {
    emptyText() {
      return this.tableContext.data.emptyText || 'Không có dữ liệu'
    },
    emptyStyle() {
      const { height, rowHeight } = this.tableContext.layout
      if (!height) return {}
      return { minHeight: `calc(${height}px - ${rowHeight}px)` }
    }
  },
  beforeUnmount: function () {
    this._destroySortable()
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle, vue/no-dupe-keys
  beforeDestroy: function () {
    this._destroySortable()
  },
  methods: {
    _initSortable: function () {
      this._destroySortable()
      const self = this
      const offset = this.measureColumnWidth ? 1 : 0
      this._sortable = Sortable.create(this.$el, {
        handle: '.drag-handle',
        draggable: '.ui-table__row',
        animation: this.tableContext.draggable.enableAnimationFlip ? 150 : 0,
        onChoose: function (evt) {
          const rowIndex = evt.oldIndex - offset
          self.tableContext.draggable.draggingRecord = self.tableContext.data.display[rowIndex] || null
        },
        setData: function (dataTransfer, dragEl) {
          let previewEl =
            typeof self.tableContext.draggable.getPreviewEl === 'function'
              ? self.tableContext.draggable.getPreviewEl()
              : null
          if (!previewEl) return
          dataTransfer.setDragImage(previewEl, 0, previewEl.offsetHeight / 2)
        },
        onEnd: function (evt) {
          self.tableContext.draggable.draggingRecord = null
          // Revert SortableJS DOM move — Vue owns the DOM
          evt.from.insertBefore(evt.item, evt.from.children[evt.oldIndex] || null)
          const oldIndex = evt.oldIndex - offset
          const newIndex = evt.newIndex - offset
          if (oldIndex === newIndex) return
          if (typeof self.tableContext.actions.reorder === 'function') {
            self.tableContext.actions.reorder(oldIndex, newIndex)
          }
        }
      })
    },
    _destroySortable: function () {
      if (this._sortable) {
        this._sortable.destroy()
        this._sortable = null
      }
    }
  }
}
</script>

<style src="../style/table-body.css" scoped></style>
