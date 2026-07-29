<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M8.875 3.875C8.25368 3.875 7.75 4.37868 7.75 5L7.75 19C7.75 19.6213 8.25368 20.125 8.875 20.125H19C19.6213 20.125 20.125 19.6213 20.125 19L20.125 5C20.125 4.37868 19.6213 3.875 19 3.875L8.875 3.875ZM19 2.125C20.5878 2.125 21.875 3.41218 21.875 5L21.875 19C21.875 20.5878 20.5878 21.875 19 21.875H8.875C7.28718 21.875 6 20.5878 6 19L6 5C6 3.41218 7.28718 2.125 8.875 2.125L19 2.125Z"
        fill="currentColor"
      />
      <path
        d="M3 2.125C2.51675 2.125 2.125 2.51675 2.125 3L2.125 21C2.125 21.4832 2.51675 21.875 3 21.875C3.48325 21.875 3.875 21.4832 3.875 21L3.875 3C3.875 2.51675 3.48325 2.125 3 2.125Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'DistanceLeft',
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
