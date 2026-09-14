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
    <div v-if="showRadio" class="ui-item-radio--container">
      <Radio :checked="checked" />
    </div>
    <div v-if="showCheckbox" class="ui-item-checkbox--container">
      <Checkbox :checked="checked" />
    </div>
    <div v-if="$slots.prefix" class="ui-item--prefix">
      <slot name="prefix"></slot>
    </div>
    <slot>
      <div class="ui-item-label-wrapper">
        <div class="ui-item--label wk-paragraph-small wk-weight-medium">
          {{ label }}
        </div>
        <div v-if="description" class="ui-item--description wk-paragraph-mini">
          {{ description }}
        </div>
      </div>
    </slot>
    <div v-if="showCheckboxSuffix" class="ui-item-checkbox--container">
      <Checkbox :checked="checked" />
    </div>
    <div v-if="$slots.prefix" class="ui-item--suffix">
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<script>
import Radio from '../radio/Radio.vue'
import Checkbox from '../checkbox/Checkbox.vue'
export default {
  name: 'WkItem',
  components: {
    Radio,
    Checkbox
  },
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
    },
    showRadio: Boolean,
    showCheckbox: Boolean,
    showCheckboxSuffix: Boolean,
    checked: Boolean
  },
  emits: [],
  data() {},
  mounted() {},
  computed: {},
  methods: {
    // Add methods
  }
}
</script>

<style src="./item.css" scoped></style>
