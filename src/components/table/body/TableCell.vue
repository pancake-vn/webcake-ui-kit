<template>
  <td
    :class="[
      'ui-table__cell',
      isSelectionCol && 'ui-table__cell--selection',
      isSelectionCol && 'ui-table__header-cell--selection',
      column.fixed && `ui-table__cell--fixed-${column.fixed}`,
      isLastFixedLeft && 'ui-table__cell--fixed-left__last',
      isFirstFixedRight && 'ui-table__cell--fixed-right__first'
    ]"
    :style="cellStyle"
  >
    <div v-if="isSelectionCol" class="wrapper-option">
      <Checkbox :checked="isSelected" :model-value="isSelected" @change="onToggle" />
    </div>

    <div v-else-if="isDraggableCol" class="wrapper-option">
      <span class="drag-handle">
        <WkiGripVertical :size="16" />
      </span>
    </div>

    <slot
      v-if="!isSelectionCol && !isDraggableCol"
      name="bodyCell"
      :column="column"
      :text="record[column.dataIndex]"
      :record="record"
    >
      <span :class="[column.ellipsis && 'ui-table__cell--ellipsis']">
        {{ record[column.dataIndex] }}
      </span>
    </slot>
  </td>
</template>

<script>
import Checkbox from '../../checkbox/Checkbox.vue'
import { SELECTION_COLUMN, DRAGGABLE_COLUMN } from '../constants.js'
import { toCssSize } from '../../../utils/common.js'
import { WkiGripVertical } from '../../../icons'

export default {
  name: 'TableV2Cell',
  components: { Checkbox, WkiGripVertical },
  inject: ['tableContext'],
  props: {
    column: { type: Object, required: true },
    record: { type: Object, required: true },
    offset: { type: [Number, String], default: 0 }
  },
  computed: {
    isSelectionCol: function () {
      return this.column.type === SELECTION_COLUMN
    },
    isDraggableCol: function () {
      return this.column.type === DRAGGABLE_COLUMN
    },
    isLastFixedLeft: function () {
      if (this.column.fixed !== 'left') return false
      const cols = this.tableContext.columns.flat
      let lastKey = null
      for (let i = 0; i < cols.length; i++) {
        if (cols[i].fixed === 'left') lastKey = cols[i].key
      }
      return lastKey === this.column.key
    },
    isFirstFixedRight: function () {
      if (this.column.fixed !== 'right') return false
      const cols = this.tableContext.columns.flat
      for (let i = 0; i < cols.length; i++) {
        if (cols[i].fixed === 'right') return cols[i].key === this.column.key
      }
      return false
    },
    isSelected: function () {
      var key = this.record[this.tableContext.layout.rowKey]
      return this.tableContext.selection.selectedRowKeys.indexOf(key) !== -1
    },
    cellStyle: function () {
      const res = { textAlign: this.column.align }
      if (this.column.fixed) {
        res.position = 'sticky'
        if (this.column.fixed === 'left') {
          res.left = toCssSize(this.offset)
        } else if (this.column.fixed === 'right') {
          res.right = toCssSize(this.offset)
        }
      }
      return res
    }
  },
  methods: {
    onToggle: function (checked, nativeEvent) {
      const key = this.record[this.tableContext.layout.rowKey]
      const keys = [...this.tableContext.selection.selectedRowKeys]
      const idx = keys.indexOf(key)

      if (checked && idx === -1) {
        keys.push(key)
      } else if (!checked && idx !== -1) {
        keys.splice(idx, 1)
      }

      this.tableContext.actions.select(keys, {
        type: 'row',
        record: this.record,
        selected: checked,
        nativeEvent: nativeEvent
      })
    }
  }
}
</script>
