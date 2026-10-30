<template>
  <div class="ui-select-tree__list" :style="listStyle">
    <div v-for="node in nodes" :key="node.key" class="ui-select-tree__option">
      <div class="ui-select-tree__indent-wrapper" v-if="node.level > 0">
        <span
          v-for="i in node.level"
          :key="i"
          :class="['ui-select-tree__indent', `ui-select-tree__indent--${optionSize}`]"
        >
          <WkDivider direction="vertical" />
        </span>
      </div>
      <WkMenuItem
        :label="node.label"
        :active="node.selected && !checkable"
        :disabled="node.disabled"
        :size="optionSize"
        @click="onNodeClick(node)"
      >
        <template #prefix>
          <span class="ui-select-tree__switcher" @click.stop="onSwitcher(node)">
            <WkiChevronRight
              v-if="node.hasChildren"
              :size="16"
              class="ui-select-tree__switcher-icon"
              :class="{ 'ui-select-tree__switcher-icon--open': node.expanded }"
            />
          </span>
          <span v-if="checkable" class="ui-select-tree__checkbox">
            <WkCheckbox
              :model-value="node.checked || node.halfChecked"
              :icon-type="node.halfChecked && !node.checked ? 'minus' : 'default'"
              :disabled="node.disabled"
              tabindex="-1"
            />
          </span>
        </template>

        <template v-if="!checkable && node.selected && showChecked" #suffix>
          <WkiCheck :size="16" />
        </template>
      </WkMenuItem>
    </div>
  </div>
</template>

<script>
import WkMenuItem from '../menuitem/MenuItem.vue'
import WkiChevronRight from '../../icons/ChevronRight.vue'
import WkiCheck from '../../icons/Check.vue'
import WkCheckbox from '../checkbox/Checkbox.vue'
import WkDivider from '../divider/Divider.vue'

export default {
  name: 'TreeList',

  components: { WkMenuItem, WkiChevronRight, WkiCheck, WkCheckbox, WkDivider },

  inject: {
    treeSelectContext: { default: null }
  },

  props: {
    optionSize: {
      type: String,
      default: 'md',
      validator: v => ['sm', 'md', 'lg'].indexOf(v) !== -1
    },
    showChecked: {
      type: Boolean,
      default: true
    },
    listHeight: {
      type: [Number, String],
      default: 256
    }
  },

  emits: [],

  computed: {
    ctx() {
      return this.treeSelectContext || {}
    },
    nodes() {
      return this.ctx.flattenNodes || []
    },
    checkable() {
      return !!this.ctx.checkable
    },
    listStyle() {
      var h = this.listHeight
      return { maxHeight: typeof h === 'number' ? h + 'px' : h }
    }
  },

  methods: {
    onNodeClick(node) {
      if (node.disabled) return
      if (this.ctx.actions && this.ctx.actions.onSelect) {
        this.ctx.actions.onSelect(node.key)
      }
    },
    onSwitcher(node) {
      if (!node.hasChildren) return
      if (this.ctx.actions && this.ctx.actions.onExpand) {
        this.ctx.actions.onExpand(node.key)
      }
    }
  }
}
</script>

<style src="./select-tree.css" scoped></style>
