<template>
  <span :class="['ui-checkbox', error && 'ui-checkbox--error', disabled && 'ui-checkbox--disabled']">
    <input
      ref="input"
      type="checkbox"
      class="ui-checkbox__input"
      :checked="isChecked"
      :disabled="disabled"
      v-bind="$attrs"
      @change="onChange"
    />
    <span class="ui-checkbox__box" aria-hidden="true">
      <WkiCheck v-if="isChecked" :size="14" />
    </span>
  </span>
</template>

<script>
import WkiCheck from '../../icons/Check.vue'

export default {
  name: 'Checkbox',
  components: { WkiCheck },
  inheritAttrs: false,
  model: { prop: 'checked', event: 'change' },
  props: {
    checked: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    error: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  emits: ['change', 'update:modelValue'],
  computed: {
    isChecked() {
      return this.modelValue !== undefined ? this.modelValue : this.checked
    }
  },
  methods: {
    onChange(e) {
      const next = e.target.checked
      this.$emit('change', next, e)
      this.$emit('update:modelValue', next, e)
      this.$nextTick(() => {
        if (this.$refs.input) {
          this.$refs.input.checked = this.isChecked
        }
      })
    }
  }
}
</script>

<style src="./checkbox.css" scoped></style>
