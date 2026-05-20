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
            'ui-select--loading': loading
          }
        ]"
        tabindex="0"
        v-bind="attrs"
        @click="toggle"
        @keydown.enter.prevent="toggle"
        @keydown.space.prevent="toggle"
      >
        <span class="ui-select__left">
          <span v-if="hasIconSlot" class="ui-select__icon">
            <slot name="icon" />
          </span>
          <span v-if="prepend" class="ui-select__prepend">{{ prepend }}</span>
          <span class="ui-select__value" :class="{ 'ui-select__value--placeholder': !selectedLabel }">
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
          v-for="opt in normalizedOptions"
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

export default {
  name: 'Select',

  components: { Menu, SelectOption, Spinner, WkiChevronDown },

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
      default: 'default',
      validator: function (v) {
        return ['xs', 'sm', 'default', 'lg'].indexOf(v) !== -1
      }
    },
    value: {
      type: String,
      default: ''
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
    }
  },

  emits: ['change'],

  data() {
    return {
      isOpen: false,
      labelCache: {}
    }
  },

  computed: {
    normalizedOptions() {
      return this.options.map(opt =>
        typeof opt === 'string'
          ? { label: opt, value: opt, disabled: false }
          : { label: opt.label || opt.value, value: opt.value, disabled: !!opt.disabled }
      )
    },
    selectedLabel() {
      if (!this.value) return ''
      if (this.labelCache[this.value]) return this.labelCache[this.value]
      const opt = this.normalizedOptions.find(o => o.value === this.value)
      return opt ? opt.label : this.value
    },
    hasIconSlot() {
      return !!((this.$scopedSlots && this.$scopedSlots['icon']) || this.$slots['icon'])
    },
    listStyle() {
      return { maxHeight: this.listHeight + 'px' }
    }
  },

  methods: {
    onMenuChange(v) {
      this.isOpen = v
    },
    onMenuClose() {
      this.isOpen = false
    },
    select(val) {
      this.$emit('change', val)
      this.isOpen = false
    },
    registerOption(value, label) {
      this.labelCache = Object.assign({}, this.labelCache, { [value]: label })
    }
  }
}
</script>

<style src="./select.css" scoped></style>
