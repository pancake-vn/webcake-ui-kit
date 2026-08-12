<template>
  <div
    class="ui-item"
    :class="[
      `ui-item--variant-${variant}`,
      asChild && `ui-item--as-child`,
      active && 'ui-item--active',
      `ui-item--size-${size}`,
      `ui-item--layout-${layout}`
    ]"
    :style="{ width: typeof width == 'string' ? width : `${width}px` }"
  >
    <div class="ui-item--prefix">
      <slot name="prefix"></slot>
    </div>
    <slot>
      <div class="ui-item-label-wrapper">
        <div class="ui-item--label wk-paragraph-small wk-weight-medium">
          {{ label }}
        </div>
        <div v-if="description && layout == 'vertical'" class="ui-item--description wk-paragraph-mini">
          {{ description }}
        </div>
      </div>
    </slot>
    <div class="ui-item--suffix">
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WkItem',
  props: {
    label: String,
    variant: {
      type: String,
      validator: v => ['default', 'muted', 'outline'].includes(v),
      default: 'default'
    },
    asChild: Boolean,
    active: Boolean,
    size: {
      type: String,
      validator: v => ['md', 'sm'].includes(v),
      default: 'md'
    },
    layout: {
      type: String,
      validator: v => ['horizontal', 'vertical'].includes(v),
      default: 'horizontal'
    },
    description: String,
    width: {
      type: [String, Number]
    }
  },
  emits: [],
  data() {
    return {
      // Add component state
    }
  },
  computed: {
    // Add computed properties
  },
  methods: {
    // Add methods
  }
}
</script>

<style src="./item.css" scoped></style>
