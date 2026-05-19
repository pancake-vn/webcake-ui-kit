<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 18V6" />
      <path d="M17 10v3a1 1 0 0 0 1 1h3" />
      <path d="M21 10v8" />
      <path d="M4 12h8" />
      <path d="M4 18V6" />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'Heading4',
  components: { BaseIcon },
  inheritAttrs: false,
  emits: [],
  computed: {
    listeners() {
      return this.$listeners || {}
    }
  }
}
</script>
