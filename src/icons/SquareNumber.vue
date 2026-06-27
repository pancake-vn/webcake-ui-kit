<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.125 5C20.125 4.37868 19.6213 3.875 19 3.875H5C4.37868 3.875 3.875 4.37868 3.875 5V19C3.875 19.6213 4.37868 20.125 5 20.125H19C19.6213 20.125 20.125 19.6213 20.125 19V5ZM21.875 19C21.875 20.5878 20.5878 21.875 19 21.875H5C3.41218 21.875 2.125 20.5878 2.125 19V5C2.125 3.41218 3.41218 2.125 5 2.125H19C20.5878 2.125 21.875 3.41218 21.875 5V19Z"
        fill="currentColor"
      />
      <path
        d="M13.0435 8.47455C13.0435 7.91043 12.5868 7.45312 12.0234 7.45312H9.69192C9.12856 7.45312 8.67188 7.91043 8.67188 8.47455C8.67188 9.03866 9.12856 9.49597 9.69192 9.49597H11.0034V14.4572H9.69192C9.12856 14.4572 8.67188 14.9145 8.67188 15.4786C8.67188 16.0427 9.12856 16.5 9.69192 16.5H14.355C14.9183 16.5 15.375 16.0427 15.375 15.4786C15.375 14.9145 14.9183 14.4572 14.355 14.4572H13.0435V8.47455Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'SquareNumber',
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
