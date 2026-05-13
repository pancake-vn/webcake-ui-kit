<template>
  <svg
    class="ui-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-hidden="label ? undefined : 'true'"
    :aria-label="label || undefined"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
</template>

<script>
export default {
  name: 'EllipsisIcon',
  props: {
    size: { type: Number, default: 20 },
    label: { type: String, default: '' }
  },
  emits: []
}
</script>

<style src="./icon.css" scoped></style>
