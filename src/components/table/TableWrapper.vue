<template>
  <div
    class="ui-table__wrapper"
    :class="{
      'ui-table__wrapper--ping-left': isPingedLeft,
      'ui-table__wrapper--ping-right': isPingedRight
    }"
  >
    <DragPreview v-if="hasDraggable" ref="dragPreview">
      <template #bodyCell="slotData">
        <slot name="bodyCell" v-bind="slotData"></slot>
      </template>
    </DragPreview>

    <!-- Case 3: scroll.y — header và body là 2 table riêng để sticky header -->
    <template v-if="hasScrollY && !isEmpty">
      <div ref="headerRef" class="ui-table__header-hold" style="overflow: hidden">
        <table :class="tableClass" :style="fixedTableStyle">
          <TableColGroup :is-header="true" />
          <TableHeader />
        </table>
      </div>
      <div ref="bodyRef" class="ui-table__body-hold" :style="bodyHoldStyle" @scroll="handleBodyScroll">
        <table :class="tableClass" :style="fixedTableStyle">
          <TableColGroup />
          <TableBody :measureColumnWidth="hasScrollY || hasScrollX || hasSticky">
            <template #bodyCell="slotData">
              <slot name="bodyCell" v-bind="slotData"></slot>
            </template>
            <template #empty>
              <slot name="empty"></slot>
            </template>
          </TableBody>
        </table>
      </div>
    </template>

    <!-- Case 1 & 2: một table duy nhất -->
    <div v-else class="ui-table__content" ref="bodyRef" :style="contentStyle" @scroll="handleBodyScroll">
      <table :class="tableClass" :style="tableStyle">
        <TableColGroup />
        <TableHeader />
        <TableBody :measureColumnWidth="hasScrollY || hasScrollX || hasSticky" :is-empty="isEmpty">
          <template #bodyCell="slotData">
            <slot name="bodyCell" v-bind="slotData"></slot>
          </template>
          <template #empty>
            <slot name="empty"></slot>
          </template>
        </TableBody>
      </table>
    </div>
  </div>
</template>

<script>
import TableColGroup from './TableColGroup.vue'
import TableHeader from './header/TableHeader.vue'
import TableBody from './body/TableBody.vue'
import DragPreview from './body/DragPreview.vue'
import { toCssSize, getTargetScrollBarSize } from '../../utils/common'

export default {
  name: 'TableWrapper',

  data: () => {
    return {
      toCssSize,
      getTargetScrollBarSize,
      isPingedLeft: false,
      isPingedRight: false
    }
  },

  components: { TableColGroup, TableHeader, TableBody, DragPreview },

  inject: ['tableContext'],

  computed: {
    scroll: function () {
      return this.tableContext.layout.scroll
    },

    minHeight: function () {
      return this.tableContext.layout.height
    },

    isEmpty() {
      return this.tableContext.data.display.length === 0
    },

    hasScrollY: function () {
      // has fix header
      return !!(this.scroll && this.scroll.y)
    },

    hasScrollX: function () {
      // has horizontal scroll
      return !!(this.scroll && this.scroll.x)
    },

    hasSticky: function () {
      // has sticky column
      const leftOffsets = this.tableContext.sticky.leftOffsets
      const rightOffsets = this.tableContext.sticky.rightOffsets
      return Object.keys(leftOffsets).length > 0 || Object.keys(rightOffsets).length > 0
    },

    hasDraggable() {
      return !!(this.tableContext.draggable && this.tableContext.draggable.enabled)
    },

    tableClass: function () {
      return {
        'ui-table__table': true,
        'ui-table__table--bordered': this.tableContext.layout.bordered
      }
    },

    // Case 1 & 2 — wrapper có overflow-x khi scroll.x
    contentStyle: function () {
      let style = {}
      if (this.hasScrollX) {
        style = { overflow: 'auto hidden' }
      }

      if (this.minHeight > 0) {
        style.minHeight = `${this.toCssSize(this.minHeight)}`
      }
      return style
    },

    // Case 1 & 2 — table style
    tableStyle: function () {
      if (this.hasScrollX && !this.isEmpty) {
        return {
          tableLayout: 'fixed',
          width: this.toCssSize(this.scroll.x),
          minWidth: '100%'
        }
      }
      return { tableLayout: 'auto' }
    },

    // Case 3 — cả header table và body table dùng chung style này
    fixedTableStyle: function () {
      return {
        tableLayout: 'fixed',
        width: this.scroll && this.scroll.x ? this.toCssSize(this.scroll.x) : undefined,
        minWidth: '100%'
      }
    },

    // Case 3 — body scroll container
    bodyHoldStyle: function () {
      const rowHeight = this.tableContext.layout.headerHeight
      const deduct = `${this.toCssSize(rowHeight)}`

      var style = {
        overflowY: 'auto',
        maxHeight: `calc(${this.toCssSize(this.scroll.y)} - ${deduct})`,
        minHeight: this.minHeight > 0 ? `calc(${this.toCssSize(this.minHeight)} - ${deduct})` : undefined
      }
      if (this.hasScrollX) {
        style.overflowX = 'auto'
      }
      return style
    }
  },
  methods: {
    handleBodyScroll(e) {
      const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget
      if (this.$refs.headerRef) {
        this.$refs.headerRef.scrollLeft = scrollLeft
      }

      this.isPingedLeft = scrollLeft > 0
      this.isPingedRight = scrollLeft < scrollWidth - clientWidth
    },
    updateScrollState() {
      if (this.$refs.bodyRef) {
        const { width } = getTargetScrollBarSize(this.$refs.bodyRef)
        this.tableContext.layout.scrollBarWidth = width == 'auto' ? '0px' : width

        const { scrollWidth, clientWidth, scrollLeft } = this.$refs.bodyRef
        this.isPingedLeft = scrollLeft > 0
        this.isPingedRight = scrollLeft < scrollWidth - clientWidth
      }
    }
  },

  watch: {
    'tableContext.data.display.length': function () {
      this.$nextTick(() => {
        this.updateScrollState()
      })
    },
    hasScrollY() {
      this.$nextTick(() => {
        this.updateScrollState()
      })
    }
  },

  mounted: function () {
    const self = this
    this.tableContext.draggable.getPreviewEl = function () {
      return self.$refs.dragPreview && self.$refs.dragPreview.$el
    }

    this.updateScrollState()
  }
}
</script>

<style src="./style/table-wrapper.css" scoped></style>
