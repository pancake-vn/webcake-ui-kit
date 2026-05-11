<template>
  <div
    class="ui-select"
    :class="[
      `ui-select--${size}`,
      {
        'ui-select--open': isOpen,
        'ui-select--disabled': disabled,
        'ui-select--error': error,
        'ui-select--loading': loading
      }
    ]"
    tabindex="0"
    @click="toggle"
    @keydown.esc="close"
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

    <span v-if="loading" class="ui-select__spinner" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-dasharray="28"
          stroke-dashoffset="10"
        />
      </svg>
    </span>
    <span v-else class="ui-select__chevron">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 6L8 10L12 6"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>

    <div v-if="isOpen" class="ui-select__dropdown" @click.stop>
      <div v-if="canScrollUp" class="ui-select__scroll-indicator ui-select__scroll-indicator--up">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 10L8 6L12 10"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div
        ref="options"
        class="ui-select__options"
        :style="listHeight ? { maxHeight: listHeight + 'px' } : {}"
        @scroll="updateScrollIndicators"
      >
        <slot>
          <select-option
            v-for="opt in normalizedOptions"
            :key="opt.value"
            :value="opt.value"
            :label="opt.label"
            :disabled="opt.disabled"
          />
        </slot>
      </div>
      <div v-if="canScrollDown" class="ui-select__scroll-indicator ui-select__scroll-indicator--down">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import SelectOption from '../select_option/SelectOption.vue'

export default {
  name: 'Select',

  components: { SelectOption },

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
        return ['mini', 'sm', 'default', 'lg'].includes(v)
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
      canScrollUp: false,
      canScrollDown: false,
      labelCache: {}
    }
  },

  watch: {
    isOpen(val) {
      if (val) {
        this.$nextTick(this.updateScrollIndicators)
      } else {
        this.canScrollUp = false
        this.canScrollDown = false
      }
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
    }
  },

  mounted() {
    document.addEventListener('click', this.handleOutsideClick)
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
  },

  methods: {
    toggle() {
      if (this.disabled || this.loading) return
      this.isOpen = !this.isOpen
    },
    close() {
      this.isOpen = false
    },
    select(val) {
      this.$emit('change', val)
      this.close()
    },
    registerOption(value, label) {
      this.labelCache = Object.assign({}, this.labelCache, { [value]: label })
    },
    updateScrollIndicators() {
      const el = this.$refs.options
      if (!el) return
      this.canScrollUp = el.scrollTop > 0
      this.canScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight
    },
    handleOutsideClick(e) {
      if (!this.$el.contains(e.target)) {
        this.close()
      }
    }
  }
}
</script>

<style src="./select.css" scoped></style>
