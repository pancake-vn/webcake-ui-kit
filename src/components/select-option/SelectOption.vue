<template>
  <div
    v-show="!isHidden"
    class="ui-select-option"
    :class="[
      effectiveSize === 'sm' ? 'ui-select-option--sm' : null,
      effectiveSize === 'md' ? 'ui-select-option--md' : null,
      effectiveSize === 'lg' ? 'ui-select-option--lg' : null,
      variant === 'destructive' ? 'ui-select-option--destructive' : null,
      isDisabled ? 'ui-select-option--disabled' : null,
      isSelected ? 'ui-select-option--selected' : null
    ]"
    role="option"
    :aria-selected="isSelected ? 'true' : 'false'"
    :aria-disabled="isDisabled ? 'true' : null"
    @click="handleClick"
  >
    <span v-if="hasPrefix()" class="ui-select-option__prefix">
      <slot name="prefix" />
    </span>
    <span class="ui-select-option--label">
      <slot>{{ label || value }}</slot>
    </span>
    <span v-if="hasSuffix()" class="ui-select-option__suffix">
      <slot name="suffix" />
    </span>
    <WkiCheck
      v-if="isSelected && (isMultiMode || isShowChecked) && children.length === 0"
      :size="16"
      color="var(--muted-fg)"
    />

    <Dropdown v-if="children.length > 0" :placement="placement" :width="width || 280" :offset="offset">
      <div class="expand-trigger">
        <WkiChevronRight :size="16" />
      </div>
      <template #overlay>
        <div class="ui-select__list">
          <SelectOption
            v-for="opt in children"
            :key="opt.value"
            :value="opt.value"
            :label="opt.label"
            :disabled="opt.disabled"
            :children="opt.children"
            :placement="opt.placement"
            :width="opt.width"
            :offset="opt.offset"
          />
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script>
import { WkiCheck, WkiChevronRight } from '../../icons'
import Dropdown from '../dropdown/Dropdown.vue'
export default {
  name: 'SelectOption',

  components: {
    WkiCheck,
    Dropdown,
    WkiChevronRight
  },

  inject: {
    select: { default: null }
  },

  props: {
    value: {
      type: [String, Number],
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: null,
      validator: function (v) {
        return v === null || ['sm', 'md', 'lg'].indexOf(v) !== -1
      }
    },
    variant: {
      type: String,
      default: 'default',
      validator: function (v) {
        return ['default', 'destructive'].indexOf(v) !== -1
      }
    },
    children: {
      type: Array,
      default: () => []
    },
    placement: {
      type: String,
      default: 'right-start'
    },
    width: {
      type: [String, Number],
      default: null
    },
    offset: {
      type: [String, Number],
      default: null
    }
  },

  emits: [],

  mounted() {
    this._registerLabel()
    if (this.select) this.select.setSlotOptionVisible(this.value, !this.isHidden)
  },

  updated() {
    this._registerLabel()
  },

  beforeUnmount() {
    if (this.select) this.select.removeSlotOption(this.value)
  },

  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle, vue/no-dupe-keys
  beforeDestroy() {
    if (this.select) this.select.removeSlotOption(this.value)
  },
  watch: {
    isHidden(val) {
      if (this.select) this.select.setSlotOptionVisible(this.value, !val)
    }
  },

  computed: {
    effectiveSize() {
      // explicit prop wins; otherwise inherit from parent Select; else regular
      return this.size || (this.select && (this.select.optionSize || this.select.size)) || 'md'
    },
    isHidden() {
      if (!this.select || !this.select.filterText) return false
      var q = this.select.filterText.toLowerCase()
      var label = (this.select.labelCache && this.select.labelCache[this.value]) || this.label || String(this.value)
      if (typeof this.select.filterOption === 'function') {
        return !this.select.filterOption(this.select.filterText, { label: label, value: this.value })
      }
      return label.toLowerCase().indexOf(q) === -1
    },
    isSelected() {
      if (!this.select) return false
      var val = this.select.effectiveValue

      const isMatch = v => {
        if (this.select.isMultiMode) {
          return Array.isArray(val) && val.indexOf(v) !== -1
        }
        return val !== undefined && val === v
      }

      if (isMatch(this.value)) return true
      if (this.select.isMultiMode) return false

      const checkChildren = children => {
        if (!children || !children.length) return false
        for (let i = 0; i < children.length; i++) {
          if (isMatch(children[i].value)) return true
          if (checkChildren(children[i].children)) return true
        }
        return false
      }

      return checkChildren(this.children)
    },
    isDisabled() {
      return this.disabled || !!(this.select && this.select.disabled)
    },
    isMultiMode() {
      return !!(this.select && this.select.isMultiMode)
    },
    isShowChecked() {
      return !!(this.select && this.select.showChecked)
    }
  },

  methods: {
    hasPrefix() {
      return !!((this.$scopedSlots && this.$scopedSlots.prefix) || this.$slots.prefix)
    },
    hasSuffix() {
      return !!((this.$scopedSlots && this.$scopedSlots.suffix) || this.$slots.suffix)
    },
    _registerLabel() {
      if (!this.select) return
      var labelEl = this.$el && this.$el.querySelector('.ui-select-option--label')
      var slotText = labelEl ? labelEl.textContent.trim() : ''
      var labelText = slotText || this.label || String(this.value)
      this.select.registerOption(this.value, labelText)
    },
    handleClick() {
      if (this.isDisabled) return
      if (this.select && typeof this.select.select === 'function') {
        this.select.select(this.value)
      }
    }
  }
}
</script>

<style src="./select_option.css" scoped></style>
