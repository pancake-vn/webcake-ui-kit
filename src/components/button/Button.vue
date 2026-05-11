<template>
  <button
    :class="[
      'ui-btn',
      `ui-btn--${variant}`,
      `ui-btn--${size}`,
      `ui-btn--round-${roundness}`,
      isIconOnly && 'ui-btn--icon-only',
      loading && 'ui-btn--loading'
    ]"
    :type="htmlType"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- Left Icon / Spinner -->
    <span v-if="loading" class="ui-btn__icon ui-btn__spinner">
      <LoaderIconVue />
    </span>
    <template v-if="showLeftIcon">
      <span v-if="hasIconOnly" class="ui-btn__icon">
        <slot name="icon"></slot>
      </span>
      <span v-if="hasIconLeft" class="ui-btn__icon">
        <slot name="icon-left"></slot>
      </span>
    </template>

    <!-- Label -->
    <span v-if="!isIconOnly && (hasDefaultSlot || label)" class="ui-btn__label">
      <slot>{{ label }}</slot>
    </span>

    <!-- Right Icon -->
    <span v-if="hasIconRight" class="ui-btn__icon">
      <slot name="icon-right"></slot>
    </span>
  </button>
</template>

<script>
import LoaderIconVue from '../../icons/LoaderIcon.vue'

export default {
  name: 'Button',
  components: {
    LoaderIconVue
  },
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: v => ['primary', 'neutral', 'secondary', 'outline', 'ghost', 'destructive', 'link'].includes(v)
    },
    size: {
      type: String,
      default: 'md',
      validator: v => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v)
    },
    roundness: {
      type: String,
      default: 'default',
      validator: v => ['default', 'round'].includes(v)
    },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    htmlType: {
      type: String,
      default: 'button',
      validator: v => ['button', 'submit', 'reset'].includes(v)
    }
  },
  emits: ['click'],
  computed: {
    hasIconLeft() {
      return !!this.$slots['icon-left']
    },
    hasIconRight() {
      return !this.loading && !!this.$slots['icon-right']
    },
    hasIconOnly() {
      return !!this.$slots['icon']
    },
    hasDefaultSlot() {
      return !!this.$slots['default']
    },
    isIconOnly() {
      const iconCount = [this.hasIconOnly, this.hasIconLeft, this.hasIconRight].filter(Boolean).length
      return !this.label && !this.hasDefaultSlot && iconCount === 1
    },
    showLeftIcon() {
      return !this.loading && (this.hasIconLeft || this.hasIconOnly)
    }
  },
  methods: {
    handleClick(e) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', e)
      }
    }
  }
}
</script>

<style src="./button.css" scoped></style>
