<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <rect x="4.5" y="11.25" width="1.5" height="1.5" fill="currentColor" />
      <rect x="11.25" y="11.25" width="1.5" height="1.5" fill="currentColor" />
      <rect x="18" y="11.25" width="1.5" height="1.5" fill="currentColor" />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'SmallDot',
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
