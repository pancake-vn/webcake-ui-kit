<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M14.5092 17.75C15.3687 17.75 16.1933 17.4088 16.8011 16.8011C17.4088 16.1933 17.75 15.3688 17.75 14.5093V5.47222C17.75 4.97107 18.1562 4.56481 18.6574 4.56481C19.1585 4.56481 19.5648 4.97107 19.5648 5.47222V14.5093C19.5648 15.8501 19.0323 17.1361 18.0842 18.0842C17.1361 19.0323 15.8501 19.5648 14.5092 19.5648L5.34258 19.5648C4.84144 19.5648 4.43518 19.1586 4.43518 18.6574C4.43518 18.1563 4.84144 17.75 5.34259 17.75H14.5092Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'CornerBottomRight',
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
