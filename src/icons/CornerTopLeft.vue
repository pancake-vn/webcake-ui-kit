<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M9.49074 6.37962C8.63124 6.37962 7.80668 6.72079 7.19892 7.32855C6.59117 7.9363 6.25 8.76087 6.25 9.62036L6.24999 18.6574C6.24999 19.1585 5.84373 19.5648 5.34259 19.5648C4.84144 19.5648 4.43518 19.1585 4.43518 18.6574L4.43518 9.62036C4.43518 8.27955 4.9677 6.99352 5.9158 6.04542C6.8639 5.09732 8.14992 4.56481 9.49074 4.56481L18.6574 4.56481C19.1585 4.56481 19.5648 4.97107 19.5648 5.47222C19.5648 5.97336 19.1585 6.37962 18.6574 6.37962L9.49074 6.37962Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'CornerTopLeft',
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
