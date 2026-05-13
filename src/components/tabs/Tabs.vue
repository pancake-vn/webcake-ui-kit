<template>
  <div class="ui-tabs" :class="`ui-tabs--${size}`">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      class="ui-tabs__item"
      :class="{
        'ui-tabs__item--active': tab.value === value,
        'ui-tabs__item--disabled': tab.disabled
      }"
      :disabled="tab.disabled || undefined"
      @click="select(tab.value)"
    >
      <span v-if="hasIconSlot" class="ui-tabs__icon"><slot name="tab-icon" :tab="tab" /></span>
      <span v-if="tab.label" class="ui-tabs__label">{{ tab.label }}</span>
      <span v-if="tab.counter > 0" class="ui-tabs__counter">{{ tab.counter }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    value: { type: [String, Number], default: null },
    tabs: {
      type: Array,
      default: function () {
        return []
      }
    },
    size: {
      type: String,
      default: 'sm',
      validator: function (v) {
        return ['xs', 'sm', 'md', 'lg'].includes(v)
      }
    }
  },
  emits: ['input', 'change'],
  computed: {
    hasIconSlot: function () {
      return !!((this.$scopedSlots && this.$scopedSlots['tab-icon']) || this.$slots['tab-icon'])
    }
  },
  methods: {
    select: function (val) {
      if (val === this.value) return
      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>

<style src="./tabs.css" scoped></style>
