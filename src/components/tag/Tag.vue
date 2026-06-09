<template>
  <span class="ui-tag" :class="[`ui-tag--type-${type}`, `ui-tag--${size}`, { 'ui-tag--with-icon': hasIcon }]">
    <span v-if="hasIcon" class="ui-tag__icon"><slot name="icon" /></span>
    <span class="ui-tag__label"
      ><slot>{{ label }}</slot></span
    >
    <span v-if="counter > 0" class="ui-tag__counter">{{ counter }}</span>
    <button v-if="closable" class="ui-tag__close" type="button" @click.stop="$emit('close')">
      <WkiX :size="12" class="ui-tag__close-icon" />
    </button>
  </span>
</template>

<script>
import { WkiX } from '../../icons'
export default {
  name: 'Tag',
  components: { WkiX },
  props: {
    type: {
      type: String,
      default: 'outline',
      validator: function (v) {
        return ['default', 'outline'].includes(v)
      }
    },
    size: {
      type: String,
      default: 'md',
      validator: function (v) {
        return ['sm', 'md', 'lg'].includes(v)
      }
    },
    counter: { type: Number, default: 0 },
    closable: { type: Boolean, default: false },
    label: { type: String, default: '' }
  },
  emits: ['close'],
  computed: {
    hasIcon: function () {
      return !!((this.$scopedSlots && this.$scopedSlots['icon']) || this.$slots['icon'])
    }
  }
}
</script>

<style src="./tag.css" scoped></style>
