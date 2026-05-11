<template>
  <button
    class="ui-switch"
    :class="{ 'ui-switch--on': value }"
    role="switch"
    type="button"
    :aria-checked="value ? 'true' : 'false'"
    :disabled="disabled || undefined"
    @click="toggle"
  >
    <span class="ui-switch__thumb" />
  </button>
</template>

<script>
export default {
  props: {
    value: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  emits: ['change', 'input'],
  methods: {
    toggle: function () {
      var next = !this.value
      this.$emit('input', next)
      this.$emit('change', next)
    }
  }
}
</script>

<style src="./switch.css" scoped></style>
