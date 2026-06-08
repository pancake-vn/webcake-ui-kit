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
    }
  },

  emits: ['change', 'update:modelValue'],

  data() {
    return {
      isOpen: false,
      labelCache: {}
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
    normalizedOptions() {
      return this.options.map(opt =>
        typeof opt === 'string'
          ? { label: opt, value: opt, disabled: false }
          : { label: opt.label || opt.value, value: opt.value, disabled: !!opt.disabled }
      )
    },
    selectedLabel() {
      if (!this.effectiveValue) return ''
      if (this.labelCache[this.effectiveValue]) return this.labelCache[this.effectiveValue]
      const opt = this.normalizedOptions.find(o => o.value === this.effectiveValue)
      if (opt) return opt.label
      return this._findLabelInSlot(this.effectiveValue) || this.effectiveValue
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
      this.$emit('update:modelValue', val)
      this.isOpen = false
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
