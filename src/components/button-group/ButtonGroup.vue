<template>
  <div class="ui-button-group" role="group" :aria-label="label || undefined" @click="onClick">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ButtonGroup',
  props: {
    label: { type: String, default: '' }
  },
  emits: ['click'],
  methods: {
    onClick(e) {
      const btn = e.target.closest('.ui-btn')
      if (!btn || !this.$el.contains(btn)) return
      const value = btn.getAttribute('value') || btn.textContent.trim()
      this.$emit('click', value, e)
    }
  }
}
</script>

<style src="./button-group.css"></style>
