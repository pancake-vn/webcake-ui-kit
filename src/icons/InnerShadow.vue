<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        opacity="0.3"
        d="M3 6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6C21 7.10457 20.1046 8 19 8H5C3.89543 8 3 7.10457 3 6Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20.8188 19.0986C20.936 18.7828 21 18.4411 21 18.0845V5.91549C21 4.30531 19.6947 3 18.0845 3H5.91549C4.30531 3 3 4.30531 3 5.91549V18.0845C3 18.4411 3.06402 18.7828 3.1812 19.0986C3.59313 20.2088 4.66192 21 5.91549 21H18.0845C19.3381 21 20.4069 20.2088 20.8188 19.0986ZM19.2254 5.91549C19.2254 5.28542 18.7146 4.77465 18.0845 4.77465H5.91549C5.28542 4.77465 4.77465 5.28542 4.77465 5.91549V17.4288V18.0845C4.77465 18.7146 5.28542 19.2254 5.91549 19.2254H18.0845C18.7146 19.2254 19.2254 18.7146 19.2254 18.0845V17.4288V5.91549Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'InnerShadow',
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
