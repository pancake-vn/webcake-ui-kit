<template>
  <div
    v-show="!isHidden"
    class="ui-select-option"
    :class="[
      size === 'large' ? 'ui-select-option--large' : null,
      variant === 'destructive' ? 'ui-select-option--destructive' : null,
      isDisabled ? 'ui-select-option--disabled' : null,
      isSelected ? 'ui-select-option--selected' : null
    ]"
    role="option"
    :aria-selected="isSelected ? 'true' : 'false'"
    :aria-disabled="isDisabled ? 'true' : null"
    @click="handleClick"
  >
    <span class="ui-select-option--label">
      <slot>{{ label || value }}</slot>
    </span>
    <WkiCheck v-if="isSelected" :size="16" color="var(--muted-fg)" />
  </div>
</template>

<script>
import { WkiCheck } from '../../icons'
export default {
  name: 'SelectOption',

  components: {
    WkiCheck
  },

  inject: {
    select: { default: null }
  },

  props: {
    value: {
      type: String,
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
      default: 'regular',
      validator: function (v) {
        return ['regular', 'large'].indexOf(v) !== -1
      }
    },
    variant: {
      type: String,
      default: 'default',
      validator: function (v) {
        return ['default', 'destructive'].indexOf(v) !== -1
      }
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

  watch: {
    isHidden(val) {
      if (this.select) this.select.setSlotOptionVisible(this.value, !val)
    }
  },

  computed: {
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
      if (this.select.isMultiMode) {
        return Array.isArray(val) && val.indexOf(this.value) !== -1
      }
      return val !== undefined && val === this.value
    },
    isDisabled() {
      return this.disabled || !!(this.select && this.select.disabled)
    }
  },

  methods: {
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
