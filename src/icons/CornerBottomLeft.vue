<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.31481 14.5741C6.31481 15.4336 6.65598 16.2581 7.26374 16.8659C7.8715 17.4736 8.69606 17.8148 9.55556 17.8148H18.5926C19.0937 17.8148 19.5 18.2211 19.5 18.7222C19.5 19.2234 19.0937 19.6296 18.5926 19.6296H9.55556C8.21474 19.6296 6.92871 19.0971 5.98061 18.149C5.03251 17.2009 4.5 15.9149 4.5 14.5741L4.5 5.4074C4.5 4.90626 4.90626 4.5 5.40741 4.5C5.90855 4.5 6.31481 4.90626 6.31481 5.40741L6.31481 14.5741Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'CornerBottomLeft',
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
