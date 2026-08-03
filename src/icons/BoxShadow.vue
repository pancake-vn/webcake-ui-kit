<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20.8188 19.0986C20.936 18.7828 21 18.4411 21 18.0845V5.91549C21 4.30531 19.6947 3 18.0845 3H5.91549C4.30531 3 3 4.30531 3 5.91549V18.0845C3 18.4411 3.06402 18.7828 3.1812 19.0986C3.59313 20.2088 4.66192 21 5.91549 21H18.0845C19.3381 21 20.4069 20.2088 20.8188 19.0986ZM19.2254 5.91549C19.2254 5.28542 18.7146 4.77465 18.0845 4.77465H5.91549C5.28542 4.77465 4.77465 5.28542 4.77465 5.91549V17.4288V18.0845C4.77465 18.7146 5.28542 19.2254 5.91549 19.2254H18.0845C18.7146 19.2254 19.2254 18.7146 19.2254 18.0845V17.4288V5.91549Z"
        fill="currentColor"
      />
      <path
        opacity="0.3"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5 20.8534V21C5 22.1046 5.89543 23 7 23H21C22.1046 23 23 22.1046 23 21V6C23 4.89543 22.1046 4 21 4H20.2825C20.7294 4.51231 21 5.1823 21 5.9155V18.0845C21 18.4411 20.936 18.7828 20.8188 19.0986C20.4069 20.2088 19.3381 21 18.0845 21H5.9155C5.59569 21 5.28792 20.9485 5 20.8534Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'BoxShadow',
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
