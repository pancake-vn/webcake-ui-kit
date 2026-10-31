<template>
  <Menu
    ref="menuRef"
    :open="mergedOpen"
    :disabled="disabled"
    :placement="placement"
    :offset="4"
    :anchor-width="resolveAnchor"
    :close-on-select="false"
    :width="overlayWidth"
    @change="onMenuOpenChange"
    :overlay-class-name="overlayClassName"
    :overlay-style="overlayStyle"
  >
    <template #trigger="{ toggle, isOpen: open, attrs, triggerRef }">
      <div
        :ref="triggerRef"
        class="ui-base-select"
        :class="[
          { 'ui-base-select--open': open },
          { 'ui-base-select--disabled': disabled },
          { 'ui-base-select--error': error },
          { 'ui-base-select--loading': loading },
          { 'ui-base-select--multiple': ['multiple', 'tags'].includes(mode) },
          `ui-base-select--${size}`,
          inheritedClass
        ]"
        :tabindex="disabled || allowSearch ? -1 : 0"
        v-bind="mergeAttrs(attrs)"
        @click="handleTriggerClick(toggle)"
        @keydown.enter.prevent="handleKeydown(toggle)"
        @keydown.space.prevent="handleKeydown(toggle)"
      >
        <span class="ui-base-select__body">
          <span v-if="hasIconSlot()" class="ui-base-select__icon">
            <slot name="icon" />
          </span>
          <template v-if="['multiple', 'tags'].includes(mode)">
            <div v-if="displayValues.length > 0" class="ui-base-select__tags">
              <WkTag
                v-for="item in displayValues"
                :key="item.value"
                :size="tagSize"
                type="default"
                :label="item.label"
                :closable="!disabled"
                @close="handleRemoveTag(item.value)"
              />
            </div>
            <input
              v-if="allowSearch"
              ref="searchInput"
              class="ui-base-select__search"
              type="text"
              :value="searchValue"
              :placeholder="!displayValues.length ? placeholder : ''"
              @input="onSearchInput"
              @click.stop="handleSearchClick"
              @keydown="onSearchKeydown"
            />
            <span v-else-if="!displayValues.length" class="ui-base-select__placeholder">{{ placeholder }}</span>
          </template>
          <template v-else>
            <input
              v-if="allowSearch"
              ref="searchInput"
              class="ui-base-select__search ui-base-select__search--single"
              type="text"
              :value="open ? searchValue : hasValue ? displayValues[0].label : ''"
              :placeholder="open ? (hasValue ? displayValues[0].label : placeholder) : hasValue ? '' : placeholder"
              @input="onSearchInput"
              @click.stop="handleSearchClick"
              @keydown="onSearchKeydown"
            />
            <span v-else class="ui-base-select__value" :class="{ 'ui-base-select__value--placeholder': !hasValue }">
              {{ hasValue ? displayValues[0].label : placeholder }}
            </span>
          </template>
        </span>

        <span class="ui-base-select__suffix">
          <Spinner v-if="loading" type="mirrored" size="sm" />
          <button v-else-if="showClearBtn" class="ui-base-select__clear" tabindex="-1" @click.stop="handleClear">
            <WkiX :size="12" />
          </button>
          <span v-else class="ui-base-select__arrow" :class="{ 'ui-base-select__arrow--open': open }">
            <WkiChevronDown :size="16" />
          </span>
        </span>
      </div>
    </template>

    <slot name="contentHeader"></slot>
    <component
      v-if="optionList && !isEmpty"
      :is="optionList"
      :optionSize="optionSize"
      :showTooltip="showTooltip"
      :listHeight="listHeight"
      :showChecked="showChecked"
    />
    <div class="ui-base-select__empty" v-else>
      <img
        src="https://content.pancake.vn/web-media-262/2e/2a/0c/96/c2b58ae9f06c4dc2a3b83016e56d5b4132ff40637862ba23435e43a0-w:224-h:224-l:3927-t:image/png.png"
        alt=""
      />
      <span>{{ emptyText }}</span>
    </div>
    <slot name="contentFooter"></slot>
  </Menu>
</template>

<script>
import Menu from '../menu/Menu.vue'
import Spinner from '../spinner/Spinner.vue'
import WkiChevronDown from '../../icons/ChevronDown.vue'
import WkiX from '../../icons/X.vue'
import WkTag from '../tag/Tag.vue'

export default {
  name: 'BaseSelect',

  inheritAttrs: false,

  components: { Menu, Spinner, WkiChevronDown, WkiX, WkTag },

  props: {
    open: {
      default: undefined
    },
    defaultOpen: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Chọn...'
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    searchValue: {
      default: undefined
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'single',
      validator: v => ['single', 'multiple', 'tags'].includes(v)
    },
    displayValues: {
      type: Array,
      default: () => []
    },
    optionList: {
      type: [Object, Function],
      default: null
    },
    size: {
      type: String,
      default: 'md',
      validator: function (v) {
        return ['xs', 'sm', 'md', 'lg'].indexOf(v) !== -1
      }
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: 'Chưa có dữ liệu'
    },
    optionSize: {
      type: String,
      default: 'md',
      validator: v => ['sm', 'md', 'lg'].indexOf(v) !== -1
    },
    showTooltip: {
      type: Boolean,
      default: false
    },
    showChecked: {
      type: Boolean,
      default: false
    },
    listHeight: {
      type: [Number, String],
      default: 256
    },
    overlayWidth: { type: [String, Number], default: null },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    overlayClassName: {
      type: String,
      default: ''
    },
    overlayStyle: { type: [Object, Array], default: null }
  },

  emits: ['update:open', 'dropdownVisibleChange', 'search', 'update:searchValue', 'clear', 'deselect', 'enterSearch'],

  data() {
    return {
      innerOpen: this.defaultOpen,
      isFocused: false
    }
  },

  computed: {
    mergedOpen() {
      return this.open !== undefined ? this.open : this.innerOpen
    },
    hasValue() {
      return Array.isArray(this.displayValues) && this.displayValues.length > 0
    },
    showClearBtn() {
      return this.allowClear && !this.disabled && this.hasValue && this.innerOpen
    },
    tagSize() {
      if (['xs', 'sm'].includes(this.size)) return 'sm'
      return 'md'
    },
    allowSearch() {
      return this.showSearch || this.mode === 'tags'
    },
    resolveAnchor() {
      return !this.overlayWidth
    },
    inheritedClass() {
      if (!this.$vnode) return [] // Vue 3: class is in $attrs, handled by mergeAttrs
      var classes = []
      var node = this.$vnode
      while (node) {
        var d = node.data
        if (d) {
          if (d.staticClass) classes.push(d.staticClass)
          if (d.class) classes.push(d.class)
        }
        node = node.context && node.context.$vnode
      }
      return classes
    }
  },

  methods: {
    hasIconSlot() {
      return !!((this.$scopedSlots && this.$scopedSlots['icon']) || this.$slots['icon'])
    },
    mergeAttrs(slotAttrs) {
      return Object.assign({}, this.$attrs, slotAttrs)
    },
    setOpen(val) {
      if (this.disabled) return
      this.innerOpen = val
      this.$emit('update:open', val)
      this.$emit('dropdownVisibleChange', val)
      if (!val) {
        this.innerSearchValue = ''
        this.$emit('search', '')
        // Prevent focusMixin from restoring focus to the search input after close animation
        if (this.$refs.menuRef) this.$refs.menuRef.fmRestoreTarget = null
        this.$nextTick(() => {
          if (this.$refs.searchInput) this.$refs.searchInput.blur()
        })
      }
    },
    onMenuOpenChange(val) {
      this.setOpen(val)
    },
    handleTriggerClick(toggle) {
      if (this.disabled || this.loading) return
      if (this.allowSearch) {
        if (!this.mergedOpen) this.setOpen(true)
        this.$nextTick(() => {
          if (this.$refs.searchInput) this.$refs.searchInput.focus()
        })
      } else {
        toggle()
      }
    },
    handleKeydown(toggle) {
      if (this.disabled || this.loading) return
      toggle()
    },
    handleSearchClick() {
      if (!this.mergedOpen) this.setOpen(true)
    },
    onSearchInput(e) {
      var val = e.target.value
      this.$emit('search', val)
      this.$emit('update:searchValue', val)
      if (!this.mergedOpen) this.setOpen(true)
    },
    onSearchKeydown(e) {
      if (e.key === ' ') {
        e.stopPropagation()
        return
      }
      if (e.key === 'Enter' && ['multiple', 'tags'].includes(this.mode) && this.searchValue) {
        e.preventDefault()
        e.stopPropagation()
        if (!e.isComposing) this.$emit('enterSearch', this.searchValue)
        return
      }
      if (e.key === 'Backspace' && ['multiple', 'tags'].includes(this.mode) && !this.mergedSearchValue) {
        var values = this.displayValues
        if (values.length > 0 && !this.searchValue) {
          this.$emit('deselect', values[values.length - 1].value)
        }
      } else if (e.key === 'Escape') {
        this.setOpen(false)
      }
    },
    handleClear(e) {
      e.stopPropagation()
      this.$emit('clear')
      this.$nextTick(() => {
        if (this.$refs.searchInput) this.$refs.searchInput.focus()
      })
    },
    handleRemoveTag(val) {
      this.$emit('deselect', val)
    },
    focus() {
      if (this.$refs.searchInput) {
        this.$refs.searchInput.focus()
      } else if (this.$el) {
        var el = this.$el.querySelector('.ui-base-select')
        if (el) el.focus()
      }
    },
    blur() {
      if (this.$refs.searchInput) {
        this.$refs.searchInput.blur()
      }
    }
  }
}
</script>

<style src="./base-select.css" scoped></style>
