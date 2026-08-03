<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M17.6852 9.55555C17.6852 8.69606 17.344 7.8715 16.7363 7.26374C16.1285 6.65599 15.3039 6.31481 14.4444 6.31481H5.40741C4.90626 6.31481 4.5 5.90855 4.5 5.40741C4.5 4.90626 4.90626 4.5 5.40741 4.5H14.4444C15.7853 4.5 17.0713 5.03251 18.0194 5.98061C18.9675 6.92871 19.5 8.21474 19.5 9.55555V18.7222C19.5 19.2234 19.0937 19.6296 18.5926 19.6296C18.0914 19.6296 17.6852 19.2234 17.6852 18.7222V9.55555Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'CornerTopRight',
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
