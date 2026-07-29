<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3.875 15.125C3.875 15.7463 4.37868 16.25 5 16.25L19 16.25C19.6213 16.25 20.125 15.7463 20.125 15.125V5C20.125 4.37868 19.6213 3.875 19 3.875L5 3.875C4.37868 3.875 3.875 4.37868 3.875 5L3.875 15.125ZM2.125 5C2.125 3.41218 3.41218 2.125 5 2.125L19 2.125C20.5878 2.125 21.875 3.41218 21.875 5V15.125C21.875 16.7128 20.5878 18 19 18L5 18C3.41218 18 2.125 16.7128 2.125 15.125L2.125 5Z"
        fill="currentColor"
      />
      <path
        d="M2.125 21C2.125 21.4832 2.51675 21.875 3 21.875H21C21.4832 21.875 21.875 21.4832 21.875 21C21.875 20.5168 21.4832 20.125 21 20.125H3C2.51675 20.125 2.125 20.5168 2.125 21Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'DistanceBottom',
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
