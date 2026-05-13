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
    <path d="M12 22v-6" />
    <path d="M12 8V2" />
    <path d="M4 12H2" />
    <path d="M10 12H8" />
    <path d="M16 12h-2" />
    <path d="M22 12h-2" />
    <path d="m15 19-3 3-3-3" />
    <path d="m15 5-3-3-3 3" />
  </svg>
</template>

<script>
export default {
  name: 'UnfoldVerticalIcon',
  props: {
    size: { type: Number, default: 20 },
    label: { type: String, default: '' }
  },
  emits: []
}
</script>

<style src="./icon.css" scoped></style>
