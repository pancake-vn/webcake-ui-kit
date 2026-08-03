<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.16667 18.1667C5.66667 18.1667 5.33333 17.8333 5.33333 17.3333V6.66667C5.33333 6.16667 5.66667 5.83333 6.16667 5.83333C6.66667 5.83333 7 6.16667 7 6.66667V17.3333C7 17.8333 6.66667 18.1667 6.16667 18.1667Z"
        fill="currentColor"
      />
      <path
        d="M21.1667 22H2.83333C2.33333 22 2 21.6667 2 21.1667V2.83333C2 2.33333 2.33333 2 2.83333 2H21.1667C21.6667 2 22 2.33333 22 2.83333V21.1667C22 21.6667 21.6667 22 21.1667 22ZM3.66667 20.3333H20.3333V3.66667H3.66667V20.3333Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'PaddingLeft',
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
