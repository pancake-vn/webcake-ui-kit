<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M9.55289 0.776523C9.67638 0.529534 9.9768 0.429396 10.2238 0.552891C10.4708 0.676385 10.5709 0.9768 10.4474 1.22379L4.44742 13.2238C4.32393 13.4708 4.02351 13.5709 3.77652 13.4474C3.52953 13.3239 3.4294 13.0235 3.55289 12.7765L9.55289 0.776523Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'Slash2',
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
