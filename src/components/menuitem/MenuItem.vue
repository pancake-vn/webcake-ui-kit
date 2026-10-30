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
    @click.stop="handleClick"
  >
    <span v-if="_hasSlotContent('prefix')" class="ui-menuitem__prefix">
      <slot name="prefix"></slot>
    </span>
    <div class="ui-menuitem__wrapper">
      <span class="ui-menuitem__label">{{ label }}</span>
      <span v-if="description" class="ui-menuitem__description">{{ description }}</span>
    </div>
    <span v-if="_hasSlotContent('suffix')" class="ui-menuitem__suffix">
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
    description: {
      type: String,
      default: ''
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
    },

    _hasSlotContent(name) {
      var slot = this.$slots[name]
      if (!slot) return false
      var nodes = typeof slot === 'function' ? slot() : slot
      if (!Array.isArray(nodes) || !nodes.length) return false
      return nodes.some(function (n) {
        if (!n) return false
        if (n.tag) return true
        if (typeof n.text === 'string' && n.text.trim()) return true
        if (n.type !== undefined && typeof n.type !== 'symbol') return true
        return false
      })
    }
  }
}
</script>

<style src="./menuitem.css" scoped></style>
