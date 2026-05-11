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
      <svg v-if="isChecked" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M11.3055 3.13885C11.5049 2.93952 11.8285 2.93952 12.0279 3.13885C12.2272 3.33818 12.2272 3.66185 12.0279 3.86118L5.61119 10.2778C5.41186 10.4772 5.08819 10.4772 4.88886 10.2778L1.97219 7.36118C1.77286 7.16185 1.77286 6.83818 1.97219 6.63885C2.17152 6.43952 2.49519 6.43952 2.69452 6.63885L5.25002 9.19435L11.3055 3.13885Z"
          fill="white"
        />
      </svg>
    </span>
  </span>
</template>

<script>
export default {
  name: 'Checkbox',
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
