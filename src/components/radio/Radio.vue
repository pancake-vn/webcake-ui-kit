<template>
  <label
    class="ui-radio"
    :class="{
      checked: isChecked,
      disabled: isDisabled,
      error: isError
    }"
  >
    <input type="radio" class="ui-radio__input" :checked="isChecked" :disabled="isDisabled" @change="handleChange" />

    <span class="ui-radio__inner"></span>

    <div class="ui-radio__label_wrapper">
      <span class="ui-radio__label">
        <slot>
          {{ label }}
        </slot>
      </span>
      <span class="ui-radio__label_extra">
        <slot name="extraLabel"></slot>
      </span>
    </div>
  </label>
</template>

<script>
export default {
  name: 'Radio',
  inject: {
    radioGroup: { default: null }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      required: true
    },
    checked: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isChecked() {
      return this.radioGroup ? this.radioGroup.value === this.value : this.checked
    },
    isDisabled() {
      return this.disabled || (this.radioGroup ? this.radioGroup.disabled : false)
    },
    isError() {
      return this.error || (this.radioGroup ? this.radioGroup.error : false)
    }
  },
  methods: {
    handleChange() {
      this.radioGroup.select(this.value)
    }
  }
}
</script>

<style src="./radio.css" scoped></style>
