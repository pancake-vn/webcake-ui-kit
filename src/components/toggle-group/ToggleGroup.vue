<template>
  <div class="ui-toggle-group" role="group" :aria-label="label || undefined">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ToggleGroup',
  model: { prop: 'value', event: 'change' },
  props: {
    value: { type: [String, Number, Array], default: null },
    modelValue: { type: [String, Number, Array], default: undefined },
    multiple: { type: Boolean, default: false },
    label: { type: String, default: '' },
    size: {
      type: String,
      default: 'md',
      validator: v => ['xs', 'sm', 'md', 'lg'].includes(v)
    }
  },
  emits: ['change', 'update:modelValue'],
  provide() {
    return { toggleGroupCtx: this, groupSize: this.size }
  },
  computed: {
    computedValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value
    }
  },
  methods: {
    select(val) {
      if (val === null || val === undefined) return
      let next
      if (this.multiple) {
        const arr = Array.isArray(this.computedValue) ? [...this.computedValue] : []
        const idx = arr.indexOf(val)
        if (idx >= 0) arr.splice(idx, 1)
        else arr.push(val)
        next = arr
      } else {
        next = this.computedValue === val ? null : val
      }
      this.$emit('change', next)
      this.$emit('update:modelValue', next)
    },
    isSelected(val) {
      if (val === null || val === undefined) return false
      const v = this.computedValue
      if (this.multiple) return Array.isArray(v) && v.includes(val)
      return v === val
    }
  }
}
</script>

<style src="./toggle-group.css"></style>
