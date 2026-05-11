<template>
  <div :class="['ui-accordion', bordered && 'ui-accordion--bordered']">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Accordion',
  model: { prop: 'value', event: 'change' },
  props: {
    bordered: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    value: { type: [Array, Number, String], default: undefined },
    modelValue: { type: [Array, Number, String], default: undefined },
    defaultOpen: { type: [Array, Number, String], default: () => [] }
  },
  emits: ['change', 'update:modelValue'],
  provide() {
    return {
      accordion: this
    }
  },
  data() {
    const initial =
      this.modelValue !== undefined ? this.modelValue : this.value !== undefined ? this.value : this.defaultOpen
    return {
      internalKeys: this.normalizeKeys(initial)
    }
  },
  computed: {
    isControlled() {
      return this.modelValue !== undefined || this.value !== undefined
    },
    openKeys() {
      if (this.modelValue !== undefined) return this.normalizeKeys(this.modelValue)
      if (this.value !== undefined) return this.normalizeKeys(this.value)
      return this.internalKeys
    }
  },
  methods: {
    normalizeKeys(v) {
      if (Array.isArray(v)) return v.slice()
      if (v === undefined || v === null || v === '') return []
      return [v]
    },
    isOpen(key) {
      return this.openKeys.indexOf(key) !== -1
    },

    toggle(key) {
      const isOpen = this.isOpen(key)
      let newKeys
      if (this.multiple) {
        newKeys = isOpen ? this.openKeys.filter(k => k !== key) : this.openKeys.concat([key])
      } else {
        newKeys = isOpen ? [] : [key]
      }
      const emitVal = this.multiple ? newKeys : newKeys.length > 0 ? newKeys[0] : null
      if (!this.isControlled) {
        this.internalKeys = newKeys
      }
      this.$emit('change', emitVal)
      this.$emit('update:modelValue', emitVal)
    }
  }
}
</script>

<style src="./accordion.css" scoped></style>
