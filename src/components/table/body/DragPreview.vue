<template>
  <table
    class="ui-table__drag-preview"
    aria-hidden="true"
    :style="{ width: containerWidth ? containerWidth + 'px' : '100%', tableLayout: 'fixed' }"
  >
    <tbody class="ui-table__body">
      <tr class="ui-table__row" v-if="record">
        <td v-for="col in columns" :key="col.key">
          <div v-if="col.type === DRAGGABLE_COLUMN" class="wrapper-option">
            <span class="drag-handle">
              <WkiGripVertical :size="16" />
            </span>
          </div>
          <div v-else-if="col.type === SELECTION_COLUMN" class="wrapper-option" />
          <slot v-else name="bodyCell" :column="col" :text="record && record[col.dataIndex]" :record="record">
            <span>{{ record && record[col.dataIndex] }}</span>
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { WkiGripVertical } from '../../../icons'
import { SELECTION_COLUMN, DRAGGABLE_COLUMN } from '../constants.js'

export default {
  name: 'TableV2DragPreview',
  components: { WkiGripVertical },
  inject: ['tableContext'],
  data: function () {
    return {
      SELECTION_COLUMN: SELECTION_COLUMN,
      DRAGGABLE_COLUMN: DRAGGABLE_COLUMN
    }
  },
  computed: {
    record: function () {
      return this.tableContext.draggable.draggingRecord
    },
    columns: function () {
      return this.tableContext.columns.flat
    },
    containerWidth: function () {
      return this.tableContext.layout.containerWidth
    }
  }
}
</script>
