<template>
  <th
    :class="[
      'ui-table__header-cell',
      isSelectionCol && 'ui-table__header-cell--selection',
      isLastItem && 'ui-table__header-cell--last',
      isSelectionCol && !isHideSelectAll && 'ui-table__header-cell--selection',
      column.fixed && `ui-table__cell--fixed-${column.fixed}`,
      isLastFixedLeft && 'ui-table__cell--fixed-left__last',
      isFirstFixedRight && 'ui-table__cell--fixed-right__first'
    ]"
    :style="cellStyle"
  >
    <div v-if="isSelectionCol && !isHideSelectAll" class="wrapper-option">
      <Checkbox :checked="tableContext.selection.checkAll" @change="onCheckAll" />
    </div>

    <span v-else :class="[column.ellipsis && 'ui-table__header-cell--ellipsis']">{{ column.title }}</span>

    <slot name="drag-handle"></slot>
  </th>
</template>

<script>
import Checkbox from '../../checkbox/Checkbox.vue'
import { SELECTION_COLUMN } from '../constants.js'
import { toCssSize } from '../../../utils/common.js'

export default {
  name: 'TableV2HeaderCell',
  components: { Checkbox },
  inject: ['tableContext'],
  props: {
    column: { type: Object, required: true },
    isLastItem: { type: Boolean, default: false },
    offset: { type: [Number, String], default: 0 }
  },
  computed: {
    isHideSelectAll() {
      return this.tableContext.selection.hideSelectAll
    },
    isSelectionCol: function () {
      return this.column.type === SELECTION_COLUMN
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
    cellStyle: function () {
      const res = { textAlign: this.column.align }
      if (this.column.fixed) {
        if (this.column.fixed === 'left') {
          res.left = toCssSize(this.offset)
        } else if (this.column.fixed === 'right') {
          res.right = toCssSize(this.offset)
        }
        res.position = 'sticky'
      }
      return res
    }
  },
  methods: {
    onCheckAll: function (checked) {
      const key = this.tableContext.layout.rowKey
      const allKeys = this.tableContext.data.display.map(function (r) {
        return r[key]
      })

      this.tableContext.actions.select(checked ? allKeys : [], {
        type: checked ? 'all' : 'none',
        selected: checked
      })
    }
  }
}
</script>
