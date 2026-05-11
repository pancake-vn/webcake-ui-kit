<template>
  <label
    :class="['ui-rich-checkbox', flipped && 'ui-rich-checkbox--flipped', disabled && 'ui-rich-checkbox--disabled']"
  >
    <span class="ui-rich-checkbox__aligner">
      <Checkbox
        class="ui-rich-checkbox__box"
        :checked="isChecked"
        :error="error"
        :disabled="disabled"
        @change="onChange"
      />
    </span>
    <span class="ui-rich-checkbox__content">
      <span class="ui-rich-checkbox__label">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="hasDescription" class="ui-rich-checkbox__description">
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
  </label>
</template>

<script>
import Checkbox from '../checkbox/Checkbox.vue'

export default {
  name: 'RichCheckboxGroup',
  components: { Checkbox },
  model: { prop: 'checked', event: 'change' },
  props: {
    checked: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    error: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    flipped: { type: Boolean, default: false },
    label: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  emits: ['change', 'update:modelValue'],
  computed: {
    isChecked() {
      return this.modelValue !== undefined ? this.modelValue : this.checked
    },
    hasDescription() {
      return !!this.$slots['description'] || !!this.description
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

<style src="./rich-checkbox-group.css" scoped></style>
