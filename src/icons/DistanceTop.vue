<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.125 8.875C20.125 8.25368 19.6213 7.75 19 7.75H5C4.37868 7.75 3.875 8.25368 3.875 8.875V19C3.875 19.6213 4.37868 20.125 5 20.125H19C19.6213 20.125 20.125 19.6213 20.125 19V8.875ZM21.875 19C21.875 20.5878 20.5878 21.875 19 21.875H5C3.41218 21.875 2.125 20.5878 2.125 19V8.875C2.125 7.28718 3.41218 6 5 6H19C20.5878 6 21.875 7.28718 21.875 8.875V19Z"
        fill="currentColor"
      />
      <path
        d="M21.875 3C21.875 2.51675 21.4832 2.125 21 2.125H3C2.51675 2.125 2.125 2.51675 2.125 3C2.125 3.48325 2.51675 3.875 3 3.875H21C21.4832 3.875 21.875 3.48325 21.875 3Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'DistanceTop',
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
