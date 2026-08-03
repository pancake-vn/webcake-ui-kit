<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M15.125 20.125C15.7463 20.125 16.25 19.6213 16.25 19L16.25 5C16.25 4.37868 15.7463 3.875 15.125 3.875L5 3.875C4.37868 3.875 3.875 4.37868 3.875 5L3.875 19C3.875 19.6213 4.37868 20.125 5 20.125H15.125ZM5 21.875C3.41218 21.875 2.125 20.5878 2.125 19L2.125 5C2.125 3.41218 3.41218 2.125 5 2.125L15.125 2.125C16.7128 2.125 18 3.41218 18 5L18 19C18 20.5878 16.7128 21.875 15.125 21.875H5Z"
        fill="currentColor"
      />
      <path
        d="M21 21.875C21.4832 21.875 21.875 21.4832 21.875 21V3C21.875 2.51675 21.4832 2.125 21 2.125C20.5168 2.125 20.125 2.51675 20.125 3V21C20.125 21.4832 20.5168 21.875 21 21.875Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'DistanceRight',
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
