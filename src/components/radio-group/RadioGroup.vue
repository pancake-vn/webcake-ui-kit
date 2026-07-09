<template>
  <div class="ui-radio-group" :class="`ui-radio-group--${direction}`">
    <slot>
      <Radio
        v-for="opt in normalizedOptions"
        :key="opt.value"
        :value="opt.value"
        :label="opt.label"
        :disabled="opt.disabled"
      />
    </slot>
  </div>
</template>

<script>
import Radio from '../radio/Radio.vue'

export default {
  name: 'RadioGroup',
  components: { Radio },
  provide() {
    return { radioGroup: this }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  emits: ['change'],

  props: {
    value: {
      type: [String, Number, Boolean],
      default: null
    },
    options: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'vertical',
      validator: v => ['vertical', 'horizontal'].includes(v)
    }
  },
  computed: {
    normalizedOptions() {
      return this.options.map(opt =>
        typeof opt === 'string'
          ? { label: opt, value: opt, disabled: false }
          : { label: opt.label || opt.value, value: opt.value, disabled: !!opt.disabled }
      )
    }
  },
  methods: {
    select(val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style src="./radio_group.css" scoped></style>
