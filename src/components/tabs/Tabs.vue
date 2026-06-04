<template>
  <div class="ui-tabs" :class="`ui-tabs--${size}`">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      class="ui-tabs__item"
      :class="{
        'ui-tabs__item--active': tab.value === effectiveValue,
        'ui-tabs__item--disabled': tab.disabled,
        'ui-tabs__item--stretch': stretchItems,
        'ui-tabs__item--allow-deselect': allowDeselect
      }"
      :disabled="tab.disabled || undefined"
      @click="select(tab.value)"
    >
      <div class="ui-tabs__item-inner">
        <slot name="label" :tab="tab">
          <span v-if="tab.icon" class="ui-tabs__icon">
            <slot name="icon" :tab="tab">
              <component :is="tab.icon" />
            </slot>
          </span>
          <span v-if="tab.label" class="ui-tabs__label">{{ tab.label }}</span>
          <span v-if="tab.counter > 0" class="ui-tabs__counter">{{ tab.counter }}</span>
        </slot>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Tabs',

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    value: { type: [String, Number], default: null },
    modelValue: { default: null },
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
    },
    stretchItems: {
      type: Boolean,
      default: () => false
    },
    allowDeselect: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['input', 'change', 'update:modelValue'],

  computed: {
    effectiveValue: function () {
      return this.modelValue !== null ? this.modelValue : this.value
    }
  },

  methods: {
    select: function (value) {
      let val = value
      if (!this.allowDeselect && val == this.effectiveValue) return
      if (this.allowDeselect && val == this.effectiveValue) {
        val = undefined
      }
      this.$emit('input', val)
      this.$emit('update:modelValue', val)
      this.$emit('change', val)
    }
  }
}
</script>

<style src="./tabs.css" scoped></style>
