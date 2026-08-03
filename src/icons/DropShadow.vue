<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        opacity="0.3"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.91549 21C4.93938 21 4.0753 20.5203 3.54614 19.7838C3.28762 20.1208 3.13398 20.5424 3.13398 21C3.13398 22.1046 4.02941 23 5.13398 23H19.134C20.2385 23 21.134 22.1046 21.134 21C21.134 20.4592 20.9193 19.9684 20.5705 19.6084C20.0576 20.4433 19.1361 21 18.0845 21H5.91549Z"
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
  name: 'DropShadow',
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
