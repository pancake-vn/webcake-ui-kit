<template>
  <Menu
    :open="isOpen"
    :disabled="disabled || loading"
    placement="bottom-start"
    :offset="4"
    :anchor-width="true"
    :close-on-select="false"
    @change="onMenuChange"
    @close="onMenuClose"
  >
    <template #trigger="{ toggle, isOpen: open, attrs, triggerRef }">
      <div
        :ref="triggerRef"
        class="ui-select"
        :class="[
          `ui-select--${size}`,
          {
            'ui-select--open': open,
            'ui-select--disabled': disabled,
            'ui-select--error': error,
            'ui-select--loading': loading,
            'ui-select--multiple': isMultiMode,
            'ui-select--searchable': isSearchable
          }
        ]"
        :tabindex="isSearchable ? -1 : 0"
        v-bind="attrs"
        @click="isSearchable ? openIfClosed() : toggle()"
        @keydown.enter.prevent="toggle()"
        @keydown.space.prevent="toggle()"
      >
        <span class="ui-select__left">
          <span v-if="hasIconSlot" class="ui-select__icon">
            <slot name="icon" />
          </span>
          <span v-if="prepend" class="ui-select__prepend">{{ prepend }}</span>
          <span v-if="isMultiMode" class="ui-select__tags">
            <Tag
              v-for="item in selectedItems"
              :key="item.value"
              :size="tagSize"
              type="default"
              :label="item.label"
              :closable="!disabled"
              @close="deselectItem(item.value)"
            />
            <input
              v-if="isSearchable"
              ref="searchInput"
              class="ui-select__search"
              type="text"
              :value="filterText"
              :placeholder="!selectedItems.length ? placeholder : ''"
              @input="onFilterInput"
              @click.stop="openIfClosed"
              @keydown.stop="onSearchKeydown"
            />
          </span>
          <input
            v-else-if="isSearchable"
            ref="searchInput"
            class="ui-select__search ui-select__search--single"
            type="text"
            :value="open ? filterText : selectedLabel"
            :placeholder="open ? selectedLabel || placeholder : !selectedLabel ? placeholder : ''"
            @input="onFilterInput"
            @click.stop="openIfClosed"
            @keydown.stop="onSearchKeydown"
          />
          <span v-else class="ui-select__value" :class="{ 'ui-select__value--placeholder': !selectedLabel }">
            {{ selectedLabel || placeholder }}
          </span>
        </span>
        <Spinner v-if="loading" type="mirrored" size="sm" />
        <span v-else class="ui-select__chevron">
          <WkiChevronDown :size="16" />
        </span>
      </div>
    </template>
    <div class="ui-select__list" :style="listStyle">
      <slot>
        <SelectOption
          v-for="opt in filteredOptions"
          :key="opt.value"
          :value="opt.value"
          :label="opt.label"
          :disabled="opt.disabled"
        />
      </slot>
    </div>
  </Menu>
</template>

<script>
import WkiChevronDown from '../../icons/ChevronDown.vue'
import Menu from '../menu/Menu.vue'
import SelectOption from '../select-option/SelectOption.vue'
import Spinner from '../spinner/Spinner.vue'
import Tag from '../tag/Tag.vue'

export default {
  name: 'Select',

  components: { Menu, SelectOption, Spinner, WkiChevronDown, Tag },

  provide() {
    return { select: this }
  },

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    size: {
      type: String,
      default: 'md',
      validator: function (v) {
        return ['xs', 'sm', 'md', 'lg'].indexOf(v) !== -1
      }
    },
    value: {
      type: [String, Array],
      default: null
    },
    modelValue: {
      default: null
    },
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: 'Select an item'
    },
    prepend: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    listHeight: {
      type: Number,
      default: 256
    },
    mode: {
      type: String,
      default: 'single',
      validator: function (v) {
        return ['single', 'multiple', 'tags'].includes(v)
      }
    },
    searchable: {
      type: Boolean,
      default: false
    },
    filterOption: {
      type: Function,
      default: null
    }
  },

  emits: ['change', 'update:modelValue'],

  data() {
    return {
      isOpen: false,
      labelCache: {},
      filterText: '',
      tagOptions: []
    }
  },

  mounted() {
    this._syncSlotLabels()
  },

  updated() {
    this._syncSlotLabels()
  },

  computed: {
    effectiveValue() {
      return this.modelValue !== null ? this.modelValue : this.value
    },
    isMultiMode() {
      return this.mode === 'multiple' || this.mode === 'tags'
    },
    isSearchable() {
      return this.mode === 'tags' || this.searchable || !!this.filterOption
    },
    tagSize() {
      if (this.size === 'sm' || this.size === 'md') return this.size
      return 'sm'
    },
    normalizedOptions() {
      var base = this.mode === 'tags' ? this.options.concat(this.tagOptions) : this.options
      return base.map(function (opt) {
        return typeof opt === 'string'
          ? { label: opt, value: opt, disabled: false }
          : { label: opt.label || opt.value, value: opt.value, disabled: !!opt.disabled }
      })
    },
    filteredOptions() {
      if (!this.filterText) return this.normalizedOptions
      if (this.filterOption) {
        return this.normalizedOptions.filter(opt => this.filterOption(this.filterText, opt))
      }
      var q = this.filterText.toLowerCase()
      return this.normalizedOptions.filter(function (opt) {
        return opt.label.toLowerCase().indexOf(q) !== -1
      })
    },
    selectedLabel() {
      if (this.isMultiMode) return ''
      if (!this.effectiveValue) return ''
      if (this.labelCache[this.effectiveValue]) return this.labelCache[this.effectiveValue]
      const opt = this.normalizedOptions.find(o => o.value === this.effectiveValue)
      if (opt) return opt.label
      return this._findLabelInSlot(this.effectiveValue) || this.effectiveValue
    },
    selectedItems() {
      if (!this.isMultiMode) return []
      var values = Array.isArray(this.effectiveValue) ? this.effectiveValue : []
      var self = this
      return values.map(function (v) {
        var opt = self.normalizedOptions.find(function (o) {
          return o.value === v
        })
        return { value: v, label: opt ? opt.label : self.labelCache[v] || v }
      })
    },
    hasIconSlot() {
      return !!((this.$scopedSlots && this.$scopedSlots['icon']) || this.$slots['icon'])
    },
    listStyle() {
      return { maxHeight: this.listHeight + 'px' }
    }
  },

  watch: {
    isOpen: function (v) {
      if (!v) {
        this.filterText = ''
      } else if (this.isSearchable) {
        var self = this
        // Double nextTick: Menu's handleOpen also uses $nextTick to call _fmFocus(float).
        // Our first tick runs before Menu's, so Menu steals focus back. The second tick
        // runs after Menu's floating-panel focus, letting us reclaim it for the input.
        this.$nextTick(function () {
          self.$nextTick(function () {
            if (self.$refs.searchInput) self.$refs.searchInput.focus()
          })
        })
      }
    }
  },

  methods: {
    onMenuChange(v) {
      this.isOpen = v
    },
    onMenuClose() {
      this.isOpen = false
    },
    openIfClosed() {
      if (this.disabled || this.loading) return
      if (!this.isOpen) this.isOpen = true
    },
    onFilterInput(e) {
      this.filterText = e.target.value
      if (!this.isOpen) this.isOpen = true
    },
    onSearchKeydown(e) {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (this.mode === 'tags' && this.filterText.trim()) {
          const text = this.filterText.trim()
          const existing = this.normalizedOptions.find(function (o) {
            return o.label.toLowerCase() === text.toLowerCase() || o.value === text
          })
          const val = existing ? existing.value : text
          if (!existing) {
            this.tagOptions = this.tagOptions.concat([{ label: text, value: text, disabled: false }])
          }
          const current = Array.isArray(this.effectiveValue) ? this.effectiveValue.slice() : []
          if (current.indexOf(val) === -1) {
            current.push(val)
            this.$emit('change', current)
            this.$emit('update:modelValue', current)
          }
          this.filterText = ''
        } else if (!this.isOpen) {
          this.isOpen = true
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        this.isOpen = false
      } else if (e.key === 'Backspace' && this.isMultiMode && !this.filterText) {
        const current = Array.isArray(this.effectiveValue) ? this.effectiveValue.slice() : []
        if (current.length > 0) {
          const removed = current[current.length - 1]
          current.pop()
          this.$emit('change', current)
          this.$emit('update:modelValue', current)
          if (this.mode === 'tags') {
            this.tagOptions = this.tagOptions.filter(function (o) {
              return o.value !== removed
            })
          }
        }
      }
    },
    select(val) {
      if (this.isMultiMode) {
        var current = Array.isArray(this.effectiveValue) ? this.effectiveValue.slice() : []
        var idx = current.indexOf(val)
        if (idx === -1) current.push(val)
        else current.splice(idx, 1)
        this.$emit('change', current)
        this.$emit('update:modelValue', current)
        this.filterText = ''
        this.$nextTick(function () {
          if (this.$refs.searchInput) this.$refs.searchInput.focus()
        })
      } else {
        this.$emit('change', val)
        this.$emit('update:modelValue', val)
        this.isOpen = false
        this.filterText = ''
        this.$nextTick(function () {
          if (this.$refs.searchInput) this.$refs.searchInput.blur()
        })
      }
    },
    deselectItem(val) {
      if (!this.isMultiMode) return
      var current = Array.isArray(this.effectiveValue) ? this.effectiveValue.slice() : []
      var idx = current.indexOf(val)
      if (idx !== -1) {
        current.splice(idx, 1)
        this.$emit('change', current)
        this.$emit('update:modelValue', current)
      }
      if (this.mode === 'tags') {
        this.tagOptions = this.tagOptions.filter(function (o) {
          return o.value !== val
        })
      }
    },
    registerOption(value, label) {
      this.labelCache = Object.assign({}, this.labelCache, { [value]: label })
    },
    _slotNodes() {
      // Vue 3: $slots.default is a function; Vue 2: it's an array
      return typeof this.$slots.default === 'function' ? this.$slots.default() : this.$slots.default || []
    },
    _syncSlotLabels() {
      const collect = nodes => {
        if (!Array.isArray(nodes)) return
        nodes.forEach(vnode => {
          if (!vnode) return
          const props = vnode.props || (vnode.componentOptions && vnode.componentOptions.propsData)
          if (props && props.value != null && props.label) {
            this.registerOption(String(props.value), String(props.label))
          }
          if (Array.isArray(vnode.children)) collect(vnode.children)
        })
      }
      collect(this._slotNodes())
    },
    _findLabelInSlot(value) {
      const scan = nodes => {
        if (!Array.isArray(nodes)) return null
        for (const vnode of nodes) {
          if (!vnode) continue
          const props = vnode.props || (vnode.componentOptions && vnode.componentOptions.propsData)
          if (props && String(props.value) === String(value) && props.label) {
            return String(props.label)
          }
          if (Array.isArray(vnode.children)) {
            const found = scan(vnode.children)
            if (found) return found
          }
        }
        return null
      }
      return scan(this._slotNodes())
    }
  }
}
</script>

<style src="./select.css" scoped></style>
