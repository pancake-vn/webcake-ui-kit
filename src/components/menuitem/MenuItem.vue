<template>
  <div
    class="ui-menuitem"
    :class="{
      'ui-menuitem--active': active,
      'ui-menuitem--disabled': disabled,
      'ui-menuitem--error': type === 'error',
      [`ui-menuitem--${size}`]: size
    }"
    :title="label"
    @click="handleClick"
  >
    <span v-if="$slots.prefix" class="ui-menuitem__prefix">
      <slot name="prefix"></slot>
    </span>
    <span class="ui-menuitem__label">{{ label }}</span>
    <span v-if="$slots.suffix" class="ui-menuitem__suffix">
      <slot name="suffix"></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',

  props: {
    type: {
      type: String,
      default: 'default',
      validator: function (value) {
        return ['default', 'error'].indexOf(value) !== -1
      }
    },
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: null
    },
    label: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'md',
      validator: function (value) {
        return ['sm', 'md', 'lg'].indexOf(value) !== -1
      }
    }
  },

  emits: ['click'],

  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit('click', this.value)
      }
    }
  }
}
</script>

<style src="./menuitem.css" scoped></style>
