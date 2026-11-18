<template>
  <span :class="['ui-input-group__addon', `ui-input-group__addon--size-${size}`]">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'InputGroupAddon',
  props: {
    size: {
      type: String,
      default: 'md',
      validator: v => ['tiny', 'xs', 'sm', 'md', 'lg'].includes(v)
    }
  },
  emits: []
}
</script>

<style src="./input-group-addon.css"></style>
