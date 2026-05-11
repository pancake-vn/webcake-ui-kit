<template>
  <label :class="['ui-checkbox-group', `ui-checkbox-group--${layout}`, disabled && 'ui-checkbox-group--disabled']">
    <Checkbox
      class="ui-checkbox-group__box"
      :checked="isChecked"
      :error="error"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="ui-checkbox-group__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
import Checkbox from '../checkbox/Checkbox.vue'

export default {
  name: 'CheckboxGroup',
  components: { Checkbox },
  model: { prop: 'checked', event: 'change' },
  props: {
    layout: {
      type: String,
      default: 'inline',
      validator: v => ['inline', 'block'].includes(v)
    },
    checked: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    error: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    label: { type: String, default: '' }
  },
  emits: ['change', 'update:modelValue'],
  computed: {
    isChecked() {
      return this.modelValue !== undefined ? this.modelValue : this.checked
    }
  },
  methods: {
    onChange(next) {
      this.$emit('change', next)
      this.$emit('update:modelValue', next)
    }
  }
}
</script>

<style src="./checkbox-group.css" scoped></style>
