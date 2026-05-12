<template>
  <div
    class="ui-rich-switch-group"
    :class="{
      'ui-rich-switch-group--flipped': flipped,
      'ui-rich-switch-group--disabled': disabled
    }"
  >
    <div v-if="!flipped" class="ui-rich-switch-group__aligner">
      <Switch :value="value" :disabled="disabled" @change="$emit('change', $event)" @input="$emit('input', $event)" />
    </div>
    <div class="ui-rich-switch-group__content">
      <span class="ui-rich-switch-group__label"
        ><slot>{{ label }}</slot></span
      >
      <span v-if="hasDescription" class="ui-rich-switch-group__description">
        <slot name="description">{{ description }}</slot>
      </span>
    </div>
    <div v-if="flipped" class="ui-rich-switch-group__aligner">
      <Switch :value="value" :disabled="disabled" @change="$emit('change', $event)" @input="$emit('input', $event)" />
    </div>
  </div>
</template>

<script>
import Switch from '../switch/Switch.vue'

export default {
  name: 'RichSwitchGroup',
  components: { Switch: Switch },
  props: {
    value: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    flipped: { type: Boolean, default: false },
    label: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  emits: ['change', 'input'],
  computed: {
    hasDescription: function () {
      var hasSlot = !!((this.$scopedSlots && this.$scopedSlots['description']) || this.$slots['description'])
      return hasSlot || !!this.description
    }
  }
}
</script>

<style src="./rich_switch_group.css" scoped></style>
