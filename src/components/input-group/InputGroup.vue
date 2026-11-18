<template>
  <div class="ui-input-group" role="group" :aria-label="label || undefined">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'InputGroup',
  props: {
    label: { type: String, default: '' }
  },
  emits: []
}
</script>

<style src="./input-group.css"></style>
