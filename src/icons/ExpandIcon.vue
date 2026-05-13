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
    <path d="m15 15 6 6" />
    <path d="m15 9 6-6" />
    <path d="M21 16v5h-5" />
    <path d="M21 8V3h-5" />
    <path d="M3 16v5h5" />
    <path d="m3 21 6-6" />
    <path d="M3 8V3h5" />
    <path d="M9 9 3 3" />
  </svg>
</template>

<script>
export default {
  name: 'ExpandIcon',
  props: {
    size: { type: Number, default: 20 },
    label: { type: String, default: '' }
  },
  emits: []
}
</script>

<style src="./icon.css" scoped></style>
