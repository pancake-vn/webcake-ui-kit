<template>
  <nav class="ui-pagination" role="navigation" :aria-label="ariaLabel" :class="{ 'ui-pagination--disabled': disabled }">
    <Button variant="ghost" :size="size" :disabled="isPrevDisabled" @click="goPrev" :label="prevLabel || ''">
      <template v-if="showIcon" #icon-left>
        <WkiChevronLeft />
      </template>
    </Button>

    <template v-for="(item, idx) in items">
      <Button
        v-if="typeof item === 'number'"
        :key="'page-' + item"
        :variant="currentPage === item ? 'outline' : 'ghost'"
        :size="size"
        :disabled="disabled"
        @click="select(item)"
      >
        {{ item }}
      </Button>
      <Button
        v-else
        :key="`ellipsis-${idx}-${item}`"
        variant="ghost"
        :size="size"
        :disabled="disabled"
        @click="onEllipsisClick(item)"
      >
        <template #icon>
          <WkiEllipsis />
        </template>
      </Button>
    </template>

    <Button variant="ghost" :size="size" :disabled="isNextDisabled" @click="goNext" :label="nextLabel || ''">
      <template v-if="showIcon" #icon-right>
        <WkiChevronRight />
      </template>
    </Button>
  </nav>
</template>

<script>
import Button from '../button/Button.vue'
import WkiChevronLeft from '../../icons/ChevronLeft.vue'
import WkiChevronRight from '../../icons/ChevronRight.vue'
import WkiEllipsis from '../../icons/Ellipsis.vue'

function range(start, end) {
  if (end < start) return []
  var r = []
  for (var i = start; i <= end; i++) r.push(i)
  return r
}

export default {
  name: 'Pagination',
  components: { Button, WkiChevronLeft, WkiChevronRight, WkiEllipsis },

  model: {
    prop: 'current',
    event: 'change'
  },

  props: {
    current: { type: Number, default: 1 },
    total: { type: Number, required: true, validator: v => v >= 0 },
    pageSize: { type: Number, default: 10, validator: v => v >= 1 },
    siblings: { type: Number, default: 1, validator: v => v >= 0 },
    boundary: { type: Number, default: 1, validator: v => v >= 0 },
    showIcon: { type: Boolean, default: false },
    prevLabel: { type: String, default: 'Previous' },
    nextLabel: { type: String, default: 'Next' },
    ariaLabel: { type: String, default: 'Pagination' },
    pageAriaLabel: { type: Function, default: null },
    disabled: { type: Boolean, default: false },
    jumpStep: { type: Number, default: 4 },
    size: {
      type: String,
      default: 'sm',
      validator: function (v) {
        return ['mini', 'xs', 'sm', 'md', 'lg', 'xl'].includes(v)
      }
    }
  },

  emits: ['change', 'update:modelValue'],

  computed: {
    totalPages: function () {
      if (this.total <= 0) return 0
      return Math.max(1, Math.ceil(this.total / this.pageSize))
    },
    currentPage: function () {
      if (this.totalPages <= 0) return 1
      return Math.max(1, Math.min(this.current, this.totalPages))
    },
    items: function () {
      return this.computeItems(this.currentPage, this.totalPages, this.siblings, this.boundary)
    },
    isPrevDisabled: function () {
      return this.disabled || this.currentPage <= 1 || this.totalPages <= 0
    },
    isNextDisabled: function () {
      return this.disabled || this.currentPage >= this.totalPages || this.totalPages <= 0
    },
    effectiveJumpStep: function () {
      return Math.max(0, Math.floor(this.jumpStep))
    }
  },

  methods: {
    // Smart pagination range — only inserts ellipses when an actual gap > 1 exists,
    // and expands the visible range on the non-elided side when current is near a boundary.
    // Output items are integers (page numbers) or the strings 'ellipsis-start' / 'ellipsis-end'.
    computeItems: function (current, total, siblings, boundary) {
      if (!total || total <= 0) return []
      var s = Math.max(0, siblings)
      var b = Math.max(0, boundary)

      // Max numbers that can render WITHOUT any ellipsis.
      // Layout: [boundary] [start-ellipsis] [current ± siblings] [end-ellipsis] [boundary]
      // Without ellipses, the visible run would need at least b + (2s + 1) + b = 2b + 2s + 1.
      // We also account for the 2 ellipsis slots (which would otherwise be page numbers): 2b + 2s + 3.
      var noEllipsisThreshold = b * 2 + s * 2 + 3
      if (total <= noEllipsisThreshold) return range(1, total)

      var leftSibling = Math.max(current - s, b + 1)
      var rightSibling = Math.min(current + s, total - b)

      // Only emit an ellipsis when the gap it covers is > 1 page (otherwise show that page).
      var showLeftEllipsis = leftSibling > b + 2
      var showRightEllipsis = rightSibling < total - b - 1

      var startPages = range(1, b)
      var endPages = range(total - b + 1, total)

      if (!showLeftEllipsis && showRightEllipsis) {
        // Current is near the start — extend the left run to fill the slot a left ellipsis would occupy.
        var leftCount = b + s * 2 + 1
        return range(1, leftCount).concat(['ellipsis-end']).concat(endPages)
      }

      if (showLeftEllipsis && !showRightEllipsis) {
        // Current is near the end — extend the right run.
        var rightCount = b + s * 2 + 1
        return startPages.concat(['ellipsis-start']).concat(range(total - rightCount + 1, total))
      }

      // Both ellipses needed (current is in the middle, and gaps on both sides are > 1)
      return startPages
        .concat(['ellipsis-start'])
        .concat(range(leftSibling, rightSibling))
        .concat(['ellipsis-end'])
        .concat(endPages)
    },

    select: function (page) {
      if (this.disabled) return
      if (this.totalPages <= 0) return
      var clamped = Math.max(1, Math.min(page, this.totalPages))
      if (clamped === this.currentPage) return
      this.$emit('change', clamped)
      this.$emit('update:modelValue', clamped)
    },

    goPrev: function () {
      if (this.isPrevDisabled) return
      this.select(this.currentPage - 1)
    },

    goNext: function () {
      if (this.isNextDisabled) return
      this.select(this.currentPage + 1)
    },

    onEllipsisClick: function (kind) {
      if (this.effectiveJumpStep <= 0 || this.disabled) return
      var delta = kind === 'ellipsis-start' ? -this.effectiveJumpStep : this.effectiveJumpStep
      this.select(this.currentPage + delta)
    },

    resolvePageAriaLabel: function (page) {
      if (typeof this.pageAriaLabel === 'function') {
        return this.pageAriaLabel(page)
      }
      return page === this.currentPage ? 'Page ' + page + ', current page' : 'Go to page ' + page
    }
  }
}
</script>

<style src="./pagination.css" scoped></style>
