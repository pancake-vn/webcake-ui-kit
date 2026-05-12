<template>
  <div class="ui-switch-group" :class="[`ui-switch-group--${layout}`, { 'ui-switch-group--disabled': disabled }]">
    <WkSwitch :value="value" :disabled="disabled" @change="$emit('change', $event)" @input="$emit('input', $event)" />
    <span class="ui-switch-group__label"
      ><slot>{{ label }}</slot></span
    >
  </div>
</template>

<script>
import WkSwitch from '../switch/Switch.vue'

export default {
  name: 'SwitchGroup',
  components: { WkSwitch },
  props: {
    value: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    layout: {
      type: String,
      default: 'inline',
      validator: function (v) {
        return ['inline', 'block'].indexOf(v) !== -1
      }
    },
    label: { type: String, default: '' }
  },
  emits: ['change', 'input']
}
</script>

<style src="./switch_group.css" scoped></style>
